function handleSubmission(event, method, action, reset=true) {
  event.preventDefault();
  const HTMLForm = event.target;
  const form = new FormData(HTMLForm);
  // reset html form
  if (reset) HTMLForm.reset();
  return fetch(action, {
    method: method,
    body: form
  })
}

export default handleSubmission;
