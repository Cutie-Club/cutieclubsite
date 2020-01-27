import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Form from "./components/Form/Form.js";
import Input from "./components/Input/Input.js";
import Button from "./components/Button/Button.js";

import "./App.css";

import Products from "./pages/Products.js";

function App() {
  return (
    <Router>
      <Form action="/products">
        <Input label="Product Finder:" type="search" name="query" />
        <Button type="submit" text="Search" />
      </Form>

      <Switch>
        <Route path="/products" component={Products} />
      </Switch>
    </Router>
  );
}

export default App;

// import Component from './components/Component/Component.js';
