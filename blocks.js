// BLOCK COLOURS:
// RED:    #FF6663 (BLOCK Z)
// ORANGE: #FEB144 (BLOCK L)
// YELLOW: #FDFD97 (BLOCK O)
// GREEN:  #9EE09E (BLCOK S)
// BLUE:   #9EC1CF (BLOCK I)
// PURPLE: #CC99C9 (BLOCK J)

// wallkicks https://tetris.fandom.com/wiki/SRS
var wallKickx = [8], wallKicky = [8], gravity = 10, comingBlocksQueue = []; 
//queue.shift pops the front 
var OCCUPIED = [25][15]; 

OCCUPIED = Array.from({ length: 25 }, () => 
  Array.from({ length: 15 }, () => false)
);


initWallkicks()
// initializing the wallkicks
function initWallkicks() {
    for (var i = 0; i < 8; i++){
        wallKickx[i] = [0, 1, 1, 0, 1]; 
        if (i==0 || i==3 || i==5 || i==6) {
            for (var j = 0; j < 5; j++) wallKickx[i][j] *= -1; 
        } 
    }
    
    for (var i = 0; i < 8; i++) {
        wallKicky[i] = [0, 0, 1, -2, -2]; 
        if (i==1 || i==2 || i==5 || i==6) {
            for (var j = 0; j < 5; j++) wallKicky[i][j] *= -1; 
        } 
    }
}

class Tetromino {
    constructor(r, c, type) {
        this.r = r, this.c = c
        this.type = type
        this.cArray = [4]; this.rArray = [4]
        // array is processed in clockwise order 
        if (this.type == 0) { // i piece centred at 3rd bottom block
            this.cArray = [2, 1, 0, -1]; this.rArray = [0, 0, 0, 0]; this.name = "block-i"
        } else if (this.type == 1) { // j piece
            this.cArray = [-1, -1, 0, 1]; this.rArray = [1, 0, 0, 0]; this.name = "block-j"
        } else if (this.type == 2) { // l piece  
            this.cArray = [-1, 0, 1, 1]; this.rArray = [0, 0, 0, 1]; this.name = "block-l"
        } else if (this.type == 3) { // o piece (bottom right is centre) 
            this.cArray = [-1, -1, 0, 0]; this.rArray = [1, 0, 0, 1]; this.name = "block-o"
        } else if (this.type == 4) { // s piece 
            this.cArray = [-1, 0, 0, 1]; this.rArray = [0, 0, 1, 1]; this.name = "block-s"
        } else if (this.type == 5) { // t piece
            this.cArray = [-1, 0, 0, 1]; this.rArray = [0, 0, 1, 0]; this.name = "block-t"
        } else { // z piece 
            this.cArray = [-1, 0, 0, 1]; this.rArray = [1, 1, 0, 0]; this.name = "block-z"
        }
    }
    rotateClockwise() {
        for (var i = 0; i < 4; i++) {
            var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
            this.rArray[i] *= -1
        }
        removeTetr()
        spawnTetr()
    }
    rotateCounterClockwise() {
        for (var i = 0; i < 4; i++) {
            var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
            this.cArray[i] *= -1
        }
        removeTetr()
        spawnTetr()
    }
    flip() {
        for (var i = 0; i < 4; i++) {
            this.cArray[i] *= -1; this.rArray[i] *= -1
        }
        removeTetr()
        spawnTetr()
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
            if(this.getLeft() > 1) this.c -= 1; ; 
        }
        else {
            if(this.getRight() < 10) this.c += 1; 
        }
        removeTetr()
        spawnTetr()
    }
    checkOccupied(row, column) {
        // check if current block translated to row, column is occupied
        for(var i = 0; i < 4; i++) {
            var tmpRow = this.rArray[i] + row, tmpColumn = this.cArray[i] + column; 
            if(OCCUPIED[tmpRow][tmpColumn] == true || tmpRow < 1 || tmpRow > 20 || tmpColumn < 1 || tmpColumn > 10) return true;  
        }
        return false; 
    }

    checkRotate(){
        var tmpRowArray = [4], tmpColumnArray = [4]; 
        for(var i = 0; i < 4; i++) {
            tmpRowArray[i] = -1 * this.cArray[i]; tmpColumnArray[i] = this.rArray; 
            var tmpRow = tmpRowArray[i] + this.r, tmpColumn = tmpColumnArray[i] + this.c;  
            if(OCCUPIED[tmpRow][tmpColumn]) return false; 
        }
        return true; 
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
        arr[i] = new Tetromino(0, 5, i); 
    }
    arr = shuffle(arr); 
    for(var i = 0; i < 7; i++){
        comingBlocksQueue.push(arr[i]); 
    }
    return arr; 
}

function testSpawn() {
    const GAMEBOARD = document.getElementById("GAMEBOARD")
    const blockElement = document.createElement("div")
    blockElement.classList.add("block-i")
    blockElement.style.gridRowStart = 5
    blockElement.style.gridColumnStart = 5
    GAMEBOARD.appendChild(blockElement)
}

CURRENT_BLOCKS = []

function removeTetr() {
    CURRENT_BLOCKS.forEach(blockElement => {
        GAMEBOARD.removeChild(blockElement)
    })
    CURRENT_BLOCKS = []
}

// i j l o s t z 
blockGenerator(); 
CURRENT_TETR = comingBlocksQueue.shift(); 

function spawnTetr() {
    const GAMEBOARD = document.getElementById("GAMEBOARD")
    for(var i = 0; i < 4; i++){
        const blockElement = document.createElement("div")
        blockElement.classList.add(CURRENT_TETR.name)
        blockElement.style.gridRowStart = CURRENT_TETR.r + CURRENT_TETR.rArray[i]; 
        blockElement.style.gridColumnStart = CURRENT_TETR.c + CURRENT_TETR.cArray[i]; 
        GAMEBOARD.appendChild(blockElement)
        CURRENT_BLOCKS.push(blockElement)
    }
}

function getHoverBlock() {

}