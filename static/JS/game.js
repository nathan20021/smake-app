const FRAME_RATE = 45;
const SNAKE_SPEED = 0.1;
const WIDTH = 640;
const HEIGHT = 480;
const CELL_SIZE = 20;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// FETCH THIS FROM DATABASE LATER
let level = '{ "startPos": {"x": 24, "y": 17}, "foods": [{"x":3,"y":2},{"x":4,"y":2},{"x":4,"y":10},{"x":4,"y":11},{"x":4,"y":12},{"x":4,"y":13},{"x":4,"y":14},{"x":4,"y":15},{"x":4,"y":16},{"x":4,"y":17},{"x":4,"y":18},{"x":4,"y":19},{"x":4,"y":20},{"x":5,"y":20},{"x":6,"y":20},{"x":7,"y":20},{"x":8,"y":11},{"x":12,"y":8},{"x":13,"y":8},{"x":14,"y":20},{"x":15,"y":3},{"x":15,"y":21},{"x":18,"y":19},{"x":20,"y":9},{"x":21,"y":10},{"x":22,"y":11},{"x":23,"y":12},{"x":24,"y":13},{"x":25,"y":3},{"x":25,"y":4},{"x":25,"y":5},{"x":29,"y":18}], "walls": [{"x":0,"y":0},{"x":0,"y":1},{"x":0,"y":2},{"x":0,"y":3},{"x":0,"y":4},{"x":0,"y":5},{"x":0,"y":6},{"x":0,"y":7},{"x":0,"y":8},{"x":0,"y":9},{"x":0,"y":10},{"x":0,"y":11},{"x":0,"y":12},{"x":0,"y":13},{"x":1,"y":0},{"x":1,"y":13},{"x":2,"y":0},{"x":2,"y":13},{"x":3,"y":0},{"x":3,"y":13},{"x":3,"y":14},{"x":3,"y":15},{"x":3,"y":16},{"x":3,"y":17},{"x":3,"y":18},{"x":3,"y":19},{"x":3,"y":20},{"x":3,"y":21},{"x":4,"y":0},{"x":4,"y":21},{"x":5,"y":0},{"x":5,"y":13},{"x":5,"y":14},{"x":5,"y":15},{"x":5,"y":16},{"x":5,"y":17},{"x":5,"y":18},{"x":5,"y":19},{"x":5,"y":21},{"x":6,"y":0},{"x":6,"y":13},{"x":6,"y":19},{"x":6,"y":21},{"x":7,"y":0},{"x":7,"y":13},{"x":7,"y":19},{"x":7,"y":21},{"x":7,"y":22},{"x":8,"y":0},{"x":8,"y":13},{"x":8,"y":14},{"x":8,"y":15},{"x":8,"y":16},{"x":8,"y":17},{"x":8,"y":18},{"x":8,"y":19},{"x":8,"y":22},{"x":9,"y":0},{"x":9,"y":22},{"x":10,"y":0},{"x":10,"y":13},{"x":10,"y":14},{"x":10,"y":15},{"x":10,"y":16},{"x":10,"y":17},{"x":10,"y":18},{"x":10,"y":22},{"x":11,"y":0},{"x":11,"y":13},{"x":11,"y":18},{"x":11,"y":22},{"x":12,"y":0},{"x":12,"y":13},{"x":12,"y":18},{"x":12,"y":22},{"x":13,"y":0},{"x":13,"y":1},{"x":13,"y":2},{"x":13,"y":3},{"x":13,"y":4},{"x":13,"y":5},{"x":13,"y":10},{"x":13,"y":11},{"x":13,"y":12},{"x":13,"y":13},{"x":13,"y":18},{"x":13,"y":22},{"x":14,"y":0},{"x":14,"y":13},{"x":14,"y":18},{"x":14,"y":22},{"x":15,"y":0},{"x":15,"y":13},{"x":15,"y":18},{"x":15,"y":22},{"x":16,"y":0},{"x":16,"y":13},{"x":16,"y":15},{"x":16,"y":16},{"x":16,"y":17},{"x":16,"y":18},{"x":16,"y":22},{"x":16,"y":23},{"x":17,"y":0},{"x":17,"y":13},{"x":17,"y":15},{"x":17,"y":23},{"x":18,"y":0},{"x":18,"y":13},{"x":18,"y":15},{"x":18,"y":17},{"x":18,"y":18},{"x":18,"y":23},{"x":19,"y":0},{"x":19,"y":13},{"x":19,"y":15},{"x":19,"y":17},{"x":19,"y":18},{"x":19,"y":19},{"x":19,"y":21},{"x":19,"y":23},{"x":20,"y":0},{"x":20,"y":13},{"x":20,"y":14},{"x":20,"y":15},{"x":20,"y":17},{"x":20,"y":18},{"x":20,"y":19},{"x":20,"y":21},{"x":20,"y":23},{"x":21,"y":0},{"x":21,"y":13},{"x":21,"y":14},{"x":21,"y":21},{"x":21,"y":23},{"x":22,"y":0},{"x":22,"y":13},{"x":22,"y":14},{"x":22,"y":21},{"x":22,"y":23},{"x":23,"y":0},{"x":23,"y":13},{"x":23,"y":14},{"x":23,"y":21},{"x":23,"y":23},{"x":24,"y":0},{"x":24,"y":21},{"x":24,"y":23},{"x":25,"y":0},{"x":25,"y":13},{"x":25,"y":14},{"x":25,"y":23},{"x":26,"y":0},{"x":26,"y":13},{"x":26,"y":14},{"x":26,"y":15},{"x":26,"y":16},{"x":26,"y":17},{"x":26,"y":19},{"x":26,"y":20},{"x":26,"y":21},{"x":26,"y":22},{"x":26,"y":23},{"x":27,"y":0},{"x":27,"y":13},{"x":27,"y":17},{"x":27,"y":19},{"x":28,"y":0},{"x":28,"y":1},{"x":28,"y":2},{"x":28,"y":3},{"x":28,"y":4},{"x":28,"y":6},{"x":28,"y":7},{"x":28,"y":8},{"x":28,"y":9},{"x":28,"y":10},{"x":28,"y":11},{"x":28,"y":12},{"x":28,"y":13},{"x":28,"y":17},{"x":28,"y":19},{"x":29,"y":4},{"x":29,"y":6},{"x":29,"y":7},{"x":29,"y":8},{"x":29,"y":9},{"x":29,"y":10},{"x":29,"y":11},{"x":29,"y":12},{"x":29,"y":13},{"x":29,"y":14},{"x":29,"y":15},{"x":29,"y":16},{"x":29,"y":17},{"x":29,"y":19},{"x":30,"y":4},{"x":30,"y":19},{"x":31,"y":4},{"x":31,"y":5},{"x":31,"y":6},{"x":31,"y":7},{"x":31,"y":8},{"x":31,"y":9},{"x":31,"y":10},{"x":31,"y":11},{"x":31,"y":12},{"x":31,"y":13},{"x":31,"y":14},{"x":31,"y":15},{"x":31,"y":16},{"x":31,"y":17},{"x":31,"y":18},{"x":31,"y":19}], "platform": [{"x":1,"y":1},{"x":1,"y":2},{"x":1,"y":3},{"x":1,"y":4},{"x":1,"y":5},{"x":1,"y":6},{"x":1,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":1,"y":10},{"x":1,"y":11},{"x":1,"y":12},{"x":2,"y":1},{"x":2,"y":2},{"x":2,"y":3},{"x":2,"y":4},{"x":2,"y":5},{"x":2,"y":6},{"x":2,"y":7},{"x":2,"y":8},{"x":2,"y":9},{"x":2,"y":10},{"x":2,"y":11},{"x":2,"y":12},{"x":3,"y":1},{"x":3,"y":2},{"x":3,"y":3},{"x":3,"y":4},{"x":3,"y":5},{"x":3,"y":6},{"x":3,"y":7},{"x":3,"y":8},{"x":3,"y":9},{"x":3,"y":10},{"x":3,"y":11},{"x":3,"y":12},{"x":4,"y":1},{"x":4,"y":2},{"x":4,"y":3},{"x":4,"y":5},{"x":4,"y":6},{"x":4,"y":7},{"x":4,"y":8},{"x":4,"y":9},{"x":4,"y":10},{"x":4,"y":11},{"x":4,"y":12},{"x":4,"y":13},{"x":4,"y":14},{"x":4,"y":15},{"x":4,"y":16},{"x":4,"y":17},{"x":4,"y":18},{"x":4,"y":19},{"x":4,"y":20},{"x":5,"y":1},{"x":5,"y":2},{"x":5,"y":3},{"x":5,"y":4},{"x":5,"y":6},{"x":5,"y":7},{"x":5,"y":8},{"x":5,"y":9},{"x":5,"y":10},{"x":5,"y":11},{"x":5,"y":12},{"x":5,"y":20},{"x":6,"y":1},{"x":6,"y":2},{"x":6,"y":3},{"x":6,"y":4},{"x":6,"y":5},{"x":6,"y":8},{"x":6,"y":9},{"x":6,"y":10},{"x":6,"y":11},{"x":6,"y":12},{"x":6,"y":20},{"x":7,"y":1},{"x":7,"y":3},{"x":7,"y":4},{"x":7,"y":5},{"x":7,"y":6},{"x":7,"y":7},{"x":7,"y":9},{"x":7,"y":10},{"x":7,"y":11},{"x":7,"y":12},{"x":7,"y":20},{"x":8,"y":1},{"x":8,"y":2},{"x":8,"y":4},{"x":8,"y":5},{"x":8,"y":6},{"x":8,"y":7},{"x":8,"y":8},{"x":8,"y":9},{"x":8,"y":10},{"x":8,"y":11},{"x":8,"y":12},{"x":8,"y":20},{"x":8,"y":21},{"x":9,"y":1},{"x":9,"y":2},{"x":9,"y":3},{"x":9,"y":6},{"x":9,"y":7},{"x":9,"y":8},{"x":9,"y":9},{"x":9,"y":10},{"x":9,"y":11},{"x":9,"y":12},{"x":9,"y":13},{"x":9,"y":14},{"x":9,"y":15},{"x":9,"y":16},{"x":9,"y":17},{"x":9,"y":18},{"x":9,"y":19},{"x":9,"y":20},{"x":9,"y":21},{"x":10,"y":1},{"x":10,"y":2},{"x":10,"y":3},{"x":10,"y":4},{"x":10,"y":5},{"x":10,"y":7},{"x":10,"y":8},{"x":10,"y":9},{"x":10,"y":10},{"x":10,"y":11},{"x":10,"y":12},{"x":10,"y":19},{"x":10,"y":20},{"x":10,"y":21},{"x":11,"y":1},{"x":11,"y":2},{"x":11,"y":3},{"x":11,"y":4},{"x":11,"y":5},{"x":11,"y":6},{"x":11,"y":7},{"x":11,"y":8},{"x":11,"y":9},{"x":11,"y":10},{"x":11,"y":11},{"x":11,"y":12},{"x":11,"y":19},{"x":11,"y":20},{"x":11,"y":21},{"x":12,"y":1},{"x":12,"y":2},{"x":12,"y":3},{"x":12,"y":4},{"x":12,"y":5},{"x":12,"y":6},{"x":12,"y":7},{"x":12,"y":8},{"x":12,"y":9},{"x":12,"y":10},{"x":12,"y":11},{"x":12,"y":12},{"x":12,"y":19},{"x":12,"y":20},{"x":12,"y":21},{"x":13,"y":6},{"x":13,"y":7},{"x":13,"y":8},{"x":13,"y":9},{"x":13,"y":19},{"x":13,"y":20},{"x":13,"y":21},{"x":14,"y":1},{"x":14,"y":2},{"x":14,"y":3},{"x":14,"y":4},{"x":14,"y":5},{"x":14,"y":6},{"x":14,"y":7},{"x":14,"y":8},{"x":14,"y":9},{"x":14,"y":10},{"x":14,"y":11},{"x":14,"y":12},{"x":14,"y":19},{"x":14,"y":20},{"x":14,"y":21},{"x":15,"y":1},{"x":15,"y":2},{"x":15,"y":3},{"x":15,"y":4},{"x":15,"y":5},{"x":15,"y":6},{"x":15,"y":7},{"x":15,"y":8},{"x":15,"y":9},{"x":15,"y":10},{"x":15,"y":11},{"x":15,"y":12},{"x":15,"y":19},{"x":15,"y":20},{"x":15,"y":21},{"x":16,"y":1},{"x":16,"y":2},{"x":16,"y":3},{"x":16,"y":4},{"x":16,"y":5},{"x":16,"y":6},{"x":16,"y":7},{"x":16,"y":8},{"x":16,"y":9},{"x":16,"y":10},{"x":16,"y":11},{"x":16,"y":12},{"x":16,"y":19},{"x":16,"y":20},{"x":16,"y":21},{"x":17,"y":1},{"x":17,"y":2},{"x":17,"y":3},{"x":17,"y":4},{"x":17,"y":5},{"x":17,"y":6},{"x":17,"y":7},{"x":17,"y":8},{"x":17,"y":9},{"x":17,"y":10},{"x":17,"y":16},{"x":17,"y":17},{"x":17,"y":18},{"x":17,"y":19},{"x":17,"y":20},{"x":17,"y":21},{"x":17,"y":22},{"x":18,"y":1},{"x":18,"y":2},{"x":18,"y":3},{"x":18,"y":4},{"x":18,"y":5},{"x":18,"y":6},{"x":18,"y":7},{"x":18,"y":8},{"x":18,"y":11},{"x":18,"y":12},{"x":18,"y":16},{"x":18,"y":19},{"x":18,"y":20},{"x":18,"y":21},{"x":18,"y":22},{"x":19,"y":1},{"x":19,"y":2},{"x":19,"y":3},{"x":19,"y":4},{"x":19,"y":5},{"x":19,"y":6},{"x":19,"y":9},{"x":19,"y":10},{"x":19,"y":11},{"x":19,"y":12},{"x":19,"y":16},{"x":19,"y":20},{"x":19,"y":22},{"x":20,"y":1},{"x":20,"y":2},{"x":20,"y":3},{"x":20,"y":4},{"x":20,"y":7},{"x":20,"y":8},{"x":20,"y":9},{"x":20,"y":10},{"x":20,"y":11},{"x":20,"y":12},{"x":20,"y":16},{"x":20,"y":20},{"x":20,"y":22},{"x":21,"y":1},{"x":21,"y":2},{"x":21,"y":3},{"x":21,"y":4},{"x":21,"y":5},{"x":21,"y":6},{"x":21,"y":7},{"x":21,"y":8},{"x":21,"y":9},{"x":21,"y":10},{"x":21,"y":11},{"x":21,"y":12},{"x":21,"y":15},{"x":21,"y":16},{"x":21,"y":17},{"x":21,"y":18},{"x":21,"y":19},{"x":21,"y":20},{"x":21,"y":22},{"x":22,"y":1},{"x":22,"y":2},{"x":22,"y":3},{"x":22,"y":4},{"x":22,"y":5},{"x":22,"y":6},{"x":22,"y":7},{"x":22,"y":8},{"x":22,"y":9},{"x":22,"y":10},{"x":22,"y":11},{"x":22,"y":12},{"x":22,"y":15},{"x":22,"y":16},{"x":22,"y":17},{"x":22,"y":18},{"x":22,"y":19},{"x":22,"y":20},{"x":22,"y":22},{"x":23,"y":1},{"x":23,"y":2},{"x":23,"y":3},{"x":23,"y":4},{"x":23,"y":5},{"x":23,"y":6},{"x":23,"y":7},{"x":23,"y":8},{"x":23,"y":9},{"x":23,"y":10},{"x":23,"y":11},{"x":23,"y":12},{"x":23,"y":15},{"x":23,"y":16},{"x":23,"y":17},{"x":23,"y":18},{"x":23,"y":19},{"x":23,"y":20},{"x":23,"y":22},{"x":24,"y":1},{"x":24,"y":3},{"x":24,"y":4},{"x":24,"y":5},{"x":24,"y":6},{"x":24,"y":7},{"x":24,"y":8},{"x":24,"y":9},{"x":24,"y":10},{"x":24,"y":11},{"x":24,"y":12},{"x":24,"y":13},{"x":24,"y":14},{"x":24,"y":15},{"x":24,"y":16},{"x":24,"y":17},{"x":24,"y":18},{"x":24,"y":19},{"x":24,"y":20},{"x":24,"y":22},{"x":25,"y":1},{"x":25,"y":3},{"x":25,"y":4},{"x":25,"y":5},{"x":25,"y":6},{"x":25,"y":7},{"x":25,"y":8},{"x":25,"y":9},{"x":25,"y":10},{"x":25,"y":11},{"x":25,"y":12},{"x":25,"y":15},{"x":25,"y":16},{"x":25,"y":17},{"x":25,"y":18},{"x":25,"y":19},{"x":25,"y":20},{"x":25,"y":21},{"x":25,"y":22},{"x":26,"y":2},{"x":26,"y":3},{"x":26,"y":4},{"x":26,"y":5},{"x":26,"y":6},{"x":26,"y":7},{"x":26,"y":8},{"x":26,"y":9},{"x":26,"y":10},{"x":26,"y":11},{"x":26,"y":12},{"x":26,"y":18},{"x":27,"y":2},{"x":27,"y":3},{"x":27,"y":4},{"x":27,"y":5},{"x":27,"y":6},{"x":27,"y":7},{"x":27,"y":8},{"x":27,"y":9},{"x":27,"y":10},{"x":27,"y":11},{"x":27,"y":12},{"x":27,"y":18},{"x":28,"y":5},{"x":28,"y":18},{"x":29,"y":5},{"x":29,"y":18},{"x":30,"y":5},{"x":30,"y":6},{"x":30,"y":7},{"x":30,"y":8},{"x":30,"y":9},{"x":30,"y":10},{"x":30,"y":11},{"x":30,"y":12},{"x":30,"y":13},{"x":30,"y":14},{"x":30,"y":15},{"x":30,"y":16},{"x":30,"y":17},{"x":30,"y":18}]}';
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
    snake.body = [Object.assign({m_queue: [], freeze: false}, data.startPos)];
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