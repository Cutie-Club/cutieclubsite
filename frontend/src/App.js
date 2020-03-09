import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import getToken from "./utils/getToken.js";

// components
import Navbar from "./components/Navbar/Navbar.js";
import Footer from "./components/Footer/Footer.js";
import Pages from "./Pages.js";

const footerJSON = require("./res/footer.json");

function App() {
  const [rawToken, setRawToken] = useState(getToken(true));
  const [decodedToken, setDecodedToken] = useState(getToken());

  useEffect(() => {
    setRawToken(getToken(true));
  }, [decodedToken]);

  let adminState = false;
  if (decodedToken) adminState = decodedToken.admin;

  return (
    <Router>
      <Navbar pages={Pages} admin={adminState} />
      <Switch>
        {Object.entries(Pages).map(([route, pageObject]) => (
          <Route key={route} path={route}>
            {pageObject.admin && !adminState ?
              <Redirect to="/login" />
              :
              <pageObject.component
                rawToken={rawToken}
                token={decodedToken}
                setToken={setDecodedToken}
              />}
          </Route>
        ))}
      </Switch>
      <Footer json={footerJSON} />
    </Router>
  );
}

export default App;

// import Component from './components/Component/Component.js';
