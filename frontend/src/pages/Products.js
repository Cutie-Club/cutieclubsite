import React, { useState, useEffect } from "react";
import ProductViewer from "../components/ProductViewer/ProductViewer.js";
import queryToJSON from "../utils/queryToJSON.js";

function handleSearch(string) {
  return new Promise((resolve, reject) => {
    // create a request to perform our http method with
    const request = new XMLHttpRequest();

    // convert string data to query for backend
    let searchObject = { query: string };

    // set up an event listener for state change
    request.onreadystatechange = () => {
      // once the request is ready (status of DONE(4) according to MDN),
      // print out the response to our request
      if (request.readyState === 4) {
        resolve(JSON.parse(request.response));
      }
    };

    // create a new POST request
    request.open("POST", "http://localhost:9001/products");
    // set request headers
    request.setRequestHeader("Content-Type", "application/json");
    // send a request with some data
    request.send(JSON.stringify(searchObject));
  });
}

function Products(props) {
  const [product, setProduct] = useState(undefined);
  let queryObj = queryToJSON(props.history.location.search);
  console.log(queryObj);

  useEffect(() => {
    // if query is supplied
    if (queryObj.query) {
      handleSearch(queryObj.query).then(response => {
        setProduct(response);
      });
    }
  }, [queryObj.query]);

  let productDOM; // a variable to hold product ProductViewer
  if (product) {
    productDOM = <ProductViewer product={product} serial={queryObj.serial} />;
  }

  return <div>{productDOM}</div>;
}

export default Products;
