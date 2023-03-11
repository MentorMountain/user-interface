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
  XHR.addEventListener("load", (event) => {
    document.getElementById('add-result').textContent = `${event.target.responseText}`;
    document.getElementById('add-result').style.color = "black";
    console.log(event.target.responseText);
  });

  // Define what happens in case of error
  XHR.addEventListener("error", (event) => {
    document.getElementById('add-result').textContent = "Oops! Something went wrong.";
    document.getElementById('add-result').style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  // Set up our request
  XHR.open("POST", "https://blog-gateway-test-i3jd550.wl.gateway.dev/api/blog");
  XHR.setRequestHeader("Content-Type", "application/json");

  // The data sent is what the user provided in the form
  console.log(FD_JSON);
  XHR.send(FD_JSON);
}

// GETTING BLOG FROM DATASTORE
function blogGet() {
  document.getElementById('get-result').textContent = "GET function not implemented yet";
  document.getElementById('get-result').style.color = "red";
  console.warn("Get not implemented yet");
}

// LISTING BLOGS IN DATASTORE
function blogList() {
  document.getElementById('list-result').textContent = "LIST function not implemented yet";
  document.getElementById('list-result').style.color = "red";
  console.warn("List not implemented yet");
}

// REMOVING BLOG FROM DATASTORE
function blogDelete() {
  document.getElementById('delete-result').textContent = "DELETE function not implemented yet";
  document.getElementById('delete-result').style.color = "red";
  console.warn("Delete not implemented yet");
}


/******************************************************************************
 *                             Attaching Listeners                            *
 ******************************************************************************/
const addBlogForm = document.getElementById("add-blog-form");
addBlogForm.addEventListener("submit", (event) => {
  event.preventDefault();
  blogAdd(addBlogForm);
});
