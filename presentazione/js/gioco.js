var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Carica l'immagine del bird
var birdImg = new Image();
birdImg.src = 'flappyBird.png'; // Assicurati di specificare il percorso corretto del file immagine

var bird = {
    x: 50,
    y: canvas.height / 2,
    width: 40, // Larghezza dell'immagine del bird
    height: 30, // Altezza dell'immagine del bird
    velocity: 0,
    gravity: 0.6,
    jumpStrength: -9
};

var pipes = [];

var gap = 120;
var pipeWidth = 20;
var pipeMargin = 150;
var pipeSpeed = 3;
var score = 0;

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipeX, pipeY, pipeHeight) {
    ctx.beginPath();
    ctx.rect(pipeX, pipeY, pipeWidth, pipeHeight);
    ctx.fillStyle = "#008000";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    drawBird();

    // Draw pipes
    for (var i = 0; i < pipes.length; i++) {
        drawPipe(pipes[i].x, 0, pipes[i].top);
        drawPipe(pipes[i].x, canvas.height - pipes[i].bottom, pipes[i].bottom);
    }

    // Display score
    ctx.font = "24px Arial black";
    ctx.fillText("Score: " + score, 20, 30);
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }

    // Generate pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeMargin) {
        var topHeight = Math.floor(Math.random() * (canvas.height - gap - pipeMargin)) + pipeMargin;
        var bottomHeight = canvas.height - gap - topHeight;
        pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
    }

    // Move pipes
    for (var i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        // Check collision
        if (bird.x + bird.width > pipes[i].x && bird.x < pipes[i].x + pipeWidth &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)) {
            gameOver();
        }

        // Check if passed through the pipe
        if (bird.x === pipes[i].x + pipeWidth) {
            score++;
        }

        // Remove pipes that are out of the canvas
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }
}

function gameOver() {
    alert("Game Over! Score: " + score);
    reset();
}

function reset() {
    bird.y = canvas.height / 2;
    pipes = [];
    score = 0;
}

function start() {
    document.addEventListener("keydown", function (event) {
        if (event.keyCode === 74) { // Space key
            bird.velocity = bird.jumpStrength;
        }
    });
    
    setInterval(function () {
        update();
        draw();
    }, 1000 / 60);
    
}
