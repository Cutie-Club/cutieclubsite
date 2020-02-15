import React from "react";
import Table from "../components/Table/Table.js";

function Admin(props) {
  return (
    <>
      <h1>hello [user]!</h1>
      <h3>Add product</h3>
      <Table route="products" />
    </>
  );
}

export default Admin;
