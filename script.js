// TEMPLATE PLANNING:
// each block (for tetronimo) is 3vmin

TEMPLATE = document.getElementById("template")
// ON_HOLD = document.getElementById("hold-block")
// GAMEBOARD = document.getElementById("game-board")
// COMING_BLOCKS = document.getElementById("coming-blocks")

// board = [] // ENTIRE CSS GRID
gameboard = [] // PLAYABLE GRID (where the blocks can be placed)
data = []

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
}





