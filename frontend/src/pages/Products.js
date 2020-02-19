import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard/ProductCard.js";

function Products() {
  const [products, setProducts] = useState();

  const updateProducts = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/products`, { method: "GET" })
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      });
  };

  useEffect(() => {
    updateProducts();
  }, []);

  // for (let product in products.rows) {
  let productsGrid = [];
  if (products) {
    products.rows.forEach((product, i) => {
      productsGrid.push(
        <ProductCard
          key={i}
          product={product}
          href={`/products/${product.code}`}
        />
      );
    });
  }
  // }

  return (
    <>
      <div className="product-grid">{productsGrid}</div>
      {/*<Form action="/products">
        <Input label="Product Finder:" type="search" name="query" />
        <Button type="submit" text="Search" />
      </Form>
      <div>{productDOM}</div>*/}
    </>
  );
}

export default Products;
