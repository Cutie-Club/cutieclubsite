import React from "react";
import Modal from "../components/Modal/Modal.js";
import Input from "../components/Input/Input.js";

function Home() {
  return (
    <>
      <Modal startActive={true}>
        <p>Please enter your username and password to continue. <small>&quot;if you type in your pw, it will show as stars&quot;</small></p>
        <Input placeholder="AzureDiamond" className="ui"/>
        <Input placeholder="hunter2" type="password" className="ui" />
      </Modal>
      <p>hi</p>
    </>
  );
}

export default Home;
