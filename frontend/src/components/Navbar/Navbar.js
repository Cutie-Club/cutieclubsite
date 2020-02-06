import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

import logo from "../../res/logo_simple.png";

function Navbar() {
  return (
    <div className="top-bar">
      <NavLink activeClassName="active" exact to="/">
        <img src={logo} width={"200px"} alt="Cutie Club" />
      </NavLink>
      <nav className="menu-items">
        <NavLink activeClassName="active" to="/products">
          products
        </NavLink>
        <NavLink activeClassName="active" to="/about">
          about
        </NavLink>
        <NavLink activeClassName="active" to="/admin">
          admin
        </NavLink>
      </nav>
    </div>
  );
}

export default Navbar;
