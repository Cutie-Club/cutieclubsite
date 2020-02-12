function handleFormSubmission(HTMLForm, action, method) {
  // setup a FormData object using the form in App
  const form = new FormData(HTMLForm);

  // reset html form
  HTMLForm.reset();

  return fetch(action, {
    method: method,
    body: form
  });
}

export default handleFormSubmission;
