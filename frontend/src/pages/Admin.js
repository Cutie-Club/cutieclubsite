import React from "react";
import Table from "../components/Table/Table.js";

function Admin() {
  return (
    <>
      <h1>hello [user]!</h1>
      <h3>Add product</h3>
      <Table route="products" />
    </>
  );
}

export default Admin;

// check sessionStorage for a token
// if token, user is logged in
// if not, redirect to /login
// is logged in user admin?
// if yes, render admin page
// if no, return "you are not authorised to view this content!"
