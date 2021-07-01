const FRAME_RATE = 45;
const SNAKE_SPEED = 0.1;
const WIDTH = 640
const HEIGHT = 544;
const CELL_SIZE = 16;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// FETCH THIS FROM DATABASE LATER
let level = "";
let snake = {dir: "none", q_dir: "none", body: [], dirBody: []};
let walls = [];
let platforms = [];
let lava = [];
let food = [];
let gameLoop;
let endLoop;
let endParticles = [];
let endCount = 0;
let particleSize = 2;

document.addEventListener('DOMContentLoaded', () => {
    loadLevel(level);
    render();
    document.addEventListener('keydown', handleInput);
    gameLoop = setInterval(gameTick, 1000 / FRAME_RATE);
});

function gameTick() {
    moveSnake();
    render();
    checkCollisions();
}

function endGame() {
    clearInterval(gameLoop);
    endLoop = setInterval(endAnim, 1000 / FRAME_RATE);
    for (let i = 0; i < 64; i++) {
        let speed = Math.random() * 9 + 4;
        let maxDist = Math.random() * 75 + 50;
        let dist = 0;
        let angle = Math.random() * Math.PI * 2;
        let size = particleSize + Math.random() * 1.75;
        let newParticle = {x: snake.body[0].x * CELL_SIZE + CELL_SIZE / 2, y: snake.body[0].y * CELL_SIZE + CELL_SIZE / 2, angle, speed, size, dist, maxDist};
        endParticles.push(newParticle);
    }
}

