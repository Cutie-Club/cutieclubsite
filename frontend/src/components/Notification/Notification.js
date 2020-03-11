import React, { useState } from "react";
import Button from "../Button/Button.js";
import "./Notification.css";

function colourLookup(status) {
  const colourTable = {
    error: "red",
    warning: "darkorange",
    danger: "crimson",
    success: "#4caf50"
  }
  return colourTable[status];
}

function Notification(props) {
  const [activeState, setActiveState] = useState(props.startActive || true);

  let externalState = false;
  let active = activeState;
  if (!(props.active === undefined)) {
    externalState = true;
    active = props.active;
  }

  let notifTimeout = () => {
    setTimeout(() => {
      if (externalState) {
        if (props.onTimeout) props.onTimeout();
      } else {
        setActiveState(false);
      }
    }, 7000);
  }

  if (active) notifTimeout();

  let notifDOM = (
    <>
      <div className="notification">
        <p>{props.text}</p>
        <Button
          key={"notifClose"}
          text={"close"}
          className="btn"
          onClick={externalState ? props.onClose : () => {
            setActiveState(false);
            clearTimeout(notifTimeout);
          }}
        />
        <svg className="notification-status">
			  <rect fill={colourLookup(props.status)}/>
        </svg>
      </div>
    </>
  );
  return active ? notifDOM : <></>;
}

export default Notification;
