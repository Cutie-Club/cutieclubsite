import React from "react";
import Button from "../Button/Button.js";
import "./Table.css";

function Table(props) {
  let tableHeader = [];
  let tableContent = [];

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
        tableRow.push(<td key={i}>{item[columnName] || "❔"}</td>);
      });

      tableContent.push(
        <tr key={i}>
          {tableRow}
          <td>
            <Button text="Edit" onClick={props.edit} />
            <Button
              text="Delete"
              onClick={event => {
                props.delete(event, item.id);
              }}
            />
          </td>
        </tr>
      );
    });
  }

  return (
    <>
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
