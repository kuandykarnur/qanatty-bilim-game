const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 480;

function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Qanatty Bilim Game", 50, 240);
}
setInterval(draw, 1000/60);
