let currentQuestionIndex = 0;
let score = 0;

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    alert("Ойын аяқталды! Ұпай: " + score);
    return;
  }

  const q = questions[currentQuestionIndex];
  const questionBox = document.getElementById("question-box");
  questionBox.innerHTML = `
    <h3>${q.question}</h3>
    ${q.answers.map((ans, i) => `
      <button onclick="answer(${i})">${ans}</button>
    `).join("")}
  `;
}

function answer(choice) {
  const q = questions[currentQuestionIndex];
  if (choice === q.correct) {
    score++;
  }
  currentQuestionIndex++;
  showQuestion();
}

// Құс ойыныңыз бөлек canvas-та жұмыс істейді, сұрақтар бөлек интерфейсте
window.onload = () => {
  showQuestion();
};
