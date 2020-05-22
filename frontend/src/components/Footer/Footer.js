import React from "react";
import Form from "../Form/Form.js";
import Input from "../Input/Input.js";
import Button from "../Button/Button.js";
import "./Footer.css";

import roundel from "../../res/logo_stamp.svg";

const randomItem = array => {
  return array[Math.floor(Math.random() * array.length)];
};

function Footer(props) {
  return (
    <footer>
      <div className="container">
        <img src={roundel} alt="Cutie Club" />
        <div className="wrapper">
          <div className="left">
            <h2>{randomItem(props.json.phrases)}</h2>
            <p>&copy; {new Date().getFullYear()} Cutie Club</p>
            <p>
              licensed under the{" "}
              <a href="https://www.apache.org/licenses/LICENSE-2.0">
                Apache License, Version 2.0
              </a>
            </p>
            <p>
              why not <a href={props.json.repo}>contribute</a>?
            </p>
            <Button
              text="back to top ↑ "
              className="icon"
              onClick={() => window.scrollTo(0, 0)}
            />
          </div>

          <div className="right">
            <p className="big">{props.json.title}</p>
            <h3>{props.json.body}</h3>
            <small>{props.json.subtext}</small>
            <p>Get in touch with us:</p>
            <a href="mailto:hello@cutieclub.cc">hello@cutieclub.cc</a>
            <div>
              <p>Didn&apos;t find what you were looking for?</p>
              <Form action="/products">
                <Input label="Product Finder:" type="search" name="query" />
                <Button type="submit" text="Search" className="btn primary" />
              </Form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
