// Src for http requests in browser js
// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript

/******************************************************************************
 *                                API Handlers                                *
 ******************************************************************************/
// ADDING QUESTION TO DATASTORE
function questionAdd(form) {
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
  XHR.open("POST", "https://blog-gateway-test-i3jd550.wl.gateway.dev/api/blog"); //  NEED TO CHANGE THIS TO QUESTIONS API
  XHR.setRequestHeader("Content-Type", "application/json");

  // The data sent is what the user provided in the form
  console.log(FD_JSON);
  XHR.send(FD_JSON);
}

// LISTING QUESTIONS IN DATASTORE
function questionList() {
  // Local data for local development 
  // NEED TO SWITCH TO FETCHING THE FIRESTORE DATA FROM THE API
  // WORKFLOW
  // Get all of the questions IDs
  // Using a loop, iterate through all of the question IDs and get their content
  // When a user clicks on the view button for a list item, make the QA form and list disappear
  // and make the question content, responses, and form to add a response appear

  const data = '[{"_fieldsProto":{"date":{"timestampValue":{"seconds":"1678490944","nanos":937000000},"valueType":"timestampValue"},"authorUUID":{"stringValue":"Ben","valueType":"stringValue"},"title":{"stringValue":"how to centre a div?","valueType":"stringValue"},"content":{"stringValue":"test content test test","valueType":"stringValue"}},"_ref":{"_firestore":{"projectId":"benjamindjukastein301423488"},"_path":{"segments":["questions","Z9Zmk4bUV6uLY9Z0AnSl"]},"_converter":{}},"_serializer":{"allowUndefined":false},"_readTime":{"_seconds":1678561337,"_nanoseconds":498214000},"_createTime":{"_seconds":1678491008,"_nanoseconds":728393000},"_updateTime":{"_seconds":1678491008,"_nanoseconds":728393000}}, {"_fieldsProto":{"date":{"timestampValue":{"seconds":"1678490944","nanos":937000000},"valueType":"timestampValue"},"authorUUID":{"stringValue":"Ben","valueType":"stringValue"},"title":{"stringValue":"how to cmpt474?","valueType":"stringValue"},"content":{"stringValue":"test content test test","valueType":"stringValue"}},"_ref":{"_firestore":{"projectId":"benjamindjukastein301423488"},"_path":{"segments":["questions","Z9Zmk4bUV6uLY9Z0AnSl"]},"_converter":{}},"_serializer":{"allowUndefined":false},"_readTime":{"_seconds":1678561337,"_nanoseconds":498214000},"_createTime":{"_seconds":1678491008,"_nanoseconds":728393000},"_updateTime":{"_seconds":1678491008,"_nanoseconds":728393000}}]'
  const questions = JSON.parse(data);
  console.log(data);
  console.log(questions);
  questions.forEach(element => {
    var questionContent = element._fieldsProto;
    var listItem = document.createElement('li');
    listItem.textContent = questionContent.title.stringValue + " by " + questionContent.authorUUID.stringValue;

    var viewButton = document.createElement("button");
    viewButton.textContent = "View"

    viewButton.addEventListener("click", (event) => {
      document.getElementById('question-creation-posts').style.display = 'none';
      document.getElementById('question-post-responses').style.display = 'block';

      // post content
      document.getElementById('view-question-post-title').textContent = questionContent.title.stringValue;
      document.getElementById('view-question-post-author').textContent = "Author: " + questionContent.authorUUID.stringValue;
      document.getElementById('view-question-post-content').textContent = questionContent.content.stringValue;
    })

    listItem.appendChild(viewButton);
    document.getElementById('question-results').appendChild(listItem);
  });
}


/******************************************************************************
 *                 Attaching Listeners and Running Getters                    *
 ******************************************************************************/
const addQuestionForm = document.getElementById("add-question-form");
addQuestionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  questionAdd(addQuestionForm);
});

const backButton = document.getElementById("back-to-question-creation-posts");
backButton.addEventListener("click", (event) => {
  document.getElementById('question-creation-posts').style.display = 'block';
  document.getElementById('question-post-responses').style.display = 'none';
});

questionList();
