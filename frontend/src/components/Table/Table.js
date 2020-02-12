import React, { useState, useEffect } from "react";
import Button from "../Button/Button.js";
import Input from "../Input/Input.js";
import Form from "../Form/Form.js";
import "./Table.css";

function Table(props) {
  const [editing, setEditing] = useState({});

  let tableHeader = [];
  let tableContent = [];

  // sets all items editing states to false
  useEffect(() => {
    let populatedEditing = {};
    if (props.json) {
      props.json.rows.forEach(item => {
        populatedEditing[item.id] = false;
      });
    }
    setEditing(populatedEditing);
  }, [props.json]);

  if (props.json) {
    let jsonKeys = [];
    for (let index in props.json.rows) {
      let item = props.json.rows[index];
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

    props.json.rows.forEach((item, i) => {
      let tableRow = [];
      headers.forEach((columnName, i) => {
        let rowContent = item[columnName] || "❔";

        switch (columnName.toLowerCase()) {
          case "id":
            break;
          case "image":
            if (!editing[item.id]) {
              rowContent = <img src={item[columnName]} alt={`${item.name}`} />;
            } else {
              rowContent = (
                <Input type="file" name={columnName} form="editedRow" />
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
              // clone editing into a new object:
              // we have to spreader it to clone it
              // otherwise it will not detect a difference
              // and not re-render
              let newEditing = { ...editing };
              // set the editing state of the current items id to true
              newEditing[item.id] = true;
              // update editing
              setEditing(newEditing);
            }}
          />
          <Button
            // key="deleteButton"
            text="Delete"
            cssclass="danger"
            disabled={Object.values(editing).includes(true)}
            onClick={event => {
              event.preventDefault();
              props.delete(event, item.id);
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
              onClick={event => {
                event.preventDefault();
                props.edit(event, item.id);
              }}
            />
            <Button
              cssclass="warning"
              text="Discard"
              onClick={event => {
                event.preventDefault();
                let newEditing = { ...editing };
                newEditing[item.id] = false;
                setEditing(newEditing);
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
        case "image":
          tableData = <Input name={item} type="file" form="addRow" />;
          break;
        default:
          tableData = <Input name={item} form="addRow" />;
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
        />
        <Button
          key={"clear"}
          text="Clear"
          cssclass="warning"
          type="reset"
          form="addRow"
        />
      </td>
    );

    tableContent.push(
      <tr key={props.json.rows.length + 1}>
        {addRowInputs}
        {addButtons}
      </tr>
    );
  }
  return (
    <>
      <Form id="editedRow" />
      <Form id="addRow" onSubmit={props.add} />
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
