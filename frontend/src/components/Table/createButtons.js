import React from "react";
import Button from "../Button/Button.js";

function createNormalButtons(updateDataSource, toggleEdit, editing, id, route, rawToken) {
  if (editing[id]) {
    return (
      <>
        <Button
          cssclass="btn accept"
          type="submit"
          text="Save"
          form="editedRow"
        />
        <Button
          cssclass="btn warning"
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
        cssclass="btn primary"
        disabled={Object.values(editing).includes(true)}
        onClick={event => {
          event.preventDefault();
          toggleEdit(id);
        }}
      />
      <Button
        text="Delete"
        cssclass="btn danger"
        disabled={Object.values(editing).includes(true)}
        onClick={event => {
          event.preventDefault();

          let requestOptions = { method: "DELETE" };
          if(rawToken) requestOptions.headers = { 'Authorization': `Bearer ${rawToken}` };

          fetch(`${process.env.REACT_APP_BACKEND_URL}/${route}/${id}`, requestOptions)
            .then(() => {
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
        cssclass="btn accept"
        type="submit"
        form="addRow"
        disabled={Object.values(editing).includes(true)}
      />
      <Button
        key={"clear"}
        text="Clear"
        cssclass="btn warning"
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
