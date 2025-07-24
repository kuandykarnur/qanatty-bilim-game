const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startText = document.getElementById('startText');

// Canvas өлшемі экранға сәйкес
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Құс
const bird = {
  x: 60,
  y: 200,
  width: 30,
  height: 30,
  velocity: 0,
  gravity: 0.6,
  jumpPower: -10
};

// Кедергілер
let pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
let pipeSpeed = 2;

// Ойын күйі
let gameStarted = false;
let score = 0;

// Құсты секірту
function jump() {
  if (!gameStarted) {
    gameStarted = true;
    startText.style.display = 'none';
  }
  bird.velocity = bird.jumpPower;
}
document.addEventListener('keydown', jump);
canvas.addEventListener('touchstart', jump);

// Кедергілерді жасау
function createPipe() {
  const topHeight = Math.random() * (canvas.height - pipeGap - 200) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap
  });
}

// Дербес ойын логикасы
function gameLoop() {
  if (!gameStarted) {
    requestAnimationFrame(gameLoop);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Құс физикасы
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Құсты салу
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Кедергілерді жылжыту және салу
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;

    ctx.fillStyle = 'green';
    ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top); // Жоғарғы құбыр
    ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, pipeWidth, pipes[i].bottom); // Төменгі

    // Құспен соқтығысу
    if (
      bird.x < pipes[i].x + pipeWidth &&
      bird.x + bird.width > pipes[i].x &&
      (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)
    ) {
      resetGame();
    }

    // Ұпай
    if (pipes[i].x + pipeWidth < bird.x && !pipes[i].passed) {
      score++;
      pipes[i].passed = true;
    }
  }

  // Құс жерге құлап кетсе
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    resetGame();
  }

  // Ұпай көрсету
  ctx.fillStyle = 'black';
  ctx.font = '24px sans-serif';
  ctx.fillText("Ұпай: " + score, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Ойынды қайта бастау
function resetGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameStarted = false;
  startText.style.display = 'block';
}

// Кедергілерді жиі жасау
setInterval(() => {
  if (gameStarted) {
    createPipe();
  }
}, 2000);

gameLoop();
