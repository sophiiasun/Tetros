// TEMPLATE PLANNING:
// each block (for tetronimo) is 3vmin

const TEMPLATE = document.getElementById("template")

var data = []
var DROP_SPEED = 1

let lastRenderTime = 0

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: // left
            CURRENT_TETR.hTranslate(0); 
            break
        case 38: // up
            CURRENT_TETR.rotateClockwise(); 
            break
        case 39: // right
            CURRENT_TETR.hTranslate(1); 
            break 
        case 40: // down
    }
}

main()
function main () {
    createBoard()
    spawnTetr()
    SELECTED_BLOCK = document.getElementById("SELECTED-BLOCK")
    naturalDrop()
}

function naturalDrop(currentTime) {
    window.requestAnimationFrame(naturalDrop)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < 1/DROP_SPEED) return
    lastRenderTime = currentTime
    removeTetr()
    if(CURRENT_TETR.getBot() < 20) CURRENT_TETR.r++
    else{
        if(queue.length > 0) CURRENT_TETR = queue.shift()
        else blockGenerator() 
    }
    spawnTetr()
}

function updateDrop() {
    
}

window.requestAnimationFrame(naturalDrop)





