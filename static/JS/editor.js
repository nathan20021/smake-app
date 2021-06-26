// Main Variables
const pointer = document.getElementById('pointer');
const rect = document.getElementById('rect');
const line = document.getElementById('line');

const platform = document.getElementById('platform');
const eraser = document.getElementById('eraser');
const wall = document.getElementById('wall');
const food = document.getElementById('food');
const start = document.getElementById('start');
const create = document.getElementById('create');

const canvas = document.getElementById('editor');
const ctx = canvas.getContext('2d');
const WIDTH = 640;
const HEIGHT = 480;
const CELL_SIZE = 20;
const colors = {
    lava1: "hsla(0, 95%, 50%, 1)",
    lava2: "hsla(0, 95%, 43%, 1)",
};

const CELLS = [];
let mode = "pointer";
let selectType = "platform";
let rectMode = {
    x: 0,
    y: 0,
};
let lineMode = {
    end_x: 0,
    end_y: 0,
};

const tiles = {
    platform: {
        render(x, y) {
            ctx.fillStyle = 'lightgray';
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        },
    },
    wall: {
        render(x, y) {
            ctx.fillStyle = 'slategray';
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        },
    },
    food: {
        render(x, y) {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
        },
    },
    start: {
        render(x, y) {
            ctx.fillStyle = 'lime';
            ctx.fillRect(x * CELL_SIZE + 3, y * CELL_SIZE + 3, 14, 14)
        },
    },
    lava: {
        render(x, y) {
            // EVEN
            if ((x + y) % 2 == 0) {
                ctx.fillStyle = colors.lava1;
            }
            // ODD
            else {
                ctx.fillStyle = colors.lava2;
            }
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {

    pointer.parentElement.addEventListener('click', () => changeMode('pointer'));
    rect.parentElement.addEventListener('click', () => changeMode('rect'));
    line.parentElement.addEventListener('click', () => changeMode('line'));

    platform.parentElement.addEventListener('click', () => changeType('platform'));
    eraser.parentElement.addEventListener('click', () => changeType('lava'));
    wall.parentElement.addEventListener('click', () => changeType('wall'));
    food.parentElement.addEventListener('click', () => changeType('food'));
    start.parentElement.addEventListener('click', () => changeType('start'));

    // Editor lava background
    for (let x = 0; x < WIDTH / CELL_SIZE; x++) {
        for (let y = 0; y < HEIGHT / CELL_SIZE; y++) {
            CELLS.push({x, y, type:"lava", og_type: "", render: tiles.lava.render, food: "no", start: "no"})
        }   
    }
    render();

    // canvas.addEventListener('click', addBlock);
    canvas.addEventListener('mousedown', startAddingBlocks);
    document.addEventListener('mouseup', stopAddingBlocks);
    create.addEventListener('click', createJson);

});

function render() {
    for (let i = 0; i < CELLS.length; i++) {
        tiles.lava.render(CELLS[i].x, CELLS[i].y);
    }

    for (let i = 0; i < CELLS.length; i++) {
        CELLS[i].render(CELLS[i].x, CELLS[i].y);
        if (CELLS[i].food == "yes" || CELLS[i].food == "temp") {
            tiles.food.render(CELLS[i].x, CELLS[i].y);
        }
        if (CELLS[i].start == "yes") {
            tiles.start.render(CELLS[i].x, CELLS[i].y);
        }
    }
}

function getMousePos(e) {
    let c = canvas.getBoundingClientRect();
    return {
      x: e.clientX - c.left,
      y: e.clientY - c.top
    };
}

function addBlock(e) {
    // Get x,y relative to canvas (top-left is 0,0)
    let pos = getMousePos(e);
    // Based on x,y pick the proper cell
    let cell_x = Math.floor(pos.x / CELL_SIZE);
    let cell_y = Math.floor(pos.y / CELL_SIZE);
    
    // PLATFORM for now
    if (mode == "pointer") {
        
        for (let i = 0; i < CELLS.length; i++) {
            if (CELLS[i].x === cell_x && CELLS[i].y === cell_y) {
                if (selectType != "food" && selectType != "start") {
                    changeCellType(CELLS[i], selectType);
                    CELLS[i].food = "no";
                    CELLS[i].start = "no";
                } else if (selectType == "food") {
                    if (CELLS[i].type == "platform" && CELLS[i].start == "no") {
                        CELLS[i].food = "yes";
                    }
                } else if (selectType == "start") {
                    if (CELLS[i].type == "platform") {
                        if (CELLS[i].food == "yes") {
                            CELLS[i].food = "no";
                        }
                        for (let a = 0; a < CELLS.length; a++) {
                            CELLS[a].start = "no";
                        }
                        CELLS[i].start = "yes";
                    }
                }
                render();
                break;
            }
        }
    
    } else if (mode == "rect" || mode == 'line') {
        if (selectType != 'start') {
        let min_x, max_x, min_y, max_y, slope;
        if (mode == "rect") {
            min_x = Math.min(cell_x, rectMode.x);
            max_x = Math.max(cell_x, rectMode.x);
            min_y = Math.min(cell_y, rectMode.y);
            max_y = Math.max(cell_y, rectMode.y);
            if (min_x != max_x || min_y != max_y) {
                
                for (let i = 0; i < CELLS.length; i++) {
                    if (CELLS[i].food == "temp") {
                        CELLS[i].food = "no";
                    }
                    if (selectType != "food") {
                        if (CELLS[i].type == "temp") {
                            if (CELLS[i].food == "temp_block") {
                                CELLS[i].food = "yes";
                            }
                            if (CELLS[i].start == "temp") {
                                CELLS[i].start = "yes";
                            }
                            changeCellType(CELLS[i], CELLS[i].og_type);
                        }   
                    }
                    if (CELLS[i].x >= min_x && CELLS[i].x <= max_x) {
                        if (CELLS[i].y >= min_y && CELLS[i].y <= max_y) {
                            if (selectType != "food") {
                                if (CELLS[i].food == "yes") {
                                    CELLS[i].food = "temp_block";
                                }
                                if (CELLS[i].start == "yes") {
                                    CELLS[i].start = "temp";
                                }
                                changeCellType(CELLS[i], "temp");
                            } else {
                                if (CELLS[i].type == "platform" && CELLS[i].food == "no" && CELLS[i].start == "no") {
                                    CELLS[i].food = "temp";
                                }
                            }
                        }
                    }
                    
                }
                render();
            }
        } else if (mode == "line") {
            if (cell_x != lineMode.end_x || cell_y != lineMode.end_y) {

                lineMode.end_x = cell_x;
                lineMode.end_y = cell_y;

                linePts = lineDrawing.line({x: rectMode.x, y: rectMode.y}, {x: cell_x, y: cell_y});

                for (let i = 0; i < CELLS.length; i++) {
                    if (selectType != "food") {
                        if (CELLS[i].type == "temp") {
                            if (CELLS[i].food == "temp_block") {
                                CELLS[i].food = "yes";
                            }
                            if (CELLS[i].start == "temp") {
                                CELLS[i].start = "yes";
                            }
                            changeCellType(CELLS[i], CELLS[i].og_type);
                        }
                    } else {
                        if (CELLS[i].food == "temp") {
                            CELLS[i].food = "no";
                        }
                    }
                    
                    for (let j = 0; j < linePts.length; j++) {
                        if (CELLS[i].x == linePts[j].x && CELLS[i].y == linePts[j].y) {
                            if (selectType != "food") {
                                if (CELLS[i].food == "yes") {
                                    CELLS[i].food = "temp_block";
                                }
                                if (CELLS[i].start == "yes") {
                                    CELLS[i].start = "temp";
                                }
                                changeCellType(CELLS[i], "temp");
                            } else {
                                if (CELLS[i].type == "platform" && CELLS[i].food == "no" && CELLS[i].start == "no") {
                                    CELLS[i].food = "temp";
                                }
                            }
                        }
                    }      
                }
                render();
            }
            
        }
        
        // console.log(`X: ${min_x} -> ${max_x}\nY: ${min_y} -> ${max_y}`)
        // console.log(`${min_x} != ${rectMode.x} && ${max_x} != ${rectMode.x}`)
        }
    }
    
}

function startAddingBlocks(e) {
    let pos = getMousePos(e);
    rectMode.x = Math.floor(pos.x / CELL_SIZE);
    rectMode.y = Math.floor(pos.y / CELL_SIZE);
    lineMode.end_x = Math.floor(pos.x / CELL_SIZE);
    lineMode.end_y = Math.floor(pos.y / CELL_SIZE);
    console.log(rectMode.x, rectMode.y);
    if (mode == 'pointer') {
        canvas.addEventListener('mousemove', addBlock);
    } else {
        document.addEventListener('mousemove', addBlock);
    }
    is_mouseDown = true;
    addBlock(e);
}

function stopAddingBlocks(e) {
    canvas.removeEventListener('mousemove', addBlock);
    document.removeEventListener('mousemove', addBlock);
    is_mouseDown = false;
    for (let i = 0; i < CELLS.length; i++) {
        if (CELLS[i].food == 'temp') {
            CELLS[i].food = 'yes';
        }
        if (CELLS[i].food == 'temp_block') {
            CELLS[i].food = 'no';
        }
        if (CELLS[i].start == 'temp') {
            CELLS[i].start = 'no';
        }
        if (CELLS[i].type == 'temp') {
            changeCellType(CELLS[i], selectType);
        }
    }
    render();
}

function changeCellType(cell, type) {
    cell.og_type = cell.type;
    if (type == 'platform') {
        cell.type = 'platform';
        cell.render = tiles.platform.render;
    } else if (type == 'wall') {
        cell.type = 'wall';
        cell.render = tiles.wall.render;
    } else if (type == 'lava') {
        cell.type = 'lava';
        cell.render = tiles.lava.render;
    } else if (type == 'temp') {
        cell.type = 'temp';
        cell.render = tiles[selectType].render;
    }
}

lineDrawing = {

    // Grid Line Algorithm from https://www.redblobgames.com/grids/line-drawing.html
    line(p0, p1) {
        let points = [];
        let N = lineDrawing.diagonal_distance(p0, p1);
        for (let step = 0; step <= N; step++) {
            let t = N === 0? 0.0 : step / N;
            points.push(lineDrawing.round_point(lineDrawing.lerp_point(p0, p1, t)));
        }
        return points;
    },
    diagonal_distance(p0, p1) {
        let dx = p1.x - p0.x, dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    },
    round_point(p) {
        return {x: Math.round(p.x), y: Math.round(p.y)};
    },
    lerp_point(p0, p1, t) {
        return { x: lineDrawing.lerp(p0.x, p1.x, t),
                 y: lineDrawing.lerp(p0.y, p1.y, t) };
    },
    lerp(start, end, t) {
        return start + t * (end-start);
    }
};

function changeMode(newMode) {
    if (selectType == "start") {
        return;
    }
    pointer.parentElement.classList.remove('selected');
    rect.parentElement.classList.remove('selected');
    line.parentElement.classList.remove('selected');
    mode = newMode;
    if (mode == 'pointer') {
        pointer.parentElement.classList.add('selected');
    } else if (mode == 'rect') {
        rect.parentElement.classList.add('selected');
    } else if (mode == 'line') {
        line.parentElement.classList.add('selected');
    }
}

function changeType(newType) {

    // Event listeners done like this since start tool disables them
    rect.parentElement.classList.remove('disable');
    line.parentElement.classList.remove('disable');

    platform.parentElement.classList.remove('selected');
    eraser.parentElement.classList.remove('selected');
    wall.parentElement.classList.remove('selected');
    food.parentElement.classList.remove('selected');
    start.parentElement.classList.remove('selected');
    selectType = newType;
    if (selectType == 'platform') {
        platform.parentElement.classList.add('selected');
    } else if (selectType == 'lava') {
        eraser.parentElement.classList.add('selected');
    } else if (selectType == 'wall') {
        wall.parentElement.classList.add('selected');
    } else if (selectType == 'food') {
        food.parentElement.classList.add('selected');
    } else if (selectType == 'start') {
        pointer.parentElement.classList.add('selected');
        rect.parentElement.classList.remove('selected');
        line.parentElement.classList.remove('selected');
        start.parentElement.classList.add('selected');
        mode = 'pointer';
        rect.parentElement.classList.add('disable');
        line.parentElement.classList.add('disable');
    }
}

function createJson() {
    let foods = CELLS.filter(item => item.food === "yes").map(item => {return {x: item.x, y: item.y}});
    let startPos = CELLS.filter(item => item.start === "yes")[0];
    let start = `{x: ${startPos.x}, y: ${startPos.y}}`;
    let walls = CELLS.filter(item => item.type === "wall").map(item => {return {x: item.x, y: item.y}});
    let platforms = CELLS.filter(item => item.type === "platform").map(item => {return {x: item.x, y: item.y}});
    let jsonString = `{ startPos: ${JSON.stringify(start)}, foods: ${JSON.stringify(foods)}, walls: ${JSON.stringify(walls)}, platform: ${JSON.stringify(platforms)}}`;
    console.log(jsonString);
}