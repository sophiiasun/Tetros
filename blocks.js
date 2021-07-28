// BLOCK COLOURS:
// RED:    #FF6663 (BLOCK Z)
// ORANGE: #FEB144 (BLOCK L)
// YELLOW: #FDFD97 (BLOCK O)
// GREEN:  #9EE09E (BLCOK S)
// AQUA:   #9EC1CF (BLOCK I)
// BLUE:   #3A587A (BLOCK J)
// PURPLE: #CC99C9 (BLOCK T)

const blockColoursMap = new Map()
blockColoursMap.set("block-z", "#FF6663")
blockColoursMap.set("block-l", "#FEB144")
blockColoursMap.set("block-o", "#FDFD97")
blockColoursMap.set("block-s", "#9EE09E")
blockColoursMap.set("block-i", "#9EC1CF")
blockColoursMap.set("block-j", "#3A587A")
blockColoursMap.set("block-t", "#CC99C9")

// wallkicks https://tetris.fandom.com/wiki/SRS
var wallKickr = [8], wallKickc = [8], comingBlocksQueue = []; 
//queue.shift pops the front 
var OCCUPIED = [25][15], SCORE = 0, LEVEL = 1, clearedLineCounter = 0; 

var btob = false;

var iWallKickc = [
    [0, -2, 1, -2, 1], [0, 2, -1, 2, -1],
    [0, -1, 2, -1, 2], [0, 1, -2, 1, -2], 
    [0, 2, -1, 2, -1], [0, -2, 1, -2, 1],
    [0, 1, -2, 1, -2], [0, -1, 2, -1, 2]
],
iWallKickr = [
    [0, 0, 0, 1, -2], [0, 0, 0, -1, 2], 
    [0, 0, 0, -2, 1], [0, 0, 0, 2, -1], 
    [0, 0, 0, -1, 2], [0, 0, 0, 1, -2], 
    [0, 0, 0, 2, -1], [0, 0, 0, -2, 1], 
]

OCCUPIED = Array.from({ length: 25 }, () => 
  Array.from({ length: 15 }, () => false)
);


initWallkicks()
// initializing the wallkicks
function initWallkicks() {
    for (var i = 0; i < 8; i++){
        wallKickc[i] = [0, 1, 1, 0, 1]; 
        if (i==0 || i==3 || i==5 || i==6) {
            for (var j = 0; j < 5; j++) wallKickc[i][j] *= -1; 
        } 
    }
    
    for (var i = 0; i < 8; i++) {
        wallKickr[i] = [0, 0, -1, 2, 2]; 
        if (i==1 || i==2 || i==5 || i==6) {
            for (var j = 0; j < 5; j++) wallKickr[i][j] *= -1; 
        } 
    }
}

