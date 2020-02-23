import React from "react";
import "./Form.css";

function Form(props) {
  return (
  // form properties
  // action (URL to process)
  // method (HTTP method)
    <form
      // custom reset handler
      // when a form is reset, loop through elements in the form
      // if the current element is an input, reset the value to null
      // and trigger an onChange event - as it is not triggered by
      // a DOM change.
      onReset={event => {
        for (let i = 0; i < event.target.length; i++) {
          let element = event.target.elements[i];
          if (element.nodeName === "INPUT") {
            element.value = null;
            let event = new Event("input", { bubbles: true });
            element.dispatchEvent(event);
          }
        }
      }}
      {...props}
    />
  );
}

export default Form;