function endAnim() {
    render();
    for (let i = 0; i < endParticles.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = "lime";
        ctx.arc(endParticles[i].x, endParticles[i].y, endParticles[i].size, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        endParticles[i].velX = Math.cos(endParticles[i].angle) * endParticles[i].speed;
        endParticles[i].velY = Math.sin(endParticles[i].angle) * endParticles[i].speed;
        endParticles[i].x += endParticles[i].velX;
        endParticles[i].y += endParticles[i].velY;
        endParticles[i].dist += endParticles[i].speed;
        if (endParticles[i].dist >= endParticles[i].maxDist) {
            endParticles[i] = "remove";
        }
    }
    endParticles.filter(item => item !== "remove");
    endCount++;
    if (endCount > 100) {
        clearInterval(endLoop);
        endParticles = [];
        render();
    }
}

function checkCollisions() {
    let snakeHead = snake.body[0];
    for (let i = 0; i < lava.length; i++) {
        if (rectCollisions(snakeHead, lava[i])) {
            endGame();
        }
    }
    for (let i = 0; i < walls.length; i++) {
        if (rectCollisions(snakeHead, walls[i])) {
            endGame();
        }
    }
    if (snake.body.length > 5) {
        for (let i = snake.body.length - 3; i > 2; i--) {
            snake.body.poopoo = true;
            if (snake.body[i].freeze) {
                continue;
            }
            if (rectCollisions(snakeHead, snake.body[i])) {
                endGame();
            }
        }
    }
    if (snakeHead.x < 0 || snakeHead.x > WIDTH / CELL_SIZE ||
        snakeHead.y < 0 || snakeHead.y > HEIGHT / CELL_SIZE) {
        endGame();
    }

    if (food.length == 0) {
        clearInterval(gameLoop);
        winGame();
    }
}

function winGame() {
    ctx.font = "73px Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.strokeText("Level Complete", WIDTH / 2, HEIGHT / 2);
    ctx.font = "72px Arial";
    ctx.fillText("Level Complete", WIDTH / 2, HEIGHT / 2);
    setTimeout(() => {
        window.location = "/level_preview";
    }, 2000);
}

function rectCollisions(obj1, obj2) {
    if (obj1.x * CELL_SIZE < obj2.x * CELL_SIZE + (CELL_SIZE - 1) &&
   obj1.x * CELL_SIZE + (CELL_SIZE - 1) > obj2.x * CELL_SIZE &&
   obj1.y * CELL_SIZE < obj2.y * CELL_SIZE + (CELL_SIZE - 1) &&
   obj1.y * CELL_SIZE + (CELL_SIZE - 1) > obj2.y * CELL_SIZE) {
       return true;
   }
   return false;
}

function circleRectCollision(circle,rect){
    const BULLET_SIZE = 8;
    const w = CELL_SIZE / 2;
    const h = CELL_SIZE / 2;
    let circle_x = circle.x * CELL_SIZE + BULLET_SIZE / 2;
    let circle_y = circle.y * CELL_SIZE + BULLET_SIZE / 2;

    let distX = Math.abs(circle_x - (rect.x * CELL_SIZE) -w/2);
    let distY = Math.abs(circle_y - (rect.y * CELL_SIZE) -h/2);

    if (distX > (w/2 + BULLET_SIZE)) { return false; }
    if (distY > (h/2 + BULLET_SIZE)) { return false; }

    if (distX <= (w)) { return true; } 
    if (distY <= (h)) { return true; }

    let dx=distX-w;
    let dy=distY-h;
    return (dx*dx+dy*dy<=(BULLET_SIZE * BULLET_SIZE));
}

function snakeQueueMove(move) {
    for (let i = 0; i < snake.body.length; i++) {
        if (!snake.body[i].freeze) {
            snake.body[i].m_queue.push(move);
        }
    }
}

function moveSnake() {
    let snakeHead = snake.body[0];
    snake.body[0].x = Math.round(snake.body[0].x * 10) / 10;
    snake.body[0].y = Math.round(snake.body[0].y * 10) / 10;
    if ((snake.q_dir == 'up' || snake.q_dir == 'down') && snakeHead.x % 1 == 0) {
        snake.dir = snake.q_dir;
        snake.q_dir = "none";
    } else if ((snake.q_dir == 'left' || snake.q_dir == 'right') && snakeHead.y % 1 == 0) {
        snake.dir = snake.q_dir;
        snake.q_dir = "none";
    }
    if (snake.dir != "none") {
        if (!((snake.dir == "up" && snakeHead.y <= 0) ||
            (snake.dir == "left" && snakeHead.x <= 0) ||
            (snake.dir == "right" && snakeHead.x >= WIDTH / CELL_SIZE - 1) ||
            (snake.dir == "down" && snakeHead.y >= HEIGHT / CELL_SIZE - 1))) {
                snakeQueueMove(snake.dir);
        }
    }
    for (let i = 0; i < snake.body.length; i++) {
        if (i == 0) {
            if (snake.body[i].m_queue[0] == 'up') {
                // CHANGE RETURNS TO SNAKE.DIE()
                if (snake.body[i].y <= 0) {
                    return;
                }
                snake.body[i].y -= SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            } else if (snake.body[i].m_queue[0] == 'right') {
                if (snake.body[i].x >= (WIDTH / CELL_SIZE) - 1) {
                    return;
                }
                snake.body[i].x += SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            } else if (snake.body[i].m_queue[0] == 'down') {
                if (snake.body[i].y >= (HEIGHT / CELL_SIZE) - 1) {
                    return;
                }
                snake.body[i].y += SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            } else if (snake.body[i].m_queue[0] == 'left') {
                if (snake.body[i].x <= 0) {
                    return;
                }
                snake.body[i].x -= SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            }
            for (let i = 0; i < food.length; i++) {
                if (circleRectCollision(food[i], snake.body[0])) {
                    // console.log(food[i], snake.body[0]);
                    food.splice(i, 1);
                    snake.body.splice(1, 0, {x: snake.body[0].x, y: snake.body[0].y, m_queue: [], freeze: true});
                }   
            }
        } else {
            if (snake.body[i].freeze) {
                if (Math.abs(snake.body[i - 1].x - snake.body[i].x) <= 0.3 &&
                    Math.abs(snake.body[i - 1].y - snake.body[i].y) <= 0.3) {
                    snake.body[i].freeze = false;
                    let newArr = [];
                    for (let a = 0; a < ((1 / SNAKE_SPEED) - 4) * (snake.body.length - 1); a++) {
                        newArr.unshift("none");
                    }
                    let prevQ = snake.body[i - 1].m_queue;
                    snake.body[i].m_queue = [...newArr, prevQ[0], prevQ[0], prevQ[0], prevQ[0], ...prevQ];
                } else {
                    return;
                }
            }
            if (snake.body[i].m_queue[0] == 'up') {
                snake.body[i].y -= SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            } else if (snake.body[i].m_queue[0] == 'right') {
                snake.body[i].x += SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            } else if (snake.body[i].m_queue[0] == 'down') {
                snake.body[i].y += SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            } else if (snake.body[i].m_queue[0] == 'left') {
                snake.body[i].x -= SNAKE_SPEED;
                snake.body[i].m_queue.shift();
            } else {
                snake.body[i].m_queue.shift();
            }
            snake.body[i].x = Math.round(snake.body[i].x * 10) / 10;
            snake.body[i].y = Math.round(snake.body[i].y * 10) / 10;
        }
    }
}

function render() {
    // Lava background (not calling array since canvas turns weird if lava is done individually)
    for (let x = 0; x < WIDTH / CELL_SIZE; x++) {
        for (let y = 0; y < HEIGHT / CELL_SIZE; y++) {
            // EVEN
            if ((x + y) % 2 == 0) {
                ctx.fillStyle = "hsla(0, 95%, 50%, 1)";
            }
            // ODD
            else {
                ctx.fillStyle = "hsla(0, 95%, 43%, 1)";
            }
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
    // Render walls
    ctx.fillStyle = 'slategray';
    for (let i = 0; i < walls.length; i++) {
        ctx.fillRect(walls[i].x * CELL_SIZE, walls[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    // Render platforms
    ctx.fillStyle = 'lightgray';
    for (let i = 0; i < platforms.length; i++) {
        ctx.fillRect(platforms[i].x * CELL_SIZE, platforms[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    // Render food
    ctx.fillStyle = 'gold';
    ctx.strokeStyle = 'black';
    for (let i = 0; i < food.length; i++) {
        ctx.beginPath();
        ctx.arc(food[i].x * CELL_SIZE + CELL_SIZE / 2, food[i].y * CELL_SIZE + CELL_SIZE / 2, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    // Render player
    ctx.fillStyle = 'lime';
    for (let i = snake.body.length - 1; i >= 0; i--) {
        if (i == 0) {
            ctx.fillRect(snake.body[i].x * CELL_SIZE, snake.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            ctx.fillStyle = "black";
            const EYE_SIZE = 5;
            if (snake.dir == "up" || snake.dir == "none") {
                ctx.fillRect(snake.body[i].x * CELL_SIZE + 2, snake.body[i].y * CELL_SIZE + 2, EYE_SIZE, EYE_SIZE);
                ctx.fillRect(snake.body[i].x * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, snake.body[i].y * CELL_SIZE + 2, EYE_SIZE, EYE_SIZE);
            } else if (snake.dir == "right") {
                ctx.fillRect(snake.body[i].x * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, snake.body[i].y * CELL_SIZE + 2, EYE_SIZE, EYE_SIZE);
                ctx.fillRect(snake.body[i].x * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, snake.body[i].y * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, EYE_SIZE, EYE_SIZE);
            } else if (snake.dir == "down") {
                ctx.fillRect(snake.body[i].x * CELL_SIZE + 2, snake.body[i].y * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, EYE_SIZE, EYE_SIZE);
                ctx.fillRect(snake.body[i].x * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, snake.body[i].y * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, EYE_SIZE, EYE_SIZE);
            } else if (snake.dir == "left") {
                ctx.fillRect(snake.body[i].x * CELL_SIZE + 2, snake.body[i].y * CELL_SIZE + 2, EYE_SIZE, EYE_SIZE);
                ctx.fillRect(snake.body[i].x * CELL_SIZE + 2, snake.body[i].y * CELL_SIZE + CELL_SIZE - 2 - EYE_SIZE, EYE_SIZE, EYE_SIZE);
            }
        } else {
            ctx.fillStyle = 'lime';
            if (snake.body[i].poopoo) {
                ctx.fillStyle = 'red';
            }
            ctx.fillRect(snake.body[i].x * CELL_SIZE + 2, snake.body[i].y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
    }
}

function handleInput(e) {
    e = e || window.event;

    // up arrow
    if (e.keyCode == '38') {
        if (snake.dir == 'down' && snake.body.length > 1) {
            return;
        };
        snake.q_dir = "up";
    }
    // down arrow
    else if (e.keyCode == '40') {
        if (snake.dir == 'up' && snake.body.length > 1) {
            return;
        };
        snake.q_dir = "down";
    }
    // left arrow
    else if (e.keyCode == '37') {
       if (snake.dir == 'right' && snake.body.length > 1) {
            return;
        };
        snake.q_dir = "left";
    }
    // right arrow
    else if (e.keyCode == '39') {
       if (snake.dir == 'left' && snake.body.length > 1) {
            return;
        };
        snake.q_dir = "right";
    }
}

function loadLevel(levelData) {
    let data = JSON.parse(levelData);
    snake.body = [Object.assign({m_queue: [], freeze: false}, data.spawnPos)];
    walls = data.walls.map(item => {return {x: item.x, y: item.y, type: 'wall'}});
    food = data.foods;
    platforms = data.platform.map(item => {return {x: item.x, y: item.y, type: 'platform'}});
    for (let x = 0; x < WIDTH / CELL_SIZE; x++) {
        for (let y = 0; y < HEIGHT / CELL_SIZE; y++) {
            
            let inside = false;
            for (let a = 0; a < walls.length; a++) {
                if (walls[a].x == x && walls[a].y == y) {
                    inside = true;
                    break;
                }
            }
            if (!inside) {
                for (let b = 0; b < platforms.length; b++) {
                    if (platforms[b].x == x && platforms[b].y == y) {
                        inside = true;
                        break;
                    }
                }
                if (!inside) {
                    lava.push({x, y, type: 'lava'});
                }
            }

        }
    }
}