const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const questionBox = document.getElementById('question-box');
const questionText = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const scoreDisplay = document.getElementById('score');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird = {
  x: 100,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  velocity: 0,
  gravity: 0.6,
  lift: -12
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 180;
let pipeSpeed = 3;
let score = 0;
let questionActive = false;
let currentQuestion = null;
let gameOver = false;

const questions = [
  {
    question: "Қазақстанның астанасы қай қала?",
    answers: ["Алматы", "Астана", "Шымкент", "Қарағанды"],
    correct: "Астана"
  },
  {
    question: "16 желтоқсан қандай күн?",
    answers: ["Жаңа жыл", "Тәуелсіздік күні", "Наурыз", "Ұстаздар күні"],
    correct: "Тәуелсіздік күні"
  },
  {
    question: "1 км неше метрге тең?",
    answers: ["100", "1000", "10", "10000"],
    correct: "1000"
  },
  {
    question: "Қазақстан туының түсі қандай?",
    answers: ["Қызыл", "Көк", "Жасыл", "Сары"],
    correct: "Көк"
  },
  {
    question: "Мұхтар Әуезов кім?",
    answers: ["Суретші", "Әнші", "Жазушы", "Әкім"],
    correct: "Жазушы"
  },
  {
    question: "9 мамыр қандай мереке?",
    answers: ["Білім күні", "Жеңіс күні", "Тәуелсіздік күні", "Наурыз"],
    correct: "Жеңіс күні"
  }
];

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "#4CAF50";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

function update() {
  if (gameOver || questionActive) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    // Соқтығысу тексеру
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      endGame();
    }

    // Сұрақ көрсету уақыты
    if (!pipe.asked && pipe.x + pipeWidth < bird.x) {
      showQuestion();
      pipe.asked = true;
      score += 1;
      updateScore();
    }
  });

  // Құлау
  if (bird.y > canvas.height || bird.y < 0) {
    endGame();
  }

  // Бағандарды тазалау
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function addPipe() {
  let top = Math.random() * (canvas.height - pipeGap - 200) + 50;
  let bottom = top + pipeGap;
  pipes.push({ x: canvas.width, top: top, bottom: bottom, asked: false });
}

function showQuestion() {
  questionActive = true;
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  questionText.innerText = currentQuestion.question;
  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach(answer => {
    let div = document.createElement("div");
    div.className = "answer";
    div.innerText = answer;
    div.onclick = () => checkAnswer(answer);
    answersContainer.appendChild(div);
  });

  questionBox.style.display = "block";
}

function checkAnswer(answer) {
  if (answer === currentQuestion.correct) {
    questionBox.style.display = "none";
    questionActive = false;
  } else {
    endGame();
  }
}

function updateScore() {
  scoreDisplay.innerText = "Ұпай: " + score;
}

function endGame() {
  gameOver = true;
  questionBox.style.display = "none";
  alert("Ойын аяқталды! Жалпы ұпай: " + score);
  window.location.reload();
}

// Құсты ұшыру
document.addEventListener("keydown", function (e) {
  if (e.code === "Space" || e.code === "ArrowUp") {
    bird.velocity = bird.lift;
  }
});

document.addEventListener("click", function () {
  if (!questionActive && !gameOver) {
    bird.velocity = bird.lift;
  }
});

setInterval(addPipe, 2000);
gameLoop();
