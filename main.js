const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = { x: 50, y: 150, width: 30, height: 30, gravity: 2, velocity: 0 };
let pipes = [];
let score = 0;
let gameInterval;
let questionVisible = false;

const questionBox = document.getElementById("question-box");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers");

let questions = [
  {
    q: "Қазақстанның астанасы қай қала?",
    a: ["Алматы", "Астана", "Шымкент"],
    c: "Астана"
  },
  {
    q: "Қазақстанның Тұңғыш Президенті кім?",
    a: ["Қасым-Жомарт Тоқаев", "Нұрсұлтан Назарбаев", "Әлихан Бөкейхан"],
    c: "Нұрсұлтан Назарбаев"
  },
  {
    q: "Ата заң қай жылы қабылданды?",
    a: ["1993", "1995", "2001"],
    c: "1995"
  },
  {
    q: "Қазақстанда неше облыс бар?",
    a: ["14", "17", "20"],
    c: "17"
  },
  {
    q: "Мемлекеттік тіл?",
    a: ["Орыс тілі", "Қазақ тілі", "Ағылшын тілі"],
    c: "Қазақ тілі"
  }
];

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);
  });
}

function showQuestion() {
  if (questions.length === 0) return;
  const index = Math.floor(Math.random() * questions.length);
  const question = questions.splice(index, 1)[0];

  questionText.textContent = question.q;
  answersBox.innerHTML = "";

  question.a.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = () => {
      questionBox.classList.add("hidden");
      questionVisible = false;
      if (answer === question.c) {
        score++;
      } else {
        clearInterval(gameInterval);
        alert("Ойын аяқталды! Ұпай: " + score);
        location.reload();
      }
    };
    answersBox.appendChild(btn);
  });

  questionBox.classList.remove("hidden");
  questionVisible = true;
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!questionVisible) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
      endGame();
    }

    pipes.forEach(pipe => {
      pipe.x -= 2;

      if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipe.gap)
      ) {
        showQuestion();
      }
    });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
      const top = Math.random() * 200 + 50;
      pipes.push({ x: canvas.width, width: 40, top: top, gap: 120 });
    }

    drawBird();
    drawPipes();
    ctx.fillStyle = "black";
    ctx.fillText("Ұпай: " + score, 10, 20);
  }
}

function endGame() {
  clearInterval(gameInterval);
  alert("Ойын аяқталды! Ұпай: " + score);
  location.reload();
}

document.addEventListener("keydown", () => {
  if (!questionVisible) {
    bird.velocity = -10;
  }
});

gameInterval = setInterval(updateGame, 20);
