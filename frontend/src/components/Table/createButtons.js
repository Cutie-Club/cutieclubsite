import React from "react";
import Button from "../Button/Button.js";

function createNormalButtons(updateDataSource, toggleEdit, editing, id, route) {
  if (editing[id]) {
    return (
      <>
        <Button cssclass="accept" type="submit" text="Save" form="editedRow" />
        <Button
          cssclass="warning"
          text="Cancel"
          onClick={event => {
            event.preventDefault();
            toggleEdit(id);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Button
        text="Edit"
        cssclass="primary"
        disabled={Object.values(editing).includes(true)}
        onClick={event => {
          event.preventDefault();
          toggleEdit(id);
        }}
      />
      <Button
        text="Delete"
        cssclass="danger"
        disabled={Object.values(editing).includes(true)}
        onClick={event => {
          event.preventDefault();
          fetch(`http://localhost:9001/${route}/${id}`, {
            method: "DELETE"
          }).then(result => {
            updateDataSource();
          });
        }}
      />
    </>
  );
}

function createAddButtons(editing) {
  return (
    <>
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
    </>
  );
}

function createButtons(
  updateDataSource,
  toggleEdit,
  editing,
  currentRow,
  route
) {
  if (!currentRow) {
    return createAddButtons(editing);
  } else {
    return createNormalButtons(
      updateDataSource,
      toggleEdit,
      editing,
      currentRow.id,
      route
    );
  }
}

export default createButtons;
