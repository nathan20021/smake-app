// Main Variables
const create = document.getElementById('create');
const placeables = document.getElementsByClassName('placeable');
const tools = document.getElementsByClassName('tool');

const canvas = document.getElementById('editor');
const ctx = canvas.getContext('2d');
const WIDTH = 640;
const HEIGHT = 544;
const CELL_SIZE = 16;
let image_trapdoor = new Image();
image_trapdoor.src = 'static/Images/trapdoor.png'
let image_lever = new Image();
image_lever.src = 'static/Images/lever_open.png'
let image_pepper = new Image();
image_pepper.src = 'static/Images/pepper.png'

const CELLS = [];
let mode = "pointer";
let selectType = "platform";
let modePos = {
    x: 0,
    y: 0,
};

function renderLava(x, y) {
    ctx.fillStyle = (x + y) % 2 == 0 ? 'hsla(0, 95%, 50%, 1)' : 'hsla(0, 95%, 43%, 1)';
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function isItem(str) {
    if (str == 'spawn' || str == 'food' || str == 'lever' || str == 'pepper') {
        return true;
    }
    return false;
}

class tile {
    constructor(x, y, type, item) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.temp = '';
        this.item = item;
        this.itemTemp = '';
    }
    render() {
        let blockSwitchCond = this.temp ? this.temp : this.type;
        switch(blockSwitchCond) {
            case 'platform':
                ctx.fillStyle = 'lightgray';
                ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                break;
            case 'wall':
                ctx.fillStyle = 'slategray';
                ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                break;
            case 'lava':
                renderLava(this.x, this.y);
                break;
            case 'trapdoor':
                ctx.drawImage(image_trapdoor, this.x * CELL_SIZE, this.y * CELL_SIZE);
                break;
        }
        if (this.temp) {
            return;
        }
        let itemSwitchCond = this.itemTemp ? this.itemTemp : this.item;
        switch(itemSwitchCond) {
            case 'food':
                ctx.fillStyle = 'gold';
                ctx.beginPath();
                ctx.arc(this.x * CELL_SIZE + CELL_SIZE / 2, this.y * CELL_SIZE + CELL_SIZE / 2, Math.ceil(CELL_SIZE / 2) - 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = 'black';
                ctx.stroke();
                break;
            case 'spawn':
                ctx.fillStyle = 'lime';
                ctx.fillRect(this.x * CELL_SIZE + 3, this.y * CELL_SIZE + 3, 14, 14)
                break;
            case 'pepper':
                ctx.drawImage(image_pepper, this.x * CELL_SIZE, this.y * CELL_SIZE);
                break;
            case 'lever':
                ctx.drawImage(image_lever, this.x * CELL_SIZE, this.y * CELL_SIZE);
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < tools.length; i++) {
        tools[i].parentElement.addEventListener('click', () => changeMode(tools[i].id));
    }

    for (let i = 0; i < placeables.length; i++) {
        placeables[i].parentElement.addEventListener('click', () => changeType(placeables[i].id))
    }

    for (let x = 0; x < WIDTH / CELL_SIZE; x++) {
        for (let y = 0; y < HEIGHT / CELL_SIZE; y++) {
            CELLS.push(new tile(x, y, 'lava', ''));
        }   
    }
    render();
    canvas.addEventListener('mousedown', spawnAddingBlocks);
    document.addEventListener('mouseup', stopAddingBlocks);
    create.addEventListener('click', createJson);
});

function render() {
    for (let i = 0; i < CELLS.length; i++) {
        renderLava(CELLS[i].x, CELLS[i].y);
    }
    for (let i = 0; i < CELLS.length; i++) {
        CELLS[i].render();
    }
}

function getMousePos(e) {
    let c = canvas.getBoundingClientRect();
    return {
      x: e.clientX - c.left,
      y: e.clientY - c.top
    };
}

function clearSpawn() {
    for (let i = 0; i < CELLS.length; i++) {
        if (CELLS[i].item == 'spawn') {
            CELLS[i].item = '';
            CELLS[i].itemTemp = '';
        }
    }
}

function addBlock(e) {
    // Get x,y relative to canvas (top-left is 0,0)
    let pos = getMousePos(e);
    // Based on x,y pick the proper cell
    let cell_x = Math.floor(pos.x / CELL_SIZE);
    let cell_y = Math.floor(pos.y / CELL_SIZE);
    
    if (mode == 'pointer') {

        for (let i = 0; i < CELLS.length; i++) {
            if (CELLS[i].x === cell_x && CELLS[i].y === cell_y) {
                if (isItem(selectType)) {
                    if (CELLS[i].type == 'platform') {
                        if (selectType == 'spawn') {
                            clearSpawn();
                        }
                        CELLS[i] = new tile(CELLS[i].x, CELLS[i].y, CELLS[i].type, selectType);
                    }
                } else {
                    CELLS[i] = new tile(CELLS[i].x, CELLS[i].y, selectType, '');
                }
                render();
                break;
            }
        }
    
    } else {

        if (selectType != 'spawn') {
            let min_x, max_x, min_y, max_y;
            if (mode == 'rect') {
                min_x = Math.min(cell_x, modePos.x);
                max_x = Math.max(cell_x, modePos.x);
                min_y = Math.min(cell_y, modePos.y);
                max_y = Math.max(cell_y, modePos.y);
                if (min_x != max_x || min_y != max_y) {
                    for (let i = 0; i < CELLS.length; i++) {
                        if (CELLS[i].temp) {
                            CELLS[i].temp = '';
                        }
                        if (CELLS[i].itemTemp) {
                            CELLS[i].itemTemp = '';
                        }
                        if (CELLS[i].x >= min_x && CELLS[i].x <= max_x) {
                            if (CELLS[i].y >= min_y && CELLS[i].y <= max_y) {
                                if (isItem(selectType)) {
                                    if (CELLS[i].type == 'platform' && CELLS[i].item != selectType) {
                                        CELLS[i].itemTemp = selectType;
                                    }
                                } else {
                                    CELLS[i].temp = selectType;
                                }
                            }
                        }
                    }
                }
            } else if (mode == 'line') {
                if (cell_x != modePos.x || cell_y != modePos.y) {
                    linePts = lineDrawing.line({x: modePos.x, y: modePos.y}, {x: cell_x, y: cell_y});
                    for (let i = 0; i < CELLS.length; i++) {
                        if (CELLS[i].temp) {
                            CELLS[i].temp = '';
                        }
                        if (CELLS[i].itemTemp) {
                            CELLS[i].itemTemp = '';
                        }
                        for (let j = 0; j < linePts.length; j++) {
                            if (CELLS[i].x == linePts[j].x && CELLS[i].y == linePts[j].y) {
                                if (isItem(selectType)) {
                                    if (CELLS[i].type == 'platform' && CELLS[i].item != selectType) {
                                        CELLS[i].itemTemp = selectType;
                                    }
                                } else {
                                    CELLS[i].temp = selectType;
                                }
                            }
                        }
                    }
                }
            } else if (mode == 'circle') {
                for (let i = 0; i < CELLS.length; i++) {
                    if (CELLS[i].temp) {
                        CELLS[i].temp = '';
                    }
                    if (CELLS[i].itemTemp) {
                        CELLS[i].itemTemp = '';
                    }
                    let radius = Math.sqrt(Math.pow(Math.abs(cell_x - modePos.x), 2) + Math.pow(Math.abs(cell_y - modePos.y), 2));
                    if(Math.pow(CELLS[i].x - modePos.x, 2)+Math.pow(CELLS[i].y - modePos.y, 2) <= radius*radius) {
                        if (isItem(selectType)) {
                            if (CELLS[i].type == 'platform' && CELLS[i].item != selectType) {
                                CELLS[i].itemTemp = selectType;
                            }
                        } else {
                            CELLS[i].temp = selectType;
                        }
                    }
                }
            } else if (mode == 'fill') {
                let type;
                for (let i = 0; i < CELLS.length; i++) {
                    if (CELLS[i].x == modePos.x && CELLS[i].y == modePos.y) {
                        if (CELLS[i].item) {
                            type = CELLS[i].item;
                        } else {
                            type = CELLS[i].type;
                        }
                    }
                }
                if (type == selectType) {
                    return;
                }
                let checkedCells = [];
                let cellsToCheck = [{x: cell_x, y: cell_y}];
                let min_x = 0;
                let min_y = 0;
                let max_x = WIDTH / CELL_SIZE - 1;
                let max_y = HEIGHT / CELL_SIZE - 1;
                function getNeighbours(x, y) {
                    if (x - 1 >= min_x) {
                        cellsToCheck.push({x: x - 1, y: y});
                    }
                    if (x + 1 <= max_x) {
                        cellsToCheck.push({x: x + 1, y: y});
                    }
                    if (y - 1 >= min_y) {
                        cellsToCheck.push({x: x, y: y - 1});
                    }
                    if (y + 1 <= max_y) {
                        cellsToCheck.push({x: x, y: y + 1});
                    }
                }
                while (cellsToCheck.length > 0) {
                    let cur_x = cellsToCheck[0].x;
                    let cur_y = cellsToCheck[0].y;
                    let alreadyChecked = false;
                    for (let i = 0; i < checkedCells.length; i++) {
                        if (cur_x == checkedCells[i].x && cur_y == checkedCells[i].y) {
                            cellsToCheck.shift();
                            alreadyChecked = true;
                            break;
                        }
                    }
                    if (alreadyChecked) {
                        continue;
                    }
                    let curCell;
                    for (let i = 0; i < CELLS.length; i++) {
                        if (cur_x == CELLS[i].x && cur_y == CELLS[i].y) {
                            curCell = CELLS[i];
                            break;
                        }
                    }
                    checkedCells.unshift({x: cur_x, y: cur_y});
                    if (!isItem(type)) {
                        if (curCell.type == type) {
                            if (isItem(selectType)) {
                                if (curCell.type == 'platform') {
                                    curCell.item = selectType;
                                    curCell.itemTemp = '';
                                }
                            } else {
                                curCell.type = selectType;
                                curCell.temp = '';
                                if (selectType != 'platform') {
                                    curCell.item = '';
                                    curCell.itemTemp = '';
                                }
                            }
                            getNeighbours(cur_x, cur_y);
                        }
                    } else {
                        if (curCell.item == type) {
                            if (isItem(selectType)) {
                                if (curCell.type == 'platform') {
                                    curCell.item = selectType;
                                    curCell.itemTemp = '';
                                }
                            } else {
                                curCell.type = selectType;
                                curCell.temp = '';
                                curCell.item = '';
                                curCell.itemTemp = '';
                            }
                            getNeighbours(cur_x, cur_y);
                        }
                    }
                    cellsToCheck.shift();
                }

            }
        }
        render();
    }
}

function spawnAddingBlocks(e) {
    let pos = getMousePos(e);
    modePos.x = Math.floor(pos.x / CELL_SIZE);
    modePos.y = Math.floor(pos.y / CELL_SIZE);
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
        if (CELLS[i].temp) {
            CELLS[i].type = CELLS[i].temp;
            CELLS[i].temp = '';
            CELLS[i].item = '';
            CELLS[i].itemTemp = '';
        } else if (CELLS[i].itemTemp) {
            CELLS[i].item = CELLS[i].itemTemp;
            CELLS[i].itemTemp = '';
        }
    }
    render();
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
    lerp(spawn, end, t) {
        return spawn + t * (end-spawn);
    }
};

