// TEMPLATE PLANNING:
// each block (for tetronimo) is 3vmin

const TEMPLATE = document.getElementById("template")

var data = []
var DROP_SPEED = 1

let lastRenderTime = 0

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: // left
        case 38: // up
        case 39: // right
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
    CURRENT_TETR.r++
    // alert(CURRENT_TETR.r + " " + CURRENT_TETR.c)
    spawnTetr()
}

function updateDrop() {
    
}

window.requestAnimationFrame(naturalDrop)





