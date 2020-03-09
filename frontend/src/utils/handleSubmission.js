function handleSubmission(event, method, action, rawToken, reset=true) {
  event.preventDefault();
  const HTMLForm = event.target;
  const form = new FormData(HTMLForm);
  // reset html form
  if (reset) HTMLForm.reset();

  let requestOptions = {
    method: method,
    body: form
  };

  if (rawToken) requestOptions.headers = { 'Authorization': `Bearer ${rawToken}` };
  return fetch(action, requestOptions)
}

export default handleSubmission;
