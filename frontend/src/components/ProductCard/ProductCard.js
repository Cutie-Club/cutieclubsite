import React from "react";
import "./ProductCard.css";

function ProductCard(props) {
  return (
    <>
      <div className="product-card">
        <a href={props.href}>
          <p>{props.product.code}</p>
          <img
            className="product-image"
            src={props.product.image}
            alt={`${props.product.name} - ${props.product.blurb}`}
          />
          <h2>{props.product.name}</h2>
          <p>{props.product.blurb}</p>
        </a>
      </div>
    </>
  );
}

export default ProductCard;
