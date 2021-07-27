// TEMPLATE PLANNING:
// each block (for tetronimo) is 3vmin
const TEMPLATE = document.getElementById("template")
let GAMEBOARD, COMINGBLOCKS, HOLDBLOCK, LOADINGBLOCKS
var data = []
var DROP_SPEED = 1, NATURAL_DROP_SPEED = 1
var HELDBLOCK = false 
var keyStates = [110]

keyStates = Array.from({ length: 110 }, () => false);

let lastRenderTime = 0
let dropTime = 0
let hasBlockMoved = true

let gameStart = true, isGameOver = false 

document.onkeydown = function(e) {
    if (isGameOver) return
    keyStates[e.which] = true
    switch(e.which) {
        case 32: // space
            hardDrop()
            break
        case 38: // up 
            CURRENT_TETR.wallKickRotateClockwise()
            break
        case 90: // z 
            CURRENT_TETR.wallKickRotateCounterClockwise() 
    }
    if (gameStart) { playMusicBGM(); gameStart = false }
}

function gameLoop() {
    if (keyStates[37]) CURRENT_TETR.hTranslate(0)
    if (keyStates[39]) CURRENT_TETR.hTranslate(1)
    if(keyStates[40]) DROP_SPEED = NATURAL_DROP_SPEED * 30
    else DROP_SPEED = NATURAL_DROP_SPEED 
    if(keyStates[67]) {
        if(HELDBLOCK == false) {
            HELDBLOCK = true 
            holdBlock()
        }  
    }
    setTimeout(gameLoop, 75);
}    
gameLoop();

document.onkeyup = function (e) {
    if (isGameOver) return
    keyStates[e.which] = false
}

main()
function main () {
    createBoard()
    GAMEBOARD = document.getElementById("GAMEBOARD")
    COMINGBLOCKS = document.getElementById("COMING-BLOCKS")
    HOLDBLOCK = document.getElementById("HOLD-BLOCK")
    LOADINGBLOCKS = document.getElementById("LOADING-BLOCK")
    blockGenerator(); blockGenerator(); blockGenerator()
    spawnTetr()
    displayComingBlocks()
    naturalDrop()
}

function getCurrentTime(currentTime) {
    dropTime = currentTime
}

function naturalDrop(currentTime) {
    if(isGameOver) return 
    window.requestAnimationFrame(naturalDrop)
    document.getElementById("SCORE").innerHTML = "SCORE: " + SCORE
    document.getElementById("LEVEL").innerHTML = "LEVEL: " + LEVEL
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1/DROP_SPEED) return
    lastRenderTime = currentTime

    if (comingBlocksQueue.length < 20) blockGenerator()
    if (CURRENT_TETR.checkOccupied(CURRENT_TETR.r+1, CURRENT_TETR.c, CURRENT_TETR.rot) == false) { 
        CURRENT_TETR.r++
        removeTetr()
        spawnTetr()
        hasBlockMoved = true
    } else { // is occupied
        if (hasBlockMoved == true) dropTime = currentTime
        if ((currentTime - dropTime)/1000 >= 1) {
            for(var i = 0; i < 4; i++){
                OCCUPIED [CURRENT_TETR.r + CURRENT_TETR.rArray[i]][CURRENT_TETR.c + CURRENT_TETR.cArray[i]] = true; 
            }
            dropBlockEffect()
            storeBlocks()
            clearLine() 
            SCORE += CURRENT_TETR.r*LEVEL
            CURRENT_TETR = comingBlocksQueue.shift()
            CURRENT_BLOCKS = []
            spawnTetr()
            HELDBLOCK = false 
        }
        
        displayComingBlocks()
        hasBlockMoved = false 
    }
}

function playMusicBGM() {
    const BGM = new Audio('tetris BGM.mp3')
    BGM.volume = 0.1
    BGM.play()
    BGM.loop = true
}

function endGame(){
    removeHoverBlock()
    document.getElementById("SCORE").innerHTML = "GAME OVER"
}

window.requestAnimationFrame(naturalDrop)




