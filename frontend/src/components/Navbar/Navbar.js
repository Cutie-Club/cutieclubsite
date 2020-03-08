import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

import logo from "../../res/logo_simple.svg";

function Navbar(props) {
  const hiddenAdminFilter = keyValuePair => {
    let pageObject = keyValuePair[1];
    if (pageObject.hidden) return false;
    if (!pageObject.admin) return true;
    if (pageObject.admin && props.admin) return true;
    return false;
  };

  return (
    <div className="top-bar">
      <NavLink activeClassName="active" exact to="/">
        <img src={logo} width={"200px"} alt="Cutie Club" />
      </NavLink>
      <nav className="menu-items">
        {Object.entries(props.pages)
          .filter(hiddenAdminFilter)
          .map(([route, pageObject]) => {
            return (
              <NavLink key={route} activeClassName="active" to={route}>
                {pageObject.text}
              </NavLink>
            );
          })}
      </nav>
    </div>
  );
}

export default Navbar;