class Tetromino {
    constructor(r, c, type) {
        this.r = r, this.c = c
        this.type = type
        this.rot = 0
        this.cArray = [4]; this.rArray = [4]
        this.name = ""
        this.translateVal = 0 
        // array is processed in clockwise order 
        if (this.type == 0) { // i piece centred at 3rd bottom block
            this.cArray = [2, 1, 0, -1]; this.rArray = [0, 0, 0, 0]; this.name = "block-i"
        } else if (this.type == 1) { // j piece
            this.cArray = [-1, -1, 0, 1]; this.rArray = [-1, 0, 0, 0]; this.name = "block-j"
        } else if (this.type == 2) { // l piece  
            this.cArray = [-1, 0, 1, 1]; this.rArray = [0, 0, 0, -1]; this.name = "block-l"
        } else if (this.type == 3) { // o piece (bottom right is centre) 
            this.cArray = [-1, -1, 0, 0]; this.rArray = [-1, 0, 0, -1]; this.name = "block-o"
        } else if (this.type == 4) { // s piece 
            this.cArray = [-1, 0, 0, 1]; this.rArray = [0, 0, -1, -1]; this.name = "block-s"
        } else if (this.type == 5) { // t piece
            this.cArray = [-1, 0, 0, 1]; this.rArray = [0, 0, -1, 0]; this.name = "block-t"
        } else { // z piece 
            this.cArray = [-1, 0, 0, 1]; this.rArray = [-1, -1, 0, 0]; this.name = "block-z"
        }
    }
    checkTspin(){
        if(this.type!=5) return false 
        var dRow = [0, 0, 1, -1], dCol = [1, -1, 0, 0]; 
        var curR = this.r, curC = this.c, curRot = this.rot
        for(var i = 0; i < 4; i++){
            if(!this.checkOccupied(curR + dRow[i], curC + dCol[i], curRot)) return false 
        }
        return true 
    }
    rotateClockwise(){
        for (var i = 0; i < 4; i++) {
            var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
            this.cArray[i] *= -1
        }
        this.rot = (this.rot+1)%4
    }
    wallKickRotateClockwise() {
        // checking the wallkicks and rotate
        // o blocks can't rotate 
        if (this.type == 3) return
        for(var kick = 0; kick < 5; kick++){
            var newR = this.r + wallKickr[2*this.rot][kick], newC = this.c + wallKickc[2*this.rot][kick]
            if(this.type == 0){
                newR = this.r + iWallKickr[2*this.rot][kick], newC = this.c + iWallKickc[2*this.rot][kick] 
            }
            if(this.checkOccupied(newR, newC, (this.rot+1)%4) == false) {
                for (var i = 0; i < 4; i++) {
                    var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
                    this.cArray[i] *= -1
                }
                this.rot = (this.rot+1)%4, this.r = newR, this.c = newC 
                this.respawnBlock() 
                return
            } 
        }
        
    }
    wallKickRotateCounterClockwise(){
        if(this.type != 3){
            for(var kick = 0; kick < 5; kick++){
                var newR = this.r + wallKickr[(2*this.rot+7)%8][kick], newC = this.c + wallKickc[(2*this.rot+7)%8][kick] 
                if(this.type == 0){
                    newR = this.r + iWallKickr[(2*this.rot+7)%8][kick], newC = this.c + iWallKickc[(2*this.rot+7)%8][kick]  
                }
                if(this.checkOccupied(newR, newC, (this.rot+3)%4) == false) {
                    for (var i = 0; i < 4; i++) {
                        var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
                        this.rArray[i] *= -1
                    }
                    this.rot = (this.rot+3)%4, this.r = newR, this.c = newC
                    removeTetr()
                    spawnTetr()
                    return 
                }
            }
        }
    }
    rotateCounterClockwise() {
        for (var i = 0; i < 4; i++) {
            var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
            this.rArray[i] *= -1
        }
        this.respawnBlock()
    }
    getTop() {
        var top = 100; 
        for(var i = 0; i < 4; i++){
            top = Math.min(top, this.rArray[i] + this.r); 
        }
        return top; 
    }
    getBot() {
        var top = 0; 
        for(var i = 0; i < 4; i++){
            top = Math.max(top, this.rArray[i] + this.r); 
        }
        return top; 
    }
    getLeft() {
        var lft = 10; 
        for(var i = 0; i < 4; i++){
            lft = Math.min(lft, this.cArray[i] + this.c); 
        }
        return lft; 
    }
    getRight() {
        var rt = 0; 
        for(var i = 0; i < 4; i++){
            rt = Math.max(rt, this.cArray[i] + this.c); 
        }
        return rt; 
    }
    hTranslate(direction) {
        // if direction is 0 move left and 1 is move right 
        if(direction == 0) {
            if(this.checkOccupied(this.r, this.c-1, this.rot) == false) { 
                this.c -= 1
                this.respawnBlock()
            }
        }
        else {
            if(this.checkOccupied(this.r, this.c+1, this.rot) == false) {
                this.c += 1
                this.respawnBlock()
            }
        }
    }
    checkOccupied(row, column, rot) {
        // check if current block translated to row, column is occupied
        var copy = new Tetromino(row, column, this.type, 0); 
        while(copy.rot != rot) copy.rotateClockwise(); 
        for(var i = 0; i < 4; i++) {
            var tmpRow = copy.rArray[i] + copy.r, tmpColumn = copy.cArray[i] + copy.c; 
            if(tmpRow > 20 || tmpColumn < 1 || tmpColumn > 10 || (tmpRow >= 0 && OCCUPIED[tmpRow][tmpColumn] == true) ) return true
        }
        return false
    }
    respawnBlock() {
        removeTetr()
        spawnTetr()
    }
}

