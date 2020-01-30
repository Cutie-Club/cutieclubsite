import React, { useState, useEffect } from "react";
import Form from "../components/Form/Form.js";
import Input from "../components/Input/Input.js";
import Button from "../components/Button/Button.js";
import Table from "../components/Table/Table.js";
import handleFormSubmission from "../utils/handleFormSubmission.js";

function Admin(props) {
  const [page, setPage] = useState();
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
      />
      <br />
      <Form
        onSubmit={event => {
          event.preventDefault();
          handleFormSubmission(
            event.target,
            "http://localhost:9001/products/new",
            "POST"
          ).then(response => updateProducts());
        }}
      >
        <Input label="Name:" name="name" required={true} />
        <Input label="Product Code:" name="product_code" required={true} />
        <Input label="Description:" name="description" required={true} />
        <Button type="submit" text="Add" cssclass="primary" />
      </Form>
    </>
  );
}

export default Admin;

// TODO: Add support for name mapping in the json files (optional)
// "names":{
//   "id": "ID",
//   "title": "Title",
//   "description": "Desc",
//   "product_code": "Product Code"
// }
