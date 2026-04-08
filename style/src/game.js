const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 4
};

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Mouse
let mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Bullets
let bullets = [];
canvas.addEventListener("click", () => {
  const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  bullets.push({
    x: player.x,
    y: player.y,
    dx: Math.cos(angle) * 6,
    dy: Math.sin(angle) * 6
  });
});

// Zombies
let zombies = [];

function spawnZombie() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  zombies.push({ x, y, size: 20, speed: 1 });
}

setInterval(spawnZombie, 2000);

// Update
function update() {
  // Movement
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  // Bullets
  bullets.forEach(b => {
    b.x += b.dx;
    b.y += b.dy;
  });

  // Zombies follow player
  zombies.forEach(z => {
    const angle = Math.atan2(player.y - z.y, player.x - z.x);
    z.x += Math.cos(angle) * z.speed;
    z.y += Math.sin(angle) * z.speed;
  });

  // Collision
  zombies = zombies.filter(z => {
    for (let b of bullets) {
      const dist = Math.hypot(z.x - b.x, z.y - b.y);
      if (dist < z.size) return false;
    }
    return true;
  });
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, 5, 5);
  });

  // Zombies
  ctx.fillStyle = "green";
  zombies.forEach(z => {
    ctx.fillRect(z.x, z.y, z.size, z.size);
  });
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
