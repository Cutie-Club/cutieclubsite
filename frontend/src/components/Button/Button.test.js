import React from "react";
import { render } from "@testing-library/react";
import Button from "./Button";

test("Button is rendered with text", () => {
  const { getByText } = render(<Button text="edit" />);
  const buttonText = getByText(/edit/i);
  expect(buttonText).toBeInTheDocument();
});
