import React from "react";
import "./Button.css";

function Button(props) {
  return (
    <button className={props.cssclass} {...props}>
      {props.text}
    </button>
  );
}

export default Button;
