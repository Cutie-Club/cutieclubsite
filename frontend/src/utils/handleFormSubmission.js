function handleFormSubmission(HTMLForm, action, method) {
  // setup a FormData object using the form in App
  const form = new FormData(HTMLForm);

  // reset html form
  HTMLForm.reset();

  // convert form data to json
  let formObject = {};
  for (var pair of form.entries()) {
    formObject[pair[0]] = pair[1];
  }

  // TODO: add multipart form submission support to backend
  return fetch(action, {
    method: method,
    body: JSON.stringify(formObject),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export default handleFormSubmission;
