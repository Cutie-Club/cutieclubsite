import React, { useState, useEffect } from "react";
import Input from "../Input/Input.js";
import Form from "../Form/Form.js";
import handleSubmission from "../../utils/handleSubmission.js";
import createHeaders from "./createHeaders.js";
import createButtons from "./createButtons.js";
import "./Table.css";

function Table(props) {
  // init hooks
  const [editing, setEditing] = useState(undefined);
  const [data, setData] = useState(undefined);

  // declare helper functions
  const updateDataSource = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/${props.route}`, { method: "GET" })
      .then(response => response.json())
      .then(data => {
        setData(data);
      });
  };

  const toggleEdit = id => {
    // clone editing into a new object:
    // we have to spreader it to clone it
    // otherwise it will not detect a difference
    // and not re-render
    let editingClone = { ...editing };
    // toggle the editing state of the current items id
    editingClone[id] = !editingClone[id];
    setEditing(editingClone);
  };

  // setup effect hooks
  useEffect(updateDataSource, []);
  useEffect(() => {
    if (data) {
      let populatedEditing = {};
      data.rows.forEach(item => {
        populatedEditing[item.id] = false;
      });
      setEditing(populatedEditing);
    }
  }, [data]);

  // declare table variables
  let tableHeader = [];
  let tableContent = [];

  if (data && editing) {
    let headers = createHeaders(data.rows, tableHeader);

    for (let rowIndex = 0; rowIndex < data.rows.length + 1; rowIndex++) {
      let newRow = [];
      let currentRow = data.rows[rowIndex];
      headers.forEach((columnName, i) => {
        let cellContent = (
          <Input
            name={columnName}
            type={columnName.toLowerCase() === "image" ? "file" : undefined}
            form="addRow"
            disabled={Object.values(editing).includes(true)}
          />
        );
        switch (columnName.toLowerCase()) {
          case "image":
            if (rowIndex !== data.rows.length) {
              cellContent = (
                <img src={currentRow[columnName]} alt={currentRow.name} />
              );
            }
            break;
          case "actions":
            cellContent = createButtons(
              updateDataSource,
              toggleEdit,
              editing,
              currentRow,
              props.route
            );
            break;
          case "id":
            if (rowIndex !== data.rows.length) {
              cellContent = currentRow[columnName] || "❔";
            } else {
              cellContent = "🆕";
            }
            break;
          default:
            if (rowIndex !== data.rows.length) {
              cellContent = currentRow[columnName] || "❔";
              if (editing[currentRow.id]) {
                cellContent = (
                  <Input
                    name={columnName}
                    required={true}
                    initialValue={currentRow[columnName]}
                    form="editedRow"
                  />
                );
              }
            }
        }

        newRow.push(<td key={i}>{cellContent}</td>);
      });
      tableContent.push(<tr key={rowIndex}>{newRow}</tr>);
    }
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
            `${process.env.REACT_APP_BACKEND_URL}/${props.route}/${currentID[0]}`
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
            `${process.env.REACT_APP_BACKEND_URL}/${props.route}/new`
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
