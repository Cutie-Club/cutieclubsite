import React, { useState } from 'react';
import Form from './components/Form/Form.js';
import Input from './components/Input/Input.js';
import Button from './components/Button/Button.js';
import ProductViewer from './components/ProductViewer/ProductViewer.js';
import './App.css';

function handleFormSubmission(event) {
	// prevent default action (redirect) from happening
	event.preventDefault();

	return new Promise((resolve, reject) => {
		// setup a FormData object using the form in App
	  const form = new FormData(event.target);
		// clear form now we have extracted data
		event.target.reset();
		// create a request to perform our http method with
	  const request = new XMLHttpRequest();

		// convert form data to json
		let formObject = {};
	  for(var pair of form.entries()) {
			formObject[pair[0]] = pair[1];
		};

		// set up an event listener for state change
		request.onreadystatechange = () => {
			// once the request is ready (status of DONE(4) according to MDN),
			// print out the response to our request
			if ( request.readyState === 4 ) {
				resolve(JSON.parse(request.response));
			};
		};

		// create a new POST request
	  request.open('POST', 'http://localhost:9001/products');
		// set request headers
		request.setRequestHeader('Content-Type', 'application/json');
		// send a request with some data
	  request.send(JSON.stringify(formObject));
	});
}

function App() {
	const [product, setProduct] = useState();

	const formSubmission = event => {
		handleFormSubmission(event)
			.then(response => {
				console.log(response);
				setProduct(response);
			})
		};

	let productDOM; // a variable to hold product ProductViewer
	if (product){
		 productDOM = <ProductViewer product={product}/>;
	};

  return (
		<div>
			<Form onSubmit={formSubmission}>
				<Input label="Product Finder:" type="search" name="query"/>
				<Button type="submit" text="Search"/>
			</Form>
			<Button text="Reset" onClick={(event) => { setProduct(undefined); } }/>
			{productDOM}
		</div>
  );
};

export default App;

// import Component from './components/Component/Component.js';
