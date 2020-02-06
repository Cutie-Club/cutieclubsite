import React from "react";
import Input from "../Input/Input.js";
import Form from "../Form/Form.js";
import Button from "../Button/Button.js";
import "./ProductViewer.css";

function ProductViewer(props) {
  let serialDOM;

  if (props.serial) {
    serialDOM = `CC-${props.product.product_code}-${props.serial}`;
  } else {
    serialDOM = (
      <Form action="/products">
        <Input type="hidden" value={props.product.name} name="query" />
        <Input
          label={`CC-${props.product.product_code}-`}
          placeholder="010101"
          name="serial"
        />
        <Button type="submit" text="Serial Number Search" />
      </Form>
    );
  }

  return (
    <>
      <h1>{`${props.product.id}: ${props.product.name}`}</h1>
      <h3>{serialDOM}</h3>
      <p>{props.product.description}</p>
    </>
  );
}

export default ProductViewer;
