// Define an array of questions and their weights
const questions = [
  { question: "Creativity / Originality", weight: 2 },
  { question: "Entertainment", weight: 3 },
  { question: "Score", weight: 2 },
  { question: "Plot", weight: 3 },
  { question: "Cinematography", weight: 2 },
  { question: "Characters", weight: 2.5 },
  { question: "Theme/Message", weight: 1.5 }
];

// Array to store the selected numbers
const selectedNumbers = [];

// Array to store the weights
const weights = [];

// Current question index
let currentQuestionIndex = -1; // Start at -1 to handle the initial number selection

// Weighted average
let weightedAverage = 0;

// Initial selection number
let initialSelection = 0;

// Function to render the initial number selection
function renderInitialSelection() {
  const questionContainer = document.getElementById('questionContainer');
  questionContainer.innerHTML = ''; // Clear the container

  const questionDiv = document.createElement('div');
  const questionLabel = document.createElement('label');
  questionLabel.textContent = "Initial Rating";


  const buttonContainer = document.createElement('div');
  for (let i = 1; i <= 10; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', () => handleInitialSelection(i));
      buttonContainer.appendChild(button);
  }

  questionDiv.appendChild(questionLabel);
  questionDiv.appendChild(buttonContainer);
  questionContainer.appendChild(questionDiv);
}

// Function to handle the initial number selection
function handleInitialSelection(selectedNumber) {
  initialSelection = selectedNumber;
  currentQuestionIndex = 0;
  selectedNumbers[0] = selectedNumber;
  renderQuestion();
}

// Function to render the current question
function renderQuestion() {
  const questionContainer = document.getElementById('questionContainer');
  // Can add text
  questionContainer.innerHTML = ''; // Clear the container

  const questionDiv = document.createElement('div');
  const questionLabel = document.createElement('label');
  questionLabel.textContent = `${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].question}`;

  const buttonContainer = document.createElement('div');
  for (let i = 1; i <= 10; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', () => handleButtonClick(i));
      buttonContainer.appendChild(button);
  }

  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.addEventListener('click', handleBackButton);
  backButton.disabled = currentQuestionIndex === 0;
  backButton.style.backgroundColor = 'orange'; // Apply inline style to the Reset button for styling

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.addEventListener('click', handleResetButton);
  resetButton.style.backgroundColor = 'orange'; // Apply inline style to the Reset button for styling

  questionDiv.appendChild(questionLabel);
  questionDiv.appendChild(buttonContainer);
  questionDiv.appendChild(backButton);
  questionDiv.appendChild(resetButton);
  questionContainer.appendChild(questionDiv);
}

// Function to handle button click
function handleButtonClick(selectedNumber) {
  selectedNumbers[currentQuestionIndex] = selectedNumber;
  weights[currentQuestionIndex] = questions[currentQuestionIndex].weight;
  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length) {
      weightedAverage = calculateWeightedAverage();
      displayResult();
  } else {
      renderQuestion();
  }
}

// Function to handle back button click
function handleBackButton() {
  currentQuestionIndex--;
  renderQuestion();
}

// Function to handle reset button click
function handleResetButton() {
  currentQuestionIndex = -1;
  selectedNumbers.length = 0; // Clear the selectedNumbers array
  weights.length = 0; // Clear the weights array
  weightedAverage = 0; // Reset the weighted average
  initialSelection = 0; // Reset the initial selection
  location.reload();
  renderInitialSelection();
}

// Function to calculate the weighted average
function calculateWeightedAverage() {
  let sum = 0;
  let weightSum = 0;

  for (let i = 0; i < selectedNumbers.length; i++) {
      sum += selectedNumbers[i] * weights[i];
      weightSum += weights[i];
  }

  const average = sum / weightSum;
  return average;
}

// Function to round a number to the nearest 0.5
function roundToHalf(number) {
  return Math.round(number * 2) / 2;
}

// Function to display the result
function displayResult() {
  const resultContainer = document.getElementById('resultContainer');
 // resultContainer.textContent = `TEXT`;

  const initialSelectionContainer = document.getElementById('initialSelection');
  initialSelectionContainer.textContent = `Original Rating: ${initialSelection}`;

  if (currentQuestionIndex === questions.length) {
      const roundedWeightedAverage = roundToHalf(weightedAverage.toFixed(2)); // Round the weighted average
      const weightedAverageContainer = document.getElementById('weightedAverage');
      weightedAverageContainer.textContent = `Recommended Rating: ${roundedWeightedAverage}`;
  }
}

function toggleTheme() {
  if (document.body.classList.contains("dark"))
      document.body.classList.remove("dark");
  else
      document.body.classList.add("dark");
}
// Render the initial number selection
renderInitialSelection();

