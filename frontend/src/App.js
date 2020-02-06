import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Products from "./pages/Products.js";
import About from "./pages/About.js";
import Admin from "./pages/Admin.js";
import Home from "./pages/Home.js";

import Navbar from "./components/Navbar/Navbar.js";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
        <Route path="/admin" component={Admin} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;

// import Component from './components/Component/Component.js';
