import React, { useState } from "react";
import "./Input.css";

function Input(props) {
  const [value, setValue] = useState(props.initialValue || "");

  let editedProps = { ...props };

  if (editedProps.initialValue) {
    delete editedProps.initialValue;
  }

  return (
    <label>
      {props.label}
      <input
        value={value}
        onChange={event => {
          setValue(event.target.value);
        }}
        {...editedProps}
      />
    </label>
  );
}

export default Input;