// randomized shuffling : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex); 
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function blockGenerator(){
    var arr = [7]; 
    for(var i = 0; i < 7; i++){
        arr[i] = new Tetromino(-1, 5, i, 0); 
    }
    arr = shuffle(arr); 
    for(var i = 0; i < 7; i++){
        comingBlocksQueue.push(arr[i]); 
    }
    return arr; 
}


let CURRENT_BLOCKS = [], LOADING_BLOCKS = []

function removeTetr() {
    CURRENT_BLOCKS.forEach(blockElement => {
        GAMEBOARD.removeChild(blockElement)
    })
    LOADING_BLOCKS.forEach(blockElement => { 
        LOADINGBLOCKS.removeChild(blockElement)
    })
    CURRENT_BLOCKS = [], LOADING_BLOCKS = []
}

// i j l o s t z 
blockGenerator(); 
CURRENT_TETR = comingBlocksQueue.shift(); 

function spawnTetr() {
    displayHoverBlock()
    for(var i = 0; i < 4; i++){
        const blockElement = document.createElement("div")
        blockElement.classList.add(CURRENT_TETR.name)
        var gridRow = CURRENT_TETR.r + CURRENT_TETR.rArray[i]; 
        var gridColumn = CURRENT_TETR.c + CURRENT_TETR.cArray[i];
        blockElement.style.gridColumnStart = gridColumn
        if(gridRow <= 0) {
            blockElement.style.gridRowStart = 4 + gridRow
            LOADINGBLOCKS.appendChild(blockElement)
            LOADING_BLOCKS.push(blockElement)
        }
        else {
            blockElement.style.gridRowStart = gridRow
            GAMEBOARD.appendChild(blockElement)
            CURRENT_BLOCKS.push(blockElement)
        } 
    }
}

COMING_BLOCKS = []

function clearComingBlocks() {
    COMING_BLOCKS.forEach(blockElement => {
        COMINGBLOCKS.removeChild(blockElement)
    })
    COMING_BLOCKS = []
}
let HOLD_BLOCKS = []

function holdBlock() {
    if (HOLD_BLOCKS.length != 0) { // smth is already held (swap two tetr)
        swapTetr()
    } else { // nothing is currently held, hold current block
        holdTetr()
    }
}

function holdTetr() {
    HELD_TETR = CURRENT_TETR
    CURRENT_TETR = comingBlocksQueue.shift()
    removeTetr()
    displayHoldBlock()
    spawnTetr()
    displayComingBlocks()
}

function swapTetr() {
    tmp = CURRENT_TETR
    CURRENT_TETR = HELD_TETR
    HELD_TETR = tmp
    CURRENT_TETR.r = -1
    CURRENT_TETR.c = 5
    removeTetr()
    displayHoldBlock()
    spawnTetr()
}

