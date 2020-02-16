import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

// pages
import About from "./pages/About.js";
import Admin from "./pages/Admin.js";
import Products from "./pages/Products.js";

// components
import Home from "./pages/Home.js";
import Navbar from "./components/Navbar/Navbar.js";
import Footer from "./components/Footer/Footer.js";

const footerJSON = require("./res/footer.json");

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

      <Footer
        repo="https://github.com/amberstarlight/cutieclubsite"
        json={footerJSON}
      />
    </Router>
  );
}

export default App;

// import Component from './components/Component/Component.js';
