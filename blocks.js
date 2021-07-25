// BLOCK COLOURS:
// RED:    #FF6663 (BLOCK Z)
// ORANGE: #FEB144 (BLOCK L)
// YELLOW: #FDFD97 (BLOCK O)
// GREEN:  #9EE09E (BLCOK S)
// BLUE:   #9EC1CF (BLOCK I)
// PURPLE: #CC99C9 (BLOCK J)

// wallkicks https://tetris.fandom.com/wiki/SRS
var wallKickx = [8], wallKicky = [8], gravity = 10, queue = []; 
//queue.shift pops the front 
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
    constructor(r, c, type, rot) {
        this.r = r, this.c = c
        this.type = type
        this.rot = rot
        this.cArray = [4]; this.rArray = [4]
        // array is processed in clockwise order 
        if (this.type == 0) { // i piece centred at 3rd bottom block
            this.cArray = [0, 0, 0, 0]; this.rArray = [2, 1, 0, -1]
        } else if (this.type == 1) { // j piece
            this.cArray = [-1, -1, 0, 1]; this.rArray = [1, 0, 0, 0]
        } else if (this.type == 2) { // l piece  
            this.cArray = [-1, 0, 1, 1]; this.rArray = [0, 0, 0, 1]
        } else if (this.type == 3) { // o piece (bottom right is centre) 
            this.cArray = [-1, -1, 0, 0]; this.rArray = [1, 0, 0, 1]
        } else if (this.type == 4) { // s piece 
            this.cArray = [-1, 0, 0, 1]; this.rArray = [0, 0, 1, 1]
        } else if (this.type == 5) { // t piece
            this.cArray = [-1, 0, 0, 1]; this.rArray = [0, 0, 1, 0]
        } else { // z piece 
            this.cArray = [-1, 0, 0, 1]; this.rArray = [1, 1, 0, 0]
        }
    }
    rotateClockwise() {
        for (var i = 0; i < 4; i++) {
            var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
            this.rArray[i] *= -1
        }
    }
    rotateCounterClockwise() {
        for (var i = 0; i < 4; i++) {
            var tmp = this.cArray[i]; this.cArray[i] = this.rArray[i]; this.rArray[i] = tmp
            this.cArray[i] *= -1
        }
    }
    flip() {
        for (var i = 0; i < 4; i++) {
            this.cArray[i] *= -1; this.rArray[i] *= -1
        }
    }
    
    hTranslate(direction) {
        // if direction is 0 move left and
        if(direction == 0) {
            if(this.x>0) this.x -=1;
        }
        else {
            if(this.x < 10) this.x += 1; 
        }
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
        arr[i] = new Tetromino(0, 0, i, 0); 
    }
    arr = shuffle(arr); 
    for(var i = 0; i < 7; i++){
        queue.push(arr[i]); 
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

CURRENT_TETR = new Tetromino(1, 5, 0, 0)
CURRENT_BLOCKS = []

function removeTetr() {
    CURRENT_BLOCKS.forEach(blockElement => {
        GAMEBOARD.removeChild(blockElement)
    })
    CURRENT_BLOCKS = []
}

function spawnTetr() {
    const GAMEBOARD = document.getElementById("GAMEBOARD")
    CURRENT_TETR.rArray.forEach(col => {
        CURRENT_TETR.cArray.forEach(row => {
            const blockElement = document.createElement("div")
            blockElement.classList.add("block-i")
            blockElement.style.gridRowStart = CURRENT_TETR.r + row
            blockElement.style.gridColumnStart = CURRENT_TETR.c + col
            GAMEBOARD.appendChild(blockElement)
            CURRENT_BLOCKS.push(blockElement)
        })
    })
}