function displayHoldBlock() {
    clearHoldBlock()
    for (var i = 0; i < 4; i++) {
        while(HELD_TETR.rot!=0) HELD_TETR.rotateClockwise()
        let blockElement = document.createElement("div")
        blockElement.classList.add(HELD_TETR.name)

        if(HELD_TETR.type == 0) blockElement.style.gridRowStart = 2 + HELD_TETR.rArray[i] 
        else blockElement.style.gridRowStart = 3 + HELD_TETR.rArray[i]

        if (HELD_TETR.type == 3) blockElement.style.gridColumnStart = 5 + HELD_TETR.cArray[i]
        else if (HELD_TETR.type == 0) blockElement.style.gridColumnStart = 3 + HELD_TETR.cArray[i]
        else blockElement.style.gridColumnStart = 4 + HELD_TETR.cArray[i]
        HOLDBLOCK.appendChild(blockElement)
        HOLD_BLOCKS.push(blockElement)
    }
}
function displayComingBlocks() {
    clearComingBlocks()
    for (var i = 1; i <= 5; i++) {
        var tetr = comingBlocksQueue[i-1]
        for (var j = 0; j < 4; j++) {
            let blockElement = document.createElement("div")
            blockElement.classList.add(tetr.name)
            blockElement.style.gridRowStart = i * 3 + tetr.rArray[j]
            if (tetr.type == 3) blockElement.style.gridColumnStart = 4 + tetr.cArray[j]
            else blockElement.style.gridColumnStart = 3 + tetr.cArray[j]
            COMINGBLOCKS.appendChild(blockElement)
            COMING_BLOCKS.push(blockElement)
        }
    }
}

function clearHoldBlock() {
    if (HOLD_BLOCKS.length == 0) return
    HOLD_BLOCKS.forEach(blockElement => {
        HOLDBLOCK.removeChild(blockElement)
    })
    HOLD_BLOCKS = []
}

function dropBlockEffect() {
    CURRENT_BLOCKS.forEach(block => {
        block.style.borderColor = "#7F7F7F"
    })
    LOADING_BLOCKS.forEach(block => {
        block.style.borderColor = "#7F7F7F"
    })
}

function hardDrop() {
    removeTetr()
    let highestRow = CURRENT_TETR.r
    for (var i = highestRow; i <= 20; i++) {
        if (!CURRENT_TETR.checkOccupied(i, CURRENT_TETR.c, CURRENT_TETR.rot)) highestRow = i
        else break
    }
    CURRENT_TETR.r = highestRow; 
    for(var i = 0; i < 4; i++){
        if(highestRow + CURRENT_TETR.rArray[i] > 0){
            OCCUPIED [highestRow + CURRENT_TETR.rArray[i]][CURRENT_TETR.c + CURRENT_TETR.cArray[i]] = true;
        } 
        else{
            isGameOver = true; spawnTetr()
            dropBlockEffect()
            endGame()
            return
        }
    }
    HELDBLOCK = false 
    CURRENT_TETR.r = highestRow
    SCORE += CURRENT_TETR.r*2*LEVEL 
    spawnTetr()
    dropBlockEffect()
    storeBlocks()
    clearLine()
    CURRENT_TETR = comingBlocksQueue.shift()
    CURRENT_BLOCKS = []
    spawnTetr()
    displayComingBlocks()
}

let BOARD_BLOCKS = []

