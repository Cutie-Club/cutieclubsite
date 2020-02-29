import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

// pages
import About from "./pages/About.js";
import Admin from "./pages/Admin.js";
import Login from "./pages/Login.js";
import Products from "./pages/Products.js";

// components
import Home from "./pages/Home.js";
import Navbar from "./components/Navbar/Navbar.js";
import Footer from "./components/Footer/Footer.js";

const footerJSON = require("./res/footer.json");

const pages = {
  "/products": Products,
  "/login": Login,
  "/about": About,
  "/admin": Admin,
  "/": Home
};

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        {Object.entries(pages).map(([route, component]) =>
          <Route key={route} path={route} component={component} />
        )}
      </Switch>
      <Footer json={footerJSON} />
    </Router>
  );
}

export default App;

// import Component from './components/Component/Component.js';
