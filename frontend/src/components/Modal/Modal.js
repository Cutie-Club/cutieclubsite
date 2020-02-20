import React, { useState } from "react";
import Button from "../Button/Button.js";

import "./Modal.css";

function Modal(props) {
  const [active, setActive] = useState(props.startActive || false);
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
              onClick={() => setActive(false)}
            />
          </div>
          <div className="modal-child-content">{props.children}</div>
          <div className="modal-footer">
            <Button text="TEST" className="btn" />
            <Button text="TEST" className="btn" />
          </div>
        </div>
      </div>
    </>
  );
  return active ? modalDOM : <></>;
}

export default Modal;
