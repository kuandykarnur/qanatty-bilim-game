const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird = {
  x: 80,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  gravity: 0.6,
  lift: -12,
  velocity: 0
};

let pipes = [];
let score = 0;
let questionIndex = 0;
let showQuestion = false;
let gamePaused = false;

const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("question");
const optionsBox = document.getElementById("options");

const questions = [
  {
    question: "Қазақстан Республикасының Астанасы қай қала?",
    options: ["Алматы", "Шымкент", "Астана", "Орал"],
    answer: "Астана"
  },
  {
    question: "Елтаңбада қандай жануар бейнеленген?",
    options: ["Жылқы", "Барыс", "Қыран", "Қой"],
    answer: "Жылқы"
  },
  {
    question: "Қазақстан Тәуелсіздігін қай жылы алды?",
    options: ["1991", "2001", "1986", "1993"],
    answer: "1991"
  },
  {
    question: "Қазақстанда неше облыс бар?",
    options: ["14", "17", "12", "16"],
    answer: "17"
  },
  {
    question: "ҚР Парламенті неше палатадан тұрады?",
    options: ["1", "2", "3", "4"],
    answer: "2"
  },
  {
    question: "Елбасы сөзі нені білдіреді?",
    options: ["Министр", "Президент", "Батыр", "Сенатор"],
    answer: "Президент"
  }
];

function drawBird() {
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2);
  ctx.fill();
}

function createPipe() {
  let topHeight = Math.floor(Math.random() * (canvas.height / 2));
  let bottomHeight = canvas.height - topHeight - 200;

  pipes.push({
    x: canvas.width,
    width: 60,
    top: topHeight,
    bottom: bottomHeight
  });
}

function drawPipes() {
  ctx.fillStyle = "#228B22";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function checkCollision(pipe) {
  if (
    bird.x + bird.width / 2 > pipe.x &&
    bird.x - bird.width / 2 < pipe.x + pipe.width &&
    (
      bird.y - bird.height / 2 < pipe.top ||
      bird.y + bird.height / 2 > canvas.height - pipe.bottom
    )
  ) {
    gamePaused = true;
    showNextQuestion();
  }
}

function showNextQuestion() {
  if (questionIndex >= questions.length) questionIndex = 0;
  const current = questions[questionIndex];

  questionText.textContent = current.question;
  optionsBox.innerHTML = "";

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      if (option === current.answer) {
        score++;
        gamePaused = false;
        questionBox.classList.add("hidden");
      } else {
        score = Math.max(0, score - 1);
        // stay on question
      }
    };
    optionsBox.appendChild(btn);
  });

  questionBox.classList.remove("hidden");
  questionIndex++;
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("Ұпай: " + score, 20, 40);
}

function updateGame() {
  if (!gamePaused) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height / 2 >= canvas.height) {
      bird.y = canvas.height - bird.height / 2;
      bird.velocity = 0;
    }

    pipes.forEach(pipe => {
      pipe.x -= 4;
      checkCollision(pipe);
    });

    if (pipes.length && pipes[0].x + pipes[0].width < 0) {
      pipes.shift();
    }

    if (pipes.length < 3 || pipes[pipes.length - 1].x < canvas.width - 300) {
      createPipe();
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();

  requestAnimationFrame(updateGame);
}

window.addEventListener("keydown", e => {
  if (e.code === "Space") {
    bird.velocity = bird.lift;
  }
});

canvas.addEventListener("click", () => {
  bird.velocity = bird.lift;
});

createPipe();
updateGame();

// Құс ойыныңыз бөлек canvas-та жұмыс істейді, сұрақтар бөлек интерфейсте
window.onload = () => {
  showQuestion();
};
