const WIDTH = 640;
const HEIGHT = 480;
const CELL_SIZE = 20;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// FETCH THIS FROM DATABASE LATER
let level = '{ "startPos": {"x": 15, "y": 8}, "foods": [{"x":19,"y":8},{"x":20,"y":8},{"x":21,"y":8},{"x":22,"y":8},{"x":23,"y":8},{"x":24,"y":8},{"x":25,"y":8},{"x":26,"y":8},{"x":27,"y":8}], "walls": [{"x":10,"y":9},{"x":10,"y":10},{"x":10,"y":11},{"x":11,"y":11},{"x":11,"y":12},{"x":12,"y":10},{"x":12,"y":11},{"x":12,"y":12},{"x":12,"y":13},{"x":13,"y":9},{"x":13,"y":13},{"x":14,"y":8},{"x":14,"y":12},{"x":14,"y":13},{"x":14,"y":14},{"x":15,"y":12},{"x":15,"y":15},{"x":16,"y":7},{"x":16,"y":12},{"x":16,"y":14},{"x":16,"y":16},{"x":17,"y":7},{"x":18,"y":6},{"x":18,"y":12},{"x":18,"y":14},{"x":18,"y":17},{"x":19,"y":13},{"x":19,"y":14},{"x":19,"y":18},{"x":20,"y":5},{"x":20,"y":14},{"x":20,"y":18},{"x":21,"y":5},{"x":21,"y":14},{"x":21,"y":15},{"x":21,"y":16},{"x":21,"y":19},{"x":22,"y":17},{"x":22,"y":18},{"x":23,"y":5},{"x":23,"y":14},{"x":24,"y":14},{"x":25,"y":4},{"x":25,"y":13},{"x":26,"y":4},{"x":26,"y":13},{"x":27,"y":4},{"x":27,"y":12},{"x":28,"y":4},{"x":28,"y":5},{"x":28,"y":10},{"x":28,"y":11},{"x":29,"y":5},{"x":29,"y":6},{"x":29,"y":8},{"x":29,"y":9}], "platform": [{"x":11,"y":8},{"x":12,"y":7},{"x":12,"y":8},{"x":13,"y":7},{"x":13,"y":8},{"x":14,"y":7},{"x":15,"y":7},{"x":15,"y":8},{"x":16,"y":8},{"x":17,"y":8},{"x":18,"y":8},{"x":19,"y":8},{"x":20,"y":8},{"x":21,"y":8},{"x":22,"y":8},{"x":23,"y":8},{"x":24,"y":8},{"x":25,"y":8},{"x":26,"y":8},{"x":27,"y":8}]}';
let snake = {};
let walls = [];
let platforms = [];
let lava = [];
let food = [];

document.addEventListener('DOMContentLoaded', () => {
    loadLevel(level);
    render();
});

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
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * CELL_SIZE, snake[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}

function loadLevel(levelData) {
    let data = JSON.parse(levelData);
    snake = [data.startPos];
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