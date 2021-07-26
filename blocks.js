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
var OCCUPIED = [25][15]; 

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
            if(tmpRow < 1 || tmpRow > 20 || tmpColumn < 1 || tmpColumn > 10 || OCCUPIED[tmpRow][tmpColumn] == true) return true
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
        arr[i] = new Tetromino(2, 5, i, 0); 
    }
    arr = shuffle(arr); 
    for(var i = 0; i < 7; i++){
        comingBlocksQueue.push(arr[i]); 
    }
    return arr; 
}

CURRENT_BLOCKS = []

function removeTetr() {
    if (CURRENT_BLOCKS.length == 0) return
    CURRENT_BLOCKS.forEach(blockElement => {
        GAMEBOARD.removeChild(blockElement)
    })
    CURRENT_BLOCKS = []
}

// i j l o s t z 
blockGenerator(); 
CURRENT_TETR = comingBlocksQueue.shift(); 

function spawnTetr() {
    for(var i = 0; i < 4; i++){
        const blockElement = document.createElement("div")
        blockElement.classList.add(CURRENT_TETR.name)
        blockElement.style.gridRowStart = CURRENT_TETR.r + CURRENT_TETR.rArray[i]; 
        blockElement.style.gridColumnStart = CURRENT_TETR.c + CURRENT_TETR.cArray[i]; 
        GAMEBOARD.appendChild(blockElement)
        CURRENT_BLOCKS.push(blockElement)
    }
    displayHoverBlock()
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
    CURRENT_TETR.r = 2
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

function testDisplay() {
    clearComingBlocks()
    var tetr = new Tetromino(0, 0, 0)
    for(var i = 0; i < 4; i++){
        const blockElement = document.createElement("div")
        blockElement.classList.add(CURRENT_TETR.name)
        blockElement.style.gridRowStart = 3 + CURRENT_TETR.rArray[i]; 
        blockElement.style.gridColumnStart = 3 + CURRENT_TETR.cArray[i]; 
        COMINGBLOCKS.appendChild(blockElement)
        COMING_BLOCKS.push(blockElement)
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
        // block.style.borderColor = blockColoursMap.get(CURRENT_TETR.name)
    })
}

function hardDrop() {
    removeTetr()
    for (var i = 20; i >= 2; i--) {
        if (!CURRENT_TETR.checkOccupied(i, CURRENT_TETR.c, CURRENT_TETR.rot)) {
            CURRENT_TETR.r = i; 
            for(var i = 0; i < 4; i++){
                OCCUPIED [CURRENT_TETR.r + CURRENT_TETR.rArray[i]][CURRENT_TETR.c + CURRENT_TETR.cArray[i]] = true; 
            }
            break
        }
    }
    HELDBLOCK = false 
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

function clearLine() {
    let clearRows = []
    CURRENT_TETR.rArray.forEach(r => {
        if (!clearRows.includes(CURRENT_TETR.r + r) && checkRowClear(CURRENT_TETR.r + r)) 
            clearRows.push(CURRENT_TETR.r + r)
    })
    if (clearRows.size == 0) return
    clearRows.sort(function(a, b) { return a - b })
    let tmp = []
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

let HOVER_BLOCKS = []

function displayHoverBlock() {
    removeHoverBlock()
    let highestRow 
    for (var i = 20; i >= 2; i--) {
        if (!CURRENT_TETR.checkOccupied(i, CURRENT_TETR.c, CURRENT_TETR.rot)) {
            highestRow = i; break
        }
    }
    for (var i = 0; i < 4; i++) {
        const hoverBlock = document.createElement("div")
        hoverBlock.classList.add("hover-block")
        hoverBlock.style.gridRowStart = highestRow + CURRENT_TETR.rArray[i]
        hoverBlock.style.gridColumnStart = CURRENT_TETR.c +  CURRENT_TETR.cArray[i]
        GAMEBOARD.appendChild(hoverBlock)
        HOVER_BLOCKS.push(hoverBlock)
    }
}

function removeHoverBlock() {
    if (HOVER_BLOCKS.length == 0) return
    HOVER_BLOCKS.forEach(block => {
        GAMEBOARD.removeChild(block)
    })
    HOVER_BLOCKS = []
}