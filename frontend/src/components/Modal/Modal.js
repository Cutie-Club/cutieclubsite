import React, { useState } from "react";
import Button from "../Button/Button.js";

import "./Modal.css";

function Modal(props) {
  const [activeState, setActiveState] = useState(props.startActive || false);

  let externalState = false;
  let active = activeState;
  if (!(props.active === undefined)) {
    externalState = true;
    active = props.active;
  }

  let buttonDOM = [];

  if (props.buttons) {
    for (let buttonKey in props.buttons) {
      let buttonValue = props.buttons[buttonKey];
      buttonDOM.push(<Button key={buttonKey} text={buttonValue.text} className="btn" onClick={buttonValue.onClick} />);
    }
  }

  let modalDOM = (
    <>
      <div className="modal-overlay" />
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <p>Cool Modal Component</p>
            <Button
              className="btn"
              text="close"
              onClick={externalState ? props.onClose : () => setActiveState(false)}
            />
          </div>
          <div className="modal-child-content">{props.children}</div>
          <div className="modal-footer">
            {buttonDOM}
          </div>
        </div>
      </div>
    </>
  );
  return active ? modalDOM : <></>;
}

export default Modal;
