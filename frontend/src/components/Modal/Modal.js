import React, { useState } from "react";
import Button from "../Button/Button.js";

import "./Modal.css";

function Modal(props) {
  const [activeState, setActiveState] = useState(props.startActive || true);

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
      buttonDOM.push(<Button key={buttonKey} className="btn" {...buttonValue} />);
    }
  }

  let closeButton;
  if (props.closable || props.closable === undefined) {
    closeButton = <Button
      className="btn"
      text="close"
      onClick={externalState ? props.onClose : () => setActiveState(false)}
    />;
  }

  let modalDOM = (
    <>
      <div className="modal-overlay" />
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{props.title}</h3>
            {closeButton}
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
