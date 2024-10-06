const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const viewScoreButton = document.getElementById("view-score-btn"); // Get view-score button
const backButton = document.getElementById("back-btn"); // Get back button

const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const scoreContainerElement = document.getElementById("score");
const scoreElement = document.getElementById("right-answers");
const totalScoreContainerElement = document.getElementById("total-score-container");
const scoreCardContainerElement = document.getElementById("score-card-container"); // Get score card container
const scoreCardElement = document.getElementById("score-card"); // Get score card element
const totalScoreElement = document.getElementById("total-score");

let shuffledQuestions, currentQuestionIndex;
let quizScore = 0;

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});
viewScoreButton.addEventListener("click", viewScore); // Add event listener for view-score button
backButton.addEventListener("click", goBackToQuestion); // Add event listener for back button

function startGame() {
  startButton.classList.add("hide");
  scoreContainerElement.style.display = "flex";
  totalScoreContainerElement.style.display = "none"; // Hide total score container when the game restarts
  scoreCardContainerElement.classList.add("hide"); // Hide the score card container when the game restarts
  quizScore = 0; // Reset quizScore
  scoreElement.innerText = quizScore;
  fetchQuestions();
}

function fetchQuestions() {
  fetch('https://opentdb.com/api.php?amount=10&type=multiple')
    .then(response => response.json())
    .then(data => {
      shuffledQuestions = data.results.map((question, index) => ({
        question: question.question,
        questionNumber: index + 1,  // Assign question number
        answers: [
          ...question.incorrect_answers.map(answer => ({ text: answer, correct: false })),
          { text: question.correct_answer, correct: true }
        ].sort(() => Math.random() - 0.5) // Shuffle answers
      }));
      currentQuestionIndex = 0;
      questionContainerElement.classList.remove("hide");
      setNextQuestion();
    });
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerHTML = `Q${question.questionNumber}. ${question.question}`;  // Display question number
  answerButtonsElement.innerHTML = '';
  
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");

    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }

    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  viewScoreButton.classList.add("hide"); // Hide view-score button

  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";

  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct === "true");
  });

  if (correct) {
    quizScore++;
    scoreElement.innerText = quizScore;
  }

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
    viewScoreButton.classList.remove("hide"); // Show view-score button
  } else {
    startButton.innerText = "Restart";
    startButton.classList.remove("hide");
    questionContainerElement.classList.add("hide");
    totalScoreContainerElement.style.display = "flex";
    totalScoreElement.innerText = `${quizScore}/${shuffledQuestions.length}`;
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);

  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

function viewScore() {
  questionContainerElement.classList.add("hide");
  scoreCardContainerElement.classList.remove("hide");
  scoreCardElement.innerText = `${quizScore}/${shuffledQuestions.length}`;
}

function goBackToQuestion() {
  scoreCardContainerElement.classList.add("hide");
  questionContainerElement.classList.remove("hide");
  nextButton.classList.remove("hide");
  viewScoreButton.classList.remove("hide");
}
