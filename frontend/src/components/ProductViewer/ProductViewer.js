import React from 'react';
import './ProductViewer.css'

function ProductViewer(props) {
  return (
		<>
	    <h1>{`${props.product.id}: ${props.product.name}`}</h1>
			<h3>{`CC-${props.product.product_code}`}</h3>
			<p>{props.product.description}</p>
		</>
  );
}

export default ProductViewer;
