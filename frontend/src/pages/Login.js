import React, { useState } from "react";
import Notification from "../components/Notification/Notification.js";
import Input from "../components/Input/Input.js";
import Form from "../components/Form/Form.js";
import Button from "../components/Button/Button.js";
import handleSubmission from "../utils/handleSubmission.js";
import * as jwtDecode from 'jwt-decode';

function returnCheck(state, jsx) {
  if (!state) {
    return jsx;
  } else {
    return undefined;
  }
}

function Login(props) {
  const [returningUser, setReturningUser] = useState(true);
  const [errorNotif, setErrorNotif] = useState(undefined);
  const [failedLogin, setFailedLogin] = useState(false);
  const [invalidItems, setInvalidItems] = useState({});

  if (props.token) {
    return(
      <>
        <h1>{`Hi, ${props.token.display_name || props.token.username}!`}</h1>
        <Button
          className="btn"
          text="logout"
          onClick={() => {
            sessionStorage.removeItem('token');
            props.setToken(undefined);
          }}
        />
      </>
    )
  }

  return (
    <>
      {errorNotif}

      <h1>Please login to continue...</h1>
      <div className="login-form">
        <h2>{returningUser ? "Login" : "Sign up"}</h2>
        <Form id="create-user-form" onSubmit={event => {
          handleSubmission(
            event,
            "POST",
            `${process.env.REACT_APP_BACKEND_URL}/${returningUser ? "login" : "newuser"}`,
            returningUser
          ).then(res => {
            if (res.ok) {
              res.json().then(data => {
                props.setToken(jwtDecode(data.token));
                sessionStorage.setItem('token', data.token);
              });
            } else {
              if (res.status === 500) {
                setErrorNotif(
                  <Notification
                    text="Internal server error. [500]"
                    status="error"
                  />
                );
              }
              if (res.status === 409) res.json().then(data => setInvalidItems(data));
              if (returningUser) res.json().then(() => setFailedLogin(true));
            }
          });
        }}>
          <Input
            label="username"
            name="username"
            placeholder="AzureDiamond"
            className="ui"
            required={true}
            duplicate={invalidItems.username}
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
            duplicate={invalidItems.email}
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
              onClick={() => {
                setFailedLogin(false);
                setReturningUser(!returningUser);
              }}
            />
          </div>
        </Form>
        {failedLogin ? <p style={{
          color: "red"
        }}>woah there, one (or more) of those credentials was incorrect!</p> : undefined}
      </div>

    </>
  );
}

export default Login;
