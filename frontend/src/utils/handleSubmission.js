function handleSubmission(event, method, action) {
  event.preventDefault();
  const HTMLForm = event.target;
  const form = new FormData(HTMLForm);
  // reset html form
  HTMLForm.reset();
  return fetch(action, {
    method: method,
    body: form
  });
}

export default handleSubmission;
