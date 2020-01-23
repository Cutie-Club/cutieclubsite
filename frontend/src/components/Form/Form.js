import React from 'react';
import './Form.css';

function Form(props) {
  return (
    // form properties
    // action (URL to process)
    // method (HTTP method)
    <form {...props}/>
  );
}

export default Form;