function storeBlocks() {
    CURRENT_BLOCKS.forEach(block => {
        BOARD_BLOCKS.push(block)
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearLine() {
    let clearRows = []
    CURRENT_TETR.rArray.forEach(r => {
        if (!clearRows.includes(CURRENT_TETR.r + r) && checkRowClear(CURRENT_TETR.r + r)) 
            clearRows.push(CURRENT_TETR.r + r)
    })
    if (clearRows.length == 0) return
    if(CURRENT_TETR.checkTspin()){
        if(clearRows.length == 1) SCORE += 800*LEVEL
        else if(clearRows.length == 2) SCORE += 1200*LEVEL
        else SCORE += 1600*LEVEL
        if(btob){
            if(clearRows.length == 1) SCORE += 400*LEVEL
            else if(clearRows.length == 2) SCORE += 600*LEVEL
            else SCORE += 800*LEVEL
        }
    } else{
        if(clearRows.length == 1) SCORE += 100*LEVEL
        else if(clearRows.length == 2) SCORE += 300*LEVEL
        else if(clearRows.length == 3) SCORE += 500*LEVEL
        else SCORE += 800*LEVEL
        if(btob && clearRows.length == 4) SCORE += 400*LEVEL 
    }
    if(CURRENT_TETR.checkTspin() || clearRows.length == 4) btob = true
    else btob = false 
    clearedLineCounter += clearRows.length
    if(clearedLineCounter >= 10){
        clearedLineCounter -= 10, LEVEL += 1
        NATURAL_DROP_SPEED *= 1.44; DROP_SPEED *= 1.44;  
    }
    clearRows.sort(function(a, b) { return a - b })
    let tmp = []
    BOARD_BLOCKS.forEach(block => {
        clearRows.forEach(row => {
            if (row == block.style.gridRowStart) block.style.borderColor = "white"
        })
    })
    await sleep (200) 
    BOARD_BLOCKS.forEach(block => {
        var cnt = 0 // number of rows to shift up
        clearRows.forEach(row => {
            if (row == block.style.gridRowStart) {
                GAMEBOARD.removeChild(block)
                cnt = -10000;
            }
            else if (row > block.style.gridRowStart) cnt++ 
        })
        if (cnt >= 0) {
            tmp.push(block)
            block.style.gridRowStart = parseInt(block.style.gridRowStart) + parseInt(cnt)
        }
    })

    clearRows.forEach(row => {
        shiftOccupied(row)
    })
    BOARD_BLOCKS = []
    tmp.forEach(block => {
        BOARD_BLOCKS.push(block)
    })
}

function shiftOccupied(row) {
    for (var r = row; r > 1; r--) {
        OCCUPIED[r] = OCCUPIED[r-1].slice()
    }
}

function checkRowClear(row) {
    for (var i = 1; i <= 10; i++) {
        if (OCCUPIED[row][i] == false) return false
    }
    return true
}

let HOVER_BLOCKS = [], HOVER_LOADING_BLOCKS = []


function displayHoverBlock() {
    removeHoverBlock()
    let highestRow = CURRENT_TETR.r; 
    for (var i = highestRow; i <= 20; i++) {
        if (!CURRENT_TETR.checkOccupied(i, CURRENT_TETR.c, CURRENT_TETR.rot)) highestRow = i; 
        else break
    }
    // CURRENT_TETR.r = highestRow; 
    if(highestRow == CURRENT_TETR.r) return
    for (var i = 0; i < 4; i++) {
        const hoverBlock = document.createElement("div")
        hoverBlock.classList.add("hover-block")
        var gridRow = highestRow + CURRENT_TETR.rArray[i]; 
        var gridColumn = CURRENT_TETR.c + CURRENT_TETR.cArray[i];
        hoverBlock.style.borderColor = blockColoursMap.get(CURRENT_TETR.name)
        hoverBlock.style.gridColumnStart = gridColumn
        if(gridRow <= 0){
            hoverBlock.style.gridRowStart = gridRow + 4
            LOADINGBLOCKS.appendChild(hoverBlock)
            HOVER_LOADING_BLOCKS.push(hoverBlock) 
        }
        else{
            hoverBlock.style.gridRowStart = gridRow
            GAMEBOARD.appendChild(hoverBlock)
            HOVER_BLOCKS.push(hoverBlock)
        }
    }
}

function removeHoverBlock() {
    HOVER_BLOCKS.forEach(block => {
        GAMEBOARD.removeChild(block)
    })
    HOVER_LOADING_BLOCKS.forEach(block => {
        LOADINGBLOCKS.removeChild(block)
    })
    HOVER_BLOCKS = [], HOVER_LOADING_BLOCKS = []
}

function clearBoardBlocks() {
    BOARD_BLOCKS.forEach(block => {
        GAMEBOARD.removeChild(block)
    })
    BOARD_BLOCKS = []
}

function clearAllBlocks() {
    removeHoverBlock()
    removeTetr()
    clearHoldBlock()
    clearComingBlocks()
    clearBoardBlocks()
    for (var i = 0; i < 25; i++) {
        for (var j = 0; j < 15; j++) 
            OCCUPIED[i][j] = false
    }
}