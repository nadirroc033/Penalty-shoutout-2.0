const canvas = document.getElementById("myCanvas2");
const ctx = canvas.getContext("2d");

const canvasWidth = 1536;
const canvasHeight = 710;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const square = {
    x: 100,
    y: 280,
    width: 150,
    height: 200,
    speed: 2,
};

const ball = {
    x: canvasWidth / 2,
    y: canvasHeight - 30,
    radius: 15,
    speed: 5,
    moving: false,
    directionX: 0,
    directionY: -1,
    kickPower: 0,
};

const bounceRegionStart = 514;
const bounceRegionEnd = 1021;

const goalkeeperImg = new Image();
goalkeeperImg.src = "goalkeeper.png";

const soccerBallImg = new Image();
soccerBallImg.src = "768px-Soccerball.svg.png";

let punten = 0;
let kickStartTime;
let explosion = {
    x: 0,
    y: 0,
    radius: 0,
    alpha: 1,
};

let playerName = getCookie("playerName") || prompt("Voer je naam in:");

function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}`;
    document.cookie = cookieString;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function saveHighScore() {
    const highScores = getHighScores();
    highScores.push({ playerName, punten });
    setCookie("highScores", JSON.stringify(highScores), 30);
}

function getHighScores() {
    const highScoresCookie = getCookie("highScores");
    return highScoresCookie ? JSON.parse(highScoresCookie) : [];
}

function drawBackground() {
    const backgroundImg = new Image();
    backgroundImg.src = "goal2.jpg";

    backgroundImg.onload = function () {
        ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight);

        drawTransparentRectangle();
        drawSquare();
        drawBall();
        drawExplosion();
    };
}


function drawTransparentRectangle() {
    ctx.globalAlpha = 0.5;

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(bounceRegionStart, 255, bounceRegionEnd - bounceRegionStart, 212);

    ctx.globalAlpha = 1.0;
}

function drawSquare() {
    ctx.drawImage(goalkeeperImg, square.x, square.y, square.width, square.height);
}

function drawBall() {
    ctx.drawImage(soccerBallImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function drawExplosion() {
    if (explosion.radius > 0) {
        ctx.globalAlpha = explosion.alpha;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

function drawScoreboard() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Speler: " + playerName, 10, 30);
    ctx.fillText("Score: " + punten, 10, 60);
}

function updateSquare() {
    square.x += square.speed;

    if (square.x + square.width > bounceRegionEnd) {
        scorePoint();
        square.x = bounceRegionEnd - square.width;
        square.speed = -Math.abs(square.speed);
    }

    if (square.x < bounceRegionStart) {
        square.x = bounceRegionStart;
        square.speed = Math.abs(square.speed);
    }

    if (
        ball.x + ball.radius > square.x &&
        ball.x - ball.radius < square.x + square.width &&
        ball.y + ball.radius > square.y &&
        ball.y - ball.radius < square.y + square.height
    ) {
        missPoint();
    }
}

function updateBall() {
    if (ball.moving) {
        ball.y += ball.speed * ball.directionY;
        ball.x += ball.speed * ball.directionX;

        if (
            ball.y - ball.radius < 0 ||
            ball.x + ball.radius > canvasWidth ||
            ball.x - ball.radius < 0 ||
            ball.y + ball.radius > canvasHeight
        ) {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight - 30;
    ball.moving = false;
    ball.directionX = 0;
    ball.directionY = -1;
    kickStartTime = undefined;
    explosion.radius = 0;
}


function createExplosion() {
    explosion.x = ball.x;
    explosion.y = ball.y;
    explosion.radius = 1;
    kickStartTime = Date.now();
}

function handleMouseClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const vectorX = mouseX - ball.x;
    const vectorY = mouseY - ball.y;

    const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    ball.directionX = vectorX / length;
    ball.directionY = vectorY / length;

    ball.moving = true;
    const kickPower = length / 10;
    createExplosion();
}


function updateExplosion() {
    if (explosion.radius > 0) {
        const elapsed = Date.now() - kickStartTime;
        explosion.radius = Math.min(elapsed / 5, 50);
        explosion.alpha = 1 - elapsed / 500;
    }
}


function scorePoint() {
    if (ball.moving) {
        punten++;
        saveHighScore();
        alert("Goed gedaan! Je hebt nu " + punten + " keer gescoord.");
        createExplosion();

        square.speed = Math.abs(square.speed) + 1;
    }
    resetBall();
}


function bepaalNiveau(punten) {
    if (punten < 3) {
        return "Easy";
    } else if (punten < 6) {
        return "Medium";
    } else if (punten < 9) {
        return "Hard";
    } else {
        return "Impossible";
    }
}

function tekenNiveau() {
    const huidigNiveau = bepaalNiveau(punten);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Level: " + huidigNiveau, canvasWidth - 150, 30);
}

function missPoint() {
    if (ball.moving) {
        alert("Gemist! Probeer opnieuw om de bal in het doel te krijgen.");
        resetLevelAndScore();
        createExplosion();
    }
    resetBall();
}

function resetLevelAndScore() {
    punten = 0;
    square.speed = 2;
    resetBall();
}

function animate() {
    updateSquare();
    updateBall();
    updateExplosion();
    drawBackground();
    drawSquare();
    drawBall();
    drawExplosion();
    drawScoreboard();
    checkGoal();

    tekenNiveau();

    requestAnimationFrame(animate);
}

function checkGoal() {
    if (
        ball.moving &&
        ball.x > bounceRegionStart &&
        ball.x < bounceRegionEnd &&
        ball.y - ball.radius < 255 &&
        ball.y + ball.radius > 255 &&
        ball.y + ball.radius < 467
    ) {
        scorePoint();
    }
}

canvas.addEventListener("click", handleMouseClick);

animate();