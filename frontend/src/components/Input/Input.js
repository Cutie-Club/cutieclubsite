import React, { useState } from "react";
import "./Input.css";

function Input(props) {
  let initialValue = props.initialValue || "";
  let onChangeHandler = event => {
    setValue(event.target.value);
  };

  if (props.type && props.type.toLowerCase() === "file") {
    initialValue = undefined;
    onChangeHandler = undefined;
  }

  const [value, setValue] = useState(initialValue);

  let editedProps = { ...props };

  if (editedProps.initialValue) {
    delete editedProps.initialValue;
  }

  return (
    <>
      <label>
        {props.label}
        <input value={value} onChange={onChangeHandler} {...editedProps} />
      </label>
      {props.duplicate ? <p>{props.label} already exists</p> : undefined}
    </>
  );
}

export default Input;
