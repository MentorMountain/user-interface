// Src for http requests in browser js
// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript


/******************************************************************************
 *                            Form Button Handlers                            *
 ******************************************************************************/
// ADDING BLOG TO DATASTORE
function blogAdd(form) {
  const XHR = new XMLHttpRequest();
  const FD = new FormData(form);
  const FD_JSON = JSON.stringify(Object.fromEntries(FD));

  // Define what happens on successful data submission
  XHR.addEventListener("load", (_) => {
    if (XHR.status === 201) {
      document.getElementById('add-result').textContent = "Content added successfully!";
      document.getElementById('add-result').style.color = "green";
      console.log("Content added successfully!");
    } else {
      document.getElementById('add-result').textContent = `Content submission failed!`;
      document.getElementById('add-result').style.color = "red";
      console.error("Oops! Something went wrong.");
    }
  });

  // Define what happens in case of error
  XHR.addEventListener("error", (event) => {
    document.getElementById('add-result').textContent = `Failure: ${event}!`;
    document.getElementById('add-result').style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  // Set up our request
  XHR.open("POST", "https://blog-gateway-test-i3jd550.wl.gateway.dev/api/blog");
  XHR.setRequestHeader("Content-Type", "application/json");

  // The data sent is what the user provided in the form
  console.log(`Sent content: ${FD_JSON}`);
  XHR.send(FD_JSON);
}

// LISTING BLOGS IN DATASTORE
function blogList() {
  document.getElementById('list-result').textContent = "LIST function not implemented yet";
  document.getElementById('list-result').style.color = "red";
  console.warn("List not implemented yet");
}


/******************************************************************************
 *                             Attaching Listeners                            *
 ******************************************************************************/
const addBlogForm = document.getElementById("add-blog-form");
addBlogForm.addEventListener("submit", (event) => {
  event.preventDefault();
  blogAdd(addBlogForm);
});
