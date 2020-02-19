import React, { useState } from "react";
import Button from "../Button/Button.js";
import Input from "../Input/Input.js";

import "./Modal.css";

function Modal(props) {
  const [active, setActive] = useState(props.startActive || false);
  return (
    <>
      <div className={active ? "" : "closed"}>
        <div className="modal-overlay" />
        <div className="modal">
          <div className="modal-content">
            <Button
              id="modal-close"
              text="✖️"
              onClick={() => setActive(false)}
            />
            <p>
              hi, it looks like you're trying to log in... <br /> we need some
              credentials please guv
            </p>
            <Input placeholder="Username" />
            <Input placeholder="Password" type="password" />
            <Button text="Login" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
