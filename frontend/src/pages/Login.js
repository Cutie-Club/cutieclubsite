import React, { useState } from "react";
import Notification from "../components/Notification/Notification.js";
import Input from "../components/Input/Input.js";
import Form from "../components/Form/Form.js";
import Button from "../components/Button/Button.js";
import handleSubmission from "../utils/handleSubmission.js";
import * as jwtDecode from 'jwt-decode';

function getToken(){
  let token = sessionStorage.getItem('token');
  if (token) {
    return jwtDecode(token);
  } else {
    console.error("RUH ROH NO TOKEN FOUND");
    return undefined;
  }
}

function returnCheck(state, jsx) {
  if (!state) {
    return jsx;
  } else {
    return undefined;
  }
}

function Login() {
  const [notifActive, setNotifActive] = useState(false);
  const [returningUser, setReturningUser] = useState(true);
  const [token, setToken] = useState(getToken());

  if (token) {
    return(
      <>
        <h1>{`HELLO ${token.user}`}</h1>
        <Button
          className="btn"
          text="logout"
          onClick={() => {
            sessionStorage.removeItem('token');
            setToken(undefined);
          }}
        />
      </>
    )
  }

  return (
    <>
      <Notification
        text="Item deleted."
        status="warning"
        active={notifActive}
        onClose={() => setNotifActive(false)}
        onTimeout={() => setNotifActive(false)}
      />
      <h1>Please login to continue</h1>
      <div className="login-form">
        <h2>{returningUser ? "Login" : "Sign up"}</h2>
        <Form id="create-user-form" onSubmit={event => {
          handleSubmission(
            event,
            "POST",
            `${process.env.REACT_APP_BACKEND_URL}/${returningUser ? "login" : "newuser"}`
          ).then(res => {
            res.text().then(data => {
              setToken(jwtDecode(data));
              sessionStorage.setItem('token', data);
            });
          });
        }}>
          <Input
            label="username"
            name="username"
            placeholder="AzureDiamond"
            className="ui"
            required={true}
          />

          <Input
            label="password"
            name="password"
            placeholder="hunter2"
            type="password"
            className="ui"
            required={true}
          />

          {returnCheck(returningUser, <Input
            label="e-mail"
            name="email"
            placeholder="you@domain.tld"
            type="email"
            className="ui"
            required={true}
          />)}

          {returnCheck(returningUser, <Input
            label="display name"
            name="display_name"
            placeholder="Name"
            className="ui"
          />)}

          {returnCheck(returningUser, <Input
            label="avatar"
            name="image"
            type="file"
            className="ui"
          />)}
          <div>
            <Button
              text={returningUser ? "Login" : "Create Account"}
              className="btn"
              type="submit"
            />

            <Button
              type="button"
              text={returningUser ? "don't have an account?" : "woah, i already have an account!"}
              onClick={() => setReturningUser(!returningUser)}
            />
          </div>
        </Form>
      </div>

    </>
  );
}

export default Login;