function changeMode(newMode) {
    if (selectType == "spawn") {
        return;
    }
    for (let i = 0; i < tools.length; i++) {
        tools[i].parentElement.classList.remove('selected');
    }
    for (let i = 0; i < tools.length; i++) {
        if (tools[i].id == newMode) {
            tools[i].parentElement.classList.add('selected');
        }
    }
    mode = newMode;
}

function changeType(newType) {
    for (let i = 0; i < tools.length; i++) {
        tools[i].parentElement.classList.remove('disable');
    }
    for (let i = 0; i < placeables.length; i++) {
        placeables[i].parentElement.classList.remove('selected');
    }
    for (let i = 0; i < placeables.length; i++) {
        if (placeables[i].id == newType) {
            placeables[i].parentElement.classList.add('selected');
            if (newType == 'spawn') {
                pointerOnly();
            }
        }
    }
    selectType = newType;
}

function pointerOnly() {
    mode = 'pointer';
    for (let i = 0; i < tools.length; i++) {
        if (tools[i].id == "pointer") {
            tools[i].parentElement.classList.add('selected');
        } else {
            tools[i].parentElement.classList.remove('selected');
            tools[i].parentElement.classList.add('disable');
        }
    }
}

function createJson() {
    let foods = CELLS.filter(item => item.item === "food").map(item => {return {x: item.x, y: item.y}});
    let peppers = CELLS.filter(item => item.item === "pepper").map(item => {return {x: item.x, y: item.y}});
    let levers = CELLS.filter(item => item.item === "lever").map(item => {return {x: item.x, y: item.y}});
    let trapdoors = CELLS.filter(item => item.type === "trapdoor").map(item => {return {x: item.x, y: item.y}});
    let spawnPos = CELLS.filter(item => item.item === "spawn")[0];
    let spawn = `{"x": ${spawnPos.x}, "y": ${spawnPos.y}}`;
    let walls = CELLS.filter(item => item.type === "wall").map(item => {return {x: item.x, y: item.y}});
    let platforms = CELLS.filter(item => item.type === "platform").map(item => {return {x: item.x, y: item.y}});
    let jsonString = `{ "spawnPos": ` + spawn + `, "foods": ${JSON.stringify(foods)}, "levers": ${JSON.stringify(levers)}, "trapdoors": ${JSON.stringify(trapdoors)}, "peppers": ${JSON.stringify(peppers)}, "walls": ${JSON.stringify(walls)}, "platform": ${JSON.stringify(platforms)}}`;

    fetch('/editor', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: jsonString
    }).then(function (response) { // At this point, Flask has printed our JSON
        return response.text();
    }).then(function (text) {
        window.location = "/level_preview";
    });
}