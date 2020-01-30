import handleFormSubmission from "./handleFormSubmission";

test("Form is handled", () => {
  // Create Form
  const testForm = document.createElement("form");

  const testInput = document.createElement("input");
  testInput.setAttribute("type", "text");
  testInput.setAttribute("name", "query");
  testInput.setAttribute("value", "my search term");

  const testButton = document.createElement("button");
  testButton.setAttribute("type", "submit");
  testButton.innerHTML = "Submit";

  testForm.appendChild(testInput);
  testForm.appendChild(testButton);

  jest.spyOn(global, "fetch").mockImplementation(
    (action, options) =>
      new Promise((resolve, reject) => {
        resolve(options);
      })
  );

  return handleFormSubmission(testForm, "http://myCoolURL/route", "POST").then(
    response => {
      expect(response).toStrictEqual({
        method: "POST",
        body: '{"query":"my search term"}',
        headers: { "Content-Type": "application/json" }
      });
    }
  );
});
