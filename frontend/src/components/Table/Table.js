import React, { useState, useEffect } from "react";
import Button from "../Button/Button.js";
import Input from "../Input/Input.js";
import Form from "../Form/Form.js";
import "./Table.css";

function handleSubmission(event, method, action) {
  event.preventDefault();

  const HTMLForm = event.target;

  const form = new FormData(HTMLForm);
  // reset html form
  HTMLForm.reset();

  return fetch(action, {
    method: method,
    body: form
  });
}

function Table(props) {
  const [editing, setEditing] = useState({});
  const [data, setData] = useState(undefined);

  const updateDataSource = () => {
    fetch(`http://localhost:9001/${props.route}`, { method: "GET" })
      .then(response => response.json())
      .then(data => {
        setData(data);
      });
  };

  let tableHeader = [];
  let tableContent = [];

  const toggleEdit = id => {
    // clone editing into a new object:
    // we have to spreader it to clone it
    // otherwise it will not detect a difference
    // and not re-render
    let editingClone = { ...editing };
    // toggle the editing state of the current items id
    editingClone[id] = !editingClone[id];
    // update editing
    setEditing(editingClone);
  };

  useEffect(updateDataSource, []);

  useEffect(() => {
    // sets all items editing states to false
    let populatedEditing = {};
    if (data) {
      data.rows.forEach(item => {
        populatedEditing[item.id] = false;
      });
    }
    setEditing(populatedEditing);
  }, [data]);

  if (data) {
    let jsonKeys = [];
    for (let index in data.rows) {
      let item = data.rows[index];
      jsonKeys.push(...Object.keys(item));
    }
    let headers = [...new Set(jsonKeys)];

    headers.forEach((item, i) => {
      tableHeader.push(
        <th scope="col" key={i}>
          {item}
        </th>
      );
    });

    tableHeader.push(
      <th scope="col" key={headers.length + 1}>
        Actions
      </th>
    );

    data.rows.forEach((item, i) => {
      let tableRow = [];
      headers.forEach((columnName, i) => {
        let rowContent = item[columnName] || "❔";

        switch (columnName.toLowerCase()) {
          case "id":
            break;
          case "image":
            if (!editing[item.id]) {
              rowContent = <img src={item[columnName]} alt={item.name} />;
            } else {
              rowContent = (
                <>
                  <img src={item[columnName]} alt={item.name} />
                  <Input type="file" name={columnName} form="editedRow" />
                </>
              );
            }
            break;
          default:
            if (editing[item.id]) {
              rowContent = (
                <Input
                  name={columnName}
                  required={true}
                  initialValue={item[columnName]}
                  form="editedRow"
                />
              );
            }
        }

        tableRow.push(<td key={i}>{rowContent}</td>);
      });

      let actionButtons = (
        <td>
          <Button
            text="Edit"
            cssclass="primary"
            disabled={Object.values(editing).includes(true)}
            onClick={event => {
              event.preventDefault();
              toggleEdit(item.id);
            }}
          />
          <Button
            // key="deleteButton"
            text="Delete"
            cssclass="danger"
            disabled={Object.values(editing).includes(true)}
            onClick={event => {
              event.preventDefault();
              fetch(`http://localhost:9001/${props.route}/${item.id}`, {
                method: "DELETE"
              }).then(result => {
                updateDataSource();
              });
            }}
          />
        </td>
      );

      if (editing[item.id]) {
        actionButtons = (
          <td>
            <Button
              cssclass="accept"
              type="submit"
              text="Save"
              form="editedRow"
            />
            <Button
              cssclass="warning"
              text="Cancel"
              onClick={event => {
                event.preventDefault();
                toggleEdit(item.id);
              }}
            />
          </td>
        );
      }

      tableContent.push(
        <tr key={i}>
          {tableRow}
          {actionButtons}
        </tr>
      );
    });

    let addRowInputs = [];
    headers.forEach((item, i) => {
      let tableData;
      switch (item.toLowerCase()) {
        case "id":
          tableData = "❔";
          break;
        default:
          tableData = (
            <Input
              name={item}
              type={item.toLowerCase() === "image" ? "file" : undefined}
              form="addRow"
              disabled={Object.values(editing).includes(true)}
            />
          );
      }
      addRowInputs.push(<td key={i}>{tableData}</td>);
    });

    let addButtons = [];
    addButtons.push(
      <td key={0}>
        <Button
          key={"add"}
          text="Add"
          cssclass="accept"
          type="submit"
          form="addRow"
          disabled={Object.values(editing).includes(true)}
        />
        <Button
          key={"clear"}
          text="Clear"
          cssclass="warning"
          type="reset"
          form="addRow"
          disabled={Object.values(editing).includes(true)}
        />
      </td>
    );

    tableContent.push(
      <tr key={data.rows.length + 1}>
        {addRowInputs}
        {addButtons}
      </tr>
    );
  }

  return (
    <>
      <Form
        id="editedRow"
        onSubmit={event => {
          let itemIDs = Object.keys(editing);
          let currentID = itemIDs.filter(id => {
            return editing[id];
          });
          handleSubmission(
            event,
            "PATCH",
            `http://localhost:9001/${props.route}/${currentID[0]}`
          ).then(result => {
            updateDataSource();
          });
        }}
      />
      <Form
        id="addRow"
        onSubmit={event => {
          handleSubmission(
            event,
            "POST",
            `http://localhost:9001/${props.route}/new`
          ).then(result => {
            updateDataSource();
          });
        }}
      />
      <table>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    </>
  );
}

export default Table;
