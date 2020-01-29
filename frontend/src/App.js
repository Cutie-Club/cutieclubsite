import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import Products from "./pages/Products.js";
import Admin from "./pages/Admin.js";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/products" component={Products} />
        <Route path="/admin" component={Admin} />
      </Switch>
    </Router>
  );
}

export default App;

// import Component from './components/Component/Component.js';
