// Src for http requests in browser js
// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript


/******************************************************************************
 *                              Global Variables                              *
 ******************************************************************************/
// Mainatins the current list of blog posts locally so that we reduce...
// ...repeated queries to the DB
let BLOG_POSTS = [];


/******************************************************************************
 *                   Local Blog List Rendering/Manipulation                   *
 ******************************************************************************/
function renderBlogList() {

}


/******************************************************************************
 *                            Form Button Handlers                            *
 ******************************************************************************/
// Add a blog post to the firestore DB
function blogAdd(form) {
  const XHR = new XMLHttpRequest();
  const FD = new FormData(form);
  const FD_JSON = JSON.stringify(Object.fromEntries(FD));

  // Define what happens on successful connection
  XHR.addEventListener("load", (_) => {
    if (XHR.status === 201) { // Successful API interaction
      document.getElementById('add-result').textContent = "Content added successfully";
      document.getElementById('add-result').style.color = "green";
      console.log("Content added successfully");
    } else { // Unsuccessful API interaction
      document.getElementById('add-result').textContent = `Content submission failed`;
      document.getElementById('add-result').style.color = "red";
      console.error("Content submission failed");
    }
  });

  // Define what happens on unsuccessful connection
  XHR.addEventListener("error", (event) => {
    document.getElementById('add-result').textContent = `Failure: ${event}`;
    document.getElementById('add-result').style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  // Set up our request
  XHR.open("POST", "https://mentor-mountain-gateway-i3jd550.wl.gateway.dev/api/blog");
  XHR.setRequestHeader("Content-Type", "application/json");

  // The data sent is what the user provided in the form
  console.log(`Sent content: ${FD_JSON}`);
  document.getElementById('add-result').textContent = `Processing...`;
  document.getElementById('add-result').style.color = "black";
  XHR.send(FD_JSON);
}

// Get the list of all blog posts from the firestore DB, store them locally, render blogs
function getBlogList() {
  const XHR = new XMLHttpRequest();

  // Define what happens on successful connection
  XHR.addEventListener("load", (response) => {
    if (XHR.status === 200) { // Successful API interaction
      BLOG_POSTS = JSON.parse(XHR.response);
      renderBlogList();
      document.getElementById('list-result').textContent = "Blog content get success";
      document.getElementById('list-result').style.color = "green";
      console.log("Blog content get success");
    } else { // Unsuccessful API interaction
      document.getElementById('list-result').textContent = `Blog content get failed`;
      document.getElementById('list-result').style.color = "red";
      console.error("Blog content get failed");
    }
  });

  // Define what happens on unsuccessful connection
  XHR.addEventListener("error", (event) => {
    document.getElementById('list-result').textContent = `Failure: ${event}`;
    document.getElementById('list-result').style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  // Set up our request
  XHR.open("GET", "https://mentor-mountain-gateway-i3jd550.wl.gateway.dev/api/blog");

  // Send the request for the list of all blog posts
  console.log('Getting blog list');
  document.getElementById('list-result').textContent = `Processing...`;
  document.getElementById('list-result').style.color = "black";
  XHR.send();
}


/******************************************************************************
 *                             Attaching Listeners                            *
 ******************************************************************************/
const addBlogForm = document.getElementById("add-blog-form");
addBlogForm.addEventListener("submit", (event) => {
  event.preventDefault();
  blogAdd(addBlogForm);
});

const listBlogButton = document.getElementById("list-form-button");
listBlogButton.addEventListener("click", (event) => {
  const blogList = getBlogList();
});
