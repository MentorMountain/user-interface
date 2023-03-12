// Src for http requests in browser js
// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript


/******************************************************************************
 *                              Global Variables                              *
 ******************************************************************************/
// GCLOUD API GATEWAY LINK
const GCLOUD_API_GATEWAY = "https://mentor-mountain-gateway-i3jd550.wl.gateway.dev";

// Mainatins the current list of blog posts locally so that we reduce...
// ...repeated queries to the DB
let BLOG_POSTS = [];
let HAS_BLOGS_BEEN_QUERIED_YET = false;


/******************************************************************************
 *                   Local Blog List Rendering/Manipulation                   *
 ******************************************************************************/
function renderBlogList() {
  sortBlogListByDate();
  const blogListDiv = document.getElementById("blog-list");
  blogListDiv.innerHTML = "";
  BLOG_POSTS.forEach((blogPost) => {
    // Create the container for the blog post info
    const blogPostDiv = document.createElement("div");

    
    // Add blog post data into the div
    const titleTag = document.createElement("h1");
    titleTag.innerText = blogPost.title;
    blogPostDiv.append(titleTag);
    
    const authorDateTag = document.createElement("p");
    const dateString = new Date(blogPost.date ).toLocaleString(); // Might need brackets here TODO JAROD
    authorDateTag.innerText = `Posted by ${blogPost.authorID} on ${dateString}`;
    blogPostDiv.append(authorDateTag);
    
    const contentTag = document.createElement("p");
    contentTag.innerText = blogPost.content;
    blogPostDiv.append(contentTag);
    
    const postIDTag = document.createElement("p");
    postIDTag.innerText = blogPost.postID;
    blogPostDiv.append(postIDTag);

    
    // Add the blog post div we've created to the blog list div
    blogListDiv.append(blogPostDiv);
  });
}

function sortBlogListByDate() {
  BLOG_POSTS.sort((a, b) => (
    b.date - a.date
  ));
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
      // Also add data locally & inconsistently (not same as DB) re-render for DB performance
      let FD_DATA = Object.fromEntries(FD);
      FD_DATA.date = new Date().getTime();
      FD_DATA.postID = "";
      BLOG_POSTS.push(FD_DATA);
      if (!HAS_BLOGS_BEEN_QUERIED_YET) {
        getBlogList();
      } else {
        renderBlogList();
      }
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
  XHR.open("POST", `${GCLOUD_API_GATEWAY}/api/blog`);
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
      HAS_BLOGS_BEEN_QUERIED_YET = true;
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
  XHR.open("GET", `${GCLOUD_API_GATEWAY}/api/blog`);

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
