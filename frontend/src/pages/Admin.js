import React, { useState, useEffect } from "react";
import Form from "../components/Form/Form.js";
import Input from "../components/Input/Input.js";
import Button from "../components/Button/Button.js";
import Table from "../components/Table/Table.js";
import handleFormSubmission from "../utils/handleFormSubmission.js";

function fetchProducts() {
  return new Promise((resolve, reject) => {
    // create a request to perform our http method with
    const request = new XMLHttpRequest();

    // set up an event listener for state change
    request.onreadystatechange = () => {
      // once the request is ready (status of DONE(4) according to MDN),
      // print out the response to our request
      if (request.readyState === 4) {
        resolve(JSON.parse(request.response));
      }
    };

    // create a new GET request
    request.open("GET", "http://localhost:9001/products");
    // send a request with some data
    request.send();
  });
}

function handleDelete(event, id) {
  return new Promise((resolve, reject) => {
    // create a request to perform our http method with
    const request = new XMLHttpRequest();

    // set up an event listener for state change
    request.onreadystatechange = () => {
      // once the request is ready (status of DONE(4) according to MDN),
      // print out the response to our request
      if (request.readyState === 4) {
        resolve(JSON.parse(request.response));
      }
    };

    // create a new DELETE request
    request.open("DELETE", `http://localhost:9001/products/${id}`);
    // send a request with some data
    request.send();
  });
}

function Admin(props) {
  const [page, setPage] = useState();
  const [products, setProducts] = useState();

  const updateProducts = () => {
    fetchProducts().then(requestedJSON => {
      setProducts(requestedJSON);
    });
  };

  useEffect(() => updateProducts(), []);
  return (
    <>
      <h1>hello [user]!</h1>
      <h3>Add product</h3>
      <Table
        json={products}
        delete={(event, id) => {
          handleDelete(event, id).then(response => {
            updateProducts();
          });
        }}
      />
      <br />
      <Form
        onSubmit={event => {
          handleFormSubmission(
            event,
            "http://localhost:9001/products/new"
          ).then(response => updateProducts());
        }}
      >
        <Input label="Name:" name="name" />
        <Input label="Product Code:" name="product_code" />
        <Input label="Description:" name="description" />
        <Button type="submit" text="Save" />
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
