import React from 'react';
import './Input.css';

function Input(props) {
  return (
    <label>{props.label}
      <input {...props}/>
    </label>
  );
}

export default Input;
