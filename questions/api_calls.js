// Src for http requests in browser js
// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript

const GATEWAY_URL = "https://mentormountain-api-gateway-bs9b0qcb.wl.gateway.dev"
let QUESTION_IDS = [];
let QUESTIONS = [];
let RESPONSES;

const NO_QUESTION_ID = "joemama"
let CURRENT_QUESTION_ID = NO_QUESTION_ID;

let addQuestionStatus = document.getElementById('add-result');
let addReplyStatus = document.getElementById('add-reply-result');
let questionListStatus = document.getElementById('list-result');
let replyListStatus = document.getElementById('responses-list-result');
/******************************************************************************
 *                            Form Button Handlers                            *
 ******************************************************************************/

function questionAdd(form) {
  const XHR = new XMLHttpRequest();
  const FD = new FormData(form);
  const FD_JSON = JSON.stringify(Object.fromEntries(FD));

  XHR.addEventListener("load", (event) => {
    addQuestionStatus.textContent = `${event.target.responseText}`;
    addQuestionStatus.style.color = "black";
    console.log(event.target.responseText);
    loadQuestionIDs();
  });

  XHR.addEventListener("error", (event) => {
    addQuestionStatus.textContent = "Oops! Something went wrong.";
    addQuestionStatus.style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  XHR.open("POST", GATEWAY_URL + "/api/questions");
  XHR.setRequestHeader("Content-Type", "application/json");

  console.log(FD_JSON);
  XHR.send(FD_JSON);
}

function responseAdd(form) {
  if (CURRENT_QUESTION_ID === NO_QUESTION_ID) {
    console.log("No question ID is stored");
    return;
  }

  const XHR = new XMLHttpRequest();
  const FD = new FormData(form);
  const FD_JSON = JSON.stringify(Object.fromEntries(FD));

  XHR.addEventListener("load", (event) => {
    addReplyStatus.textContent = `${event.target.responseText}`;
    addReplyStatus.style.color = "black";
    console.log(event.target.responseText);
  });

  XHR.addEventListener("error", (event) => {
    addReplyStatus.textContent = "Oops! Something went wrong.";
    addReplyStatus.style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  XHR.open("POST", GATEWAY_URL + "/api/questions/" + CURRENT_QUESTION_ID + "/responses"); //  NEED TO CHANGE THIS TO QUESTIONS API
  XHR.setRequestHeader("Content-Type", "application/json");

  console.log(FD_JSON);
  XHR.send(FD_JSON);

  renderResponse(Object.fromEntries(FD).authorID, Object.fromEntries(FD).message, Date.now(), true)
}

function renderQuestionList() {
  document.getElementById('qa-list').innerHTML = "";

  QUESTIONS.forEach((element, index) => {
    renderQuestion(element, QUESTION_IDS[index]);
  });
}

function renderQuestion(question, id) {
  let questionContent = question._fieldsProto;

  let listItem = document.createElement('li');
  listItem.textContent = questionContent.title.stringValue + " by Anonymous";
  // listItem.textContent = questionContent.title.stringValue + " by " + questionContent.authorID.stringValue;

  let viewButton = document.createElement("button");
  viewButton.textContent = "View"

  viewButton.addEventListener("click", (event) => {
    const date = new Date(parseInt(questionContent.date.integerValue));
    renderQuestionContent(questionContent.title.stringValue,
        questionContent.authorID.stringValue,
        questionContent.content.stringValue,
        date, id);
  })

  listItem.appendChild(viewButton);
  document.getElementById('qa-list').appendChild(listItem);
}

function renderQuestionContent(title, authorID, content, date, id) {
  console.log("rendering question ID: " + id);

  document.getElementById("qa-main-section").style.display = "none";
  document.getElementById("qa-question-section").style.display = "block";
  document.getElementById("question-title").innerText =
      "Question: " + title
  document.getElementById("question-author").innerText =
      "Author: Anonymous"
      // "Author: " + authorID

  document.getElementById("question-date").innerText = date;
  document.getElementById("question-content").innerText = content

  loadQuestionResponses(id);
  CURRENT_QUESTION_ID = id;
}

function renderResponse(authorID, message, date, isPrepend) {
  const responseSection = document.getElementById("qa-responses");
  const response = document.createElement("div");

  let responseDate = document.createElement("span");
  responseDate.innerText = "Posted on: " + new Date(date);
  responseDate.style.fontSize = "12px";
  response.appendChild(responseDate)
  response.appendChild(document.createElement("br"))

  let responseAuthor = document.createElement("span");
  responseAuthor.style.fontWeight = "bold";
  responseAuthor.innerText = "Anonymous says:";
  // responseAuthor.innerText = authorID + " says:";

  let responseContent = document.createElement("span");
  responseContent.innerText = message;
  response.appendChild(responseAuthor)
  response.appendChild(document.createElement("br"))
  response.appendChild(responseContent)
  response.appendChild(document.createElement("br"))
  response.appendChild(document.createElement("br"))

  if (isPrepend) responseSection.prepend(response)
  else responseSection.appendChild(response)
}

function loadQuestionIDs() {
  const XHR = new XMLHttpRequest();
  document.getElementById("qa-list").innerHTML = "";
  QUESTIONS = [];

  XHR.addEventListener("load", (response) => {
    if (XHR.status === 200) {
      QUESTION_IDS = JSON.parse(XHR.response);
      loadQuestionData();
      questionListStatus.textContent = "QuestionIDs get success";
      questionListStatus.style.color = "green";
      console.log("QuestionIDs get success");
    } else {
      questionListStatus.textContent = `QuestionIDs get failed`;
      questionListStatus.style.color = "red";
      console.error("QuestionIDs get failed");
    }
  });

  XHR.addEventListener("error", (event) => {
    questionListStatus.textContent = `Failure: ${event}`;
    questionListStatus.style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  XHR.open("GET", GATEWAY_URL + "/api/questions");

  console.log('Getting QuestionIDs list');
  questionListStatus.textContent = `Processing...`;
  questionListStatus.style.color = "black";
  XHR.send();
}

function loadQuestionData() {
  QUESTION_IDS.forEach(id => {
    const XHR = new XMLHttpRequest();

    XHR.addEventListener("load", (response) => {
      if (XHR.status === 200) {
        QUESTIONS.push(JSON.parse(XHR.response));

        questionListStatus.textContent = "Questions get success";
        questionListStatus.style.color = "green";
        // console.log("Questions get success");
        renderQuestionList();
      } else {
        questionListStatus.textContent = `Questions get failed`;
        questionListStatus.style.color = "red";
        // console.error("Questions get failed");
      }
    });

    XHR.addEventListener("error", (event) => {
      questionListStatus.textContent = `Failure: ${event}`;
      questionListStatus.style.color = "red";
      console.error("Oops! Something went wrong.");
    });

    XHR.open("GET", GATEWAY_URL + "/api/questions/" + id);

    console.log('Getting Question');
    questionListStatus.textContent = `Processing...`;
    questionListStatus.style.color = "black";
    XHR.send();
  })
  console.log(QUESTIONS)
  console.log('Done getting questions');
}

function loadQuestionResponses(questionID) {
  const responseSection = document.getElementById("qa-responses");
  responseSection.innerHTML = "";
  RESPONSES = [];

  const XHR = new XMLHttpRequest();

  XHR.addEventListener("load", (response) => {
    if (XHR.status === 200) {
      RESPONSES = JSON.parse(XHR.response);
      console.log(RESPONSES);

      replyListStatus.textContent = "Response get success";
      replyListStatus.style.color = "green";
      console.log("Response get success");

      RESPONSES.sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      })

      RESPONSES.forEach(response => {
        renderResponse(response.authorID, response.message, response.date, false);
      })
    } else {
      replyListStatus.textContent = `Response get failed`;
      replyListStatus.style.color = "red";
      console.error("Response get failed");
    }
  });

  XHR.addEventListener("error", (event) => {
    replyListStatus.textContent = `Failure: ${event}`;
    replyListStatus.style.color = "red";
    console.error("Oops! Something went wrong.");
  });

  XHR.open("GET", GATEWAY_URL + "/api/questions/" + questionID + "/responses");
  console.log(GATEWAY_URL + "/api/questions/" + questionID + "/responses")

  console.log('Getting Responses list');
  replyListStatus.textContent = `Processing...`;
  replyListStatus.style.color = "black";
  XHR.send();
}


/******************************************************************************
 *                 Attaching Listeners and Running Getters                    *
 ******************************************************************************/
const addQuestionForm = document.getElementById("add-question-form");
addQuestionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  questionAdd(addQuestionForm);
});

const addResponseForm = document.getElementById("add-response-form");
addResponseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  responseAdd(addResponseForm);
});

const backToQaMainBtn = document.getElementById("back-to-qa-main");
backToQaMainBtn.addEventListener("click", () => {
  document.getElementById("qa-main-section").style.display = "block";
  document.getElementById("qa-question-section").style.display = "none"
  CURRENT_QUESTION_ID = NO_QUESTION_ID;
})

const refreshQaListBtn = document.getElementById("refresh-qa-list-btn");
refreshQaListBtn.addEventListener("click", () => {
  loadQuestionIDs();
})

const refreshResponseListBtn = document.getElementById("refresh-response-list-btn");
refreshResponseListBtn.addEventListener("click", () => {
  loadQuestionResponses(CURRENT_QUESTION_ID);
})

loadQuestionIDs();
