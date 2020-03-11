import React, { useState, useEffect } from "react";
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
  const [notifTimer, setNotifTimer] = useState();

  let externalState = false;
  let active = activeState;
  if (!(props.active === undefined)) {
    externalState = true;
    active = props.active;
  }

  useEffect(() => {
    const onTimeout = externalState ? props.onTimeout : () => setActiveState(false);
    if (active && onTimeout) setNotifTimer(setTimeout(onTimeout, 7000));
  }, [active, externalState, props.onTimeout]);

  useEffect(() => {
    if(!active) clearTimeout(notifTimer);
  }, [active, notifTimer])

  let notifDOM = (
    <>
      <div className="notification">
        <p>{props.text}</p>
        <Button
          key={"notifClose"}
          text={"close"}
          className="btn"
          onClick={externalState ? props.onClose : () => setActiveState(false)}
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
