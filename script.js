// TEMPLATE PLANNING:
// each block (for tetronimo) is 3vmin
const TEMPLATE = document.getElementById("template")
let GAMEBOARD, COMINGBLOCKS, HOLDBLOCK 

var data = []
var DROP_SPEED = 1

let lastRenderTime = 0

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: // left
            CURRENT_TETR.hTranslate(0)
            break
        case 38: // up
            CURRENT_TETR.wallKickRotateClockwise()
            break
        case 39: // right
            CURRENT_TETR.hTranslate(1)
            break 
        case 40: // down
            break
        case 67: // letter c
            // alert("pressed c")
            holdBlock()
            break
    }
}

main()
function main () {
    createBoard()
    GAMEBOARD = document.getElementById("GAMEBOARD")
    COMINGBLOCKS = document.getElementById("COMING-BLOCKS")
    HOLDBLOCK = document.getElementById("HOLD-BLOCK")
    blockGenerator()
    spawnTetr()
    displayComingBlocks()
    naturalDrop()
    
}



function naturalDrop(currentTime) {
    window.requestAnimationFrame(naturalDrop)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 100
    if (secondsSinceLastRender < 1/DROP_SPEED) return
    lastRenderTime = currentTime
    
    if(CURRENT_TETR.checkOccupied(CURRENT_TETR.r+1, CURRENT_TETR.c, CURRENT_TETR.rot) == false) { 
        CURRENT_TETR.r++
        removeTetr(CURRENT_BLOCKS, GAMEBOARD)
    } else {
        for(var i = 0; i < 4; i++){
            OCCUPIED [CURRENT_TETR.r + CURRENT_TETR.rArray[i]][CURRENT_TETR.c + CURRENT_TETR.cArray[i]] = true; 
        }
        if (comingBlocksQueue.length < 7) blockGenerator()
        CURRENT_TETR = comingBlocksQueue.shift()
        CURRENT_BLOCKS = []
        displayComingBlocks()
    }
    // testDisplay()
    spawnTetr()
}

function permaDrop() {
    
}

function updateDrop() {
    
}

window.requestAnimationFrame(naturalDrop)





