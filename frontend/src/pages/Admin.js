import React, { useState, useEffect } from "react";
import Table from "../components/Table/Table.js";
import handleFormSubmission from "../utils/handleFormSubmission.js";

function Admin(props) {
  // const [table, setTable] = useState(); this will replace products state
  const [products, setProducts] = useState();

  const updateProducts = () => {
    fetch("http://localhost:9001/products", { method: "GET" })
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      });
  };

  // setting state of products in use effect so if we put products in the array of triggers it would loop infinitely
  useEffect(() => updateProducts(), []);

  return (
    <>
      <h1>hello [user]!</h1>
      <h3>Add product</h3>
      <Table
        json={products}
        edit={(event, id) => {
          handleFormSubmission(
            event.target.form,
            `http://localhost:9001/products/${id}`,
            "PATCH"
          ).then(response => updateProducts());
        }}
        delete={(event, id) => {
          fetch(`http://localhost:9001/products/${id}`, {
            method: "DELETE"
          }).then(response => {
            updateProducts();
          });
        }}
        add={event => {
          handleFormSubmission(
            event.target,
            "http://localhost:9001/products/new",
            "POST"
          ).then(response => updateProducts());
        }}
      />
    </>
  );
}

export default Admin;
