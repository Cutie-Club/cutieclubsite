import React from "react";
import Table from "../components/Table/Table.js";

function Admin(props) {
  return (
    <>
      <h1>{`Hi, ${props.token.display_name || props.token.username}!`}</h1>
      <h3>Add product</h3>
      <Table route="products" rawToken={props.rawToken} />
    </>
  );
}

export default Admin;
