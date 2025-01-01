const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 50;
const WIDTH = 60;
const HEIGHT = 60;

canvas.width = WIDTH * TILE_SIZE;
canvas.height = HEIGHT * TILE_SIZE;

let playerX = Math.floor(WIDTH / 2), playerY = Math.floor(HEIGHT / 2);
let experience = 0;
let walls = [];
let expTiles = [];
const margin = 5;

document.getElementById("controls").style.display = "none";
document.getElementById("expIndicator").style.display = "none";

document.getElementById("startButton").addEventListener("click", startGame);
document.addEventListener("keydown", movePlayer);
document.getElementById("upButton").addEventListener("click", () => movePlayer({ key: "ArrowUp" }));
document.getElementById("downButton").addEventListener("click", () => movePlayer({ key: "ArrowDown" }));
document.getElementById("leftButton").addEventListener("click", () => movePlayer({ key: "ArrowLeft" }));
document.getElementById("rightButton").addEventListener("click", () => movePlayer({ key: "ArrowRight" }));

function startGame() {
    document.getElementById("startButton").style.display = "none";
    document.getElementById("controls").style.display = "grid";
    document.getElementById("expIndicator").style.display = "block";

    generateMaze();
    draw();
}

function generateMaze() {
    walls = [];
    expTiles = [];
    for (let x = 1; x < WIDTH - 1; x++) {
        for (let y = 1; y < HEIGHT - 1; y++) {
            if ((Math.abs(x - playerX) <= margin && Math.abs(y - playerY) <= margin)) {
                continue;
            }
            if (Math.random() < 0.2) {
                walls.push({ x, y });
            }
        }
    }

    for (let x = 3; x < WIDTH - 3; x += randomDistance()) {
        for (let y = 3; y < HEIGHT - 3; y += randomDistance()) {
            if (!isWall(x, y) && (Math.abs(x - playerX) > margin || Math.abs(y - playerY) > margin)) {
                expTiles.push({ x, y });
            }
        }
    }

    regeneratePoints();
}

function randomDistance() {
    return Math.floor(Math.random() * (6 - 1 + 1)) + 1;
}

function isWall(x, y) {
    return walls.some(wall => wall.x === x && wall.y === y);
}

function regeneratePoints() {
    setInterval(() => {
        if (expTiles.length < 900) {
            const x = Math.floor(Math.random() * (WIDTH - 2)) + 1;
            const y = Math.floor(Math.random() * (HEIGHT - 2)) + 1;

            if (!isWall(x, y) && !expTiles.some(point => point.x === x && point.y === y)) {
                expTiles.push({ x, y });
            }
        }
    }, 5000);
}

function movePlayer(event) {
    let newX = playerX;
    let newY = playerY;

    if (event.key === "ArrowUp") newY--;
    if (event.key === "ArrowDown") newY++;
    if (event.key === "ArrowLeft") newX--;
    if (event.key === "ArrowRight") newX++;

    if (newX < 0) newX = WIDTH - 1;
    if (newX >= WIDTH) newX = 0;
    if (newY < 0) newY = HEIGHT - 1;
    if (newY >= HEIGHT) newY = 0;

    if (!isWall(newX, newY)) {
        playerX = newX;
        playerY = newY;
    }

    expTiles.forEach((expTile, index) => {
        if (playerX === expTile.x && playerY === expTile.y) {
            experience++;
            expTiles.splice(index, 1);
        }
    });

    updateExpIndicator();
    draw();
}

function updateExpIndicator() {
    document.getElementById('expAmount').textContent = experience;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    walls.forEach(wall => {
        ctx.fillRect(wall.x * TILE_SIZE, wall.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    const gradient = ctx.createLinearGradient(
        playerX * TILE_SIZE, playerY * TILE_SIZE,
        playerX * TILE_SIZE + TILE_SIZE, playerY * TILE_SIZE + TILE_SIZE
    );
    gradient.addColorStop(0, "#00FFFF");
    gradient.addColorStop(1, "#FF00FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(playerX * TILE_SIZE, playerY * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = "yellow";
    expTiles.forEach(expTile => {
        ctx.beginPath();
        ctx.arc(expTile.x * TILE_SIZE + TILE_SIZE / 2, expTile.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}
