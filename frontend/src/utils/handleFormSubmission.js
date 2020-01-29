function handleFormSubmission(formElement, action, method) {
  // prevent default action (redirect) from happening
  // event.preventDefault();

  return new Promise((resolve, reject) => {
    // setup a FormData object using the form in App
    const form = new FormData(formElement);
    // clear form now we have extracted data
    formElement.reset();
    // create a request to perform our http method with
    const request = new XMLHttpRequest();

    // convert form data to json
    let formObject = {};
    for (var pair of form.entries()) {
      formObject[pair[0]] = pair[1];
    }

    // set up an event listener for state change
    request.onreadystatechange = () => {
      // once the request is ready (status of DONE(4) according to MDN),
      // print out the response to our request
      if (request.readyState === 4) {
        resolve(JSON.parse(request.response));
      }
    };

    // create a new POST request
    request.open(method, action);
    // set request headers
    request.setRequestHeader("Content-Type", "application/json");
    // send a request with some data
    request.send(JSON.stringify(formObject));
  });
}

export default handleFormSubmission;
