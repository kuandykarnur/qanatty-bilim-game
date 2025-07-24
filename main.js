const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  velocity: 0,
  gravity: 0.5,
  jumpPower: -8
};

let isGameOver = false;
let pipes = [];
let score = 0;

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function generatePipe() {
  let top = Math.floor(Math.random() * (canvas.height - 200)) + 20;
  let gap = 120;
  let bottom = canvas.height - top - gap;

  pipes.push({
    x: canvas.width,
    width: 40,
    top: top,
    bottom: bottom
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px sans-serif";
  ctx.fillText("Ұпай: " + score, 20, 40);
}

function update() {
  if (isGameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Құс экраннан шықты ма?
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    isGameOver = true;
  }

  // Кедергілерді жаңарту
  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      isGameOver = true;
    }

    if (pipe.x + pipe.width === bird.x) {
      score++;
    }
  });

  // Экраннан шыққан кедергілерді өшіру
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "36px sans-serif";
    ctx.fillText("Ойын аяқталды", 80, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    bird.velocity = bird.jumpPower;
  }
});

setInterval(generatePipe, 2000);
gameLoop();
