import React, { useState } from "react";
import Modal from "../components/Modal/Modal.js";
import Notification from "../components/Notification/Notification.js";
import Input from "../components/Input/Input.js";
import Form from "../components/Form/Form.js";
import Button from "../components/Button/Button.js";


function Home() {
  const [modalActive, setModalActive] = useState(false);
  const [notifActive, setNotifActive] = useState(false);

  const modalButtons = {
    button1: {
      text: "Accept",
      onClick: () => setModalActive(false)
    },
    button2: {
      text: "Deny",
      onClick: () => setModalActive(false)
    }
  }

  return (
    <>
      <Button className="btn" onClick={() => {setNotifActive(true);}} text="Notification Test" />
      <Button className="btn" onClick={() => {setModalActive(true);}} text="Modal Test" />

      <Notification
        text="Item deleted."
        status="warning"
        active={notifActive}
        onClose={() => setNotifActive(false)}
        onTimeout={() => setNotifActive(false)}
      />

      <Modal title="my cool modal" active={modalActive} onClose={() => setModalActive(false)} buttons={modalButtons}>
        <p>Please enter your username and password to continue. <small>&quot;if you type in your pw, it will show as stars&quot;</small></p>
        <Form>
          <Input name="username" placeholder="AzureDiamond" className="ui"/>
          <Input name="password" placeholder="hunter2" type="password" className="ui" />
        </Form>
      </Modal>
      <p>hi</p>
    </>
  );
}

export default Home;
