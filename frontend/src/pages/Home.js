import React, { useState } from "react";
import Modal from "../components/Modal/Modal.js";
import Input from "../components/Input/Input.js";
import Form from "../components/Form/Form.js";
import Button from "../components/Button/Button.js";


function Home() {
  const [modalActive, setModalActive] = useState(true);

  const modalButtons = {
    button1: {
      text: "penis",
      onClick: () => { console.log("penis pressed") }
    },
    button2: {
      text: "anus",
      onClick: () => { console.log("anus pressed") }
    }
  }

  return (
    <>
      <Button onClick={() => setModalActive(true)} text="OPEN MODAL" />

      <Modal active={modalActive} onClose={() => setModalActive(false)} buttons={modalButtons}>
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

// <Modal startActive={true}>
//   <p>Please enter your username and password to continue. <small>&quot;if you type in your pw, it will show as stars&quot;</small></p>
//   <Form>
//     <Input name="username" placeholder="AzureDiamond" className="ui"/>
//     <Input name="password" placeholder="hunter2" type="password" className="ui" />
//   </Form>
// </Modal>
