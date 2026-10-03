// --- Constants (grid and timing) ---
const GRID = 20;
const CELL = 24;
const TICK_MS = 120;

// Canvas colors (match style.css theme)
const COLOR_BG = "#25252b";
const COLOR_SNAKE = "#c9a227";
const COLOR_HEAD = "#e8c547";
const COLOR_FOOD = "#e85d5d";

// --- DOM ---
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("overlay-message");

// --- Game state ---
let snake;
let direction;
let nextDir;
let food;
let score;
let state;
let timerId;

function initialSnake() {
  const y = Math.floor(GRID / 2);
  const cx = Math.floor(GRID / 2);
  return [
    { x: cx + 1, y },
    { x: cx, y },
    { x: cx - 1, y },
  ];
}

function resetGame() {
  snake = initialSnake();
  direction = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = "Score: " + score;
  spawnFood();
}

function spawnFood() {
  let x;
  let y;
  let onSnake;
  do {
    x = Math.floor(Math.random() * GRID);
    y = Math.floor(Math.random() * GRID);
    onSnake = snake.some(function (seg) {
      return seg.x === x && seg.y === y;
    });
  } while (onSnake);
  food = { x: x, y: y };
}

function draw() {
  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    const seg = snake[i];
    ctx.fillStyle = i === 0 ? COLOR_HEAD : COLOR_SNAKE;
    ctx.fillRect(seg.x * CELL, seg.y * CELL, CELL, CELL);
  }

  const cx = food.x * CELL + CELL / 2;
  const cy = food.y * CELL + CELL / 2;
  const radius = CELL / 2 - 2;
  ctx.fillStyle = COLOR_FOOD;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function stopLoop() {
  if (timerId !== undefined) {
    clearInterval(timerId);
    timerId = undefined;
  }
}

function startLoop() {
  stopLoop();
  timerId = setInterval(tick, TICK_MS);
}

function die() {
  stopLoop();
  state = "gameover";
  overlayMessage.textContent =
    "Game Over — Score: " + score + " — Press Enter to restart";
  overlay.classList.remove("hidden");
}

function tick() {
  if (state !== "running") {
    return;
  }

  // Apply buffered input; block 180° reversal
  const opposite =
    direction.x === -nextDir.x && direction.y === -nextDir.y;
  if (!opposite && (nextDir.x !== 0 || nextDir.y !== 0)) {
    direction = { x: nextDir.x, y: nextDir.y };
  }

  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  // Wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= GRID ||
    newHead.y < 0 ||
    newHead.y >= GRID
  ) {
    die();
    return;
  }

  const willEat = newHead.x === food.x && newHead.y === food.y;

  // Self collision (tail vacates this tick unless we are growing)
  for (let i = 0; i < snake.length; i++) {
    if (!willEat && i === snake.length - 1) {
      continue;
    }
    if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
      die();
      return;
    }
  }

  snake.unshift(newHead);

  const ate = willEat;
  if (ate) {
    score += 1;
    scoreEl.textContent = "Score: " + score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function setOverlayForState() {
  if (state === "ready") {
    overlayMessage.textContent = "Press Enter to start";
    overlay.classList.remove("hidden");
  } else if (state === "paused") {
    overlayMessage.textContent = "Paused — Press Space to resume";
    overlay.classList.remove("hidden");
  } else if (state === "running") {
    overlay.classList.add("hidden");
  }
  // gameover message is set in die()
}

function startPlaying() {
  state = "running";
  setOverlayForState();
  startLoop();
  draw();
}

function pauseGame() {
  stopLoop();
  state = "paused";
  setOverlayForState();
}

function resumeGame() {
  state = "running";
  setOverlayForState();
  startLoop();
}

function restartFromGameOver() {
  resetGame();
  startPlaying();
}

function onKeyDown(e) {
  const key = e.key;

  if (key === " " || key === "Spacebar") {
    e.preventDefault();
    if (state === "gameover") {
      restartFromGameOver();
    } else if (state === "running") {
      pauseGame();
    } else if (state === "paused") {
      resumeGame();
    }
    return;
  }

  if (key === "Enter") {
    e.preventDefault();
    if (state === "ready") {
      startPlaying();
    } else if (state === "gameover") {
      restartFromGameOver();
    }
    return;
  }

  if (state !== "running" && state !== "paused") {
    return;
  }

  let dx = 0;
  let dy = 0;
  if (key === "ArrowUp" || key === "w" || key === "W") {
    dx = 0;
    dy = -1;
  } else if (key === "ArrowDown" || key === "s" || key === "S") {
    dx = 0;
    dy = 1;
  } else if (key === "ArrowLeft" || key === "a" || key === "A") {
    dx = -1;
    dy = 0;
  } else if (key === "ArrowRight" || key === "d" || key === "D") {
    dx = 1;
    dy = 0;
  } else {
    return;
  }

  e.preventDefault();
  nextDir = { x: dx, y: dy };
}

function init() {
  resetGame();
  state = "ready";
  setOverlayForState();
  draw();
  window.addEventListener("keydown", onKeyDown);
}

init();
