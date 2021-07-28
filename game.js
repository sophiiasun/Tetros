function createBoard() {
    createTitle()
    createScore()
    createLoadingBlock()
    createHoldBlock()
    createGameboard()
    createComingBlocks()
    createLevel()
}

var template = Array(6).fill(Array(4)) 

function createTitle() {
    const gridElement = document.createElement("div")
    gridElement.id = "TITLE"
    gridElement.classList.add("title")
    gridElement.style.gridRowStart = 1
    gridElement.style.gridColumnStart = 1
    gridElement.innerHTML = "TETROS"
    var r = 1, c = 1
    const grid = {gridElement, r, c}
    template[r][c] = grid
    TEMPLATE.appendChild(gridElement)
}

function createScore() {
    const gridElement = document.createElement("div")
    gridElement.id = "SCORE"
    gridElement.classList.add("score")
    gridElement.style.gridRowStart = 2
    gridElement.style.gridColumnStart = 2
    gridElement.innerHTML = "SCORE: 0"
    var r = 2, c = 2
    const grid = {gridElement, r, c}
    template[r][c] = grid
    TEMPLATE.appendChild(gridElement)
}

function createLoadingBlock() {
    const gridElement = document.createElement("div")
    gridElement.id = "LOADING-BLOCK"
    gridElement.classList.add("loading-block")
    gridElement.style.gridRowStart = 3
    gridElement.style.gridColumnStart = 2
    var r = 3, c = 2
    const grid = {gridElement, r, c}
    template[r][c] = grid
    TEMPLATE.appendChild(gridElement)
}

function createHoldBlock() {
    const gridElement = document.createElement("div")
    gridElement.id = "HOLD-BLOCK"
    gridElement.classList.add("hold-block")
    gridElement.style.gridRowStart = 4
    gridElement.style.gridColumnStart = 1
    var r = 4, c = 1
    const grid = {gridElement, r, c}
    template[r][c] = grid
    TEMPLATE.appendChild(gridElement)
}

function createGameboard() {
    const gridElement = document.createElement("div")
    gridElement.id = "GAMEBOARD"
    gridElement.classList.add("game-board")
    gridElement.style.gridRowStart = 4
    gridElement.style.gridColumnStart = 2
    var r = 4, c = 2
    const grid = {gridElement, r, c}
    template[r][c] = grid
    TEMPLATE.appendChild(gridElement)
}

function createComingBlocks() {
    const gridElement = document.createElement("div")
    gridElement.id = "COMING-BLOCKS"
    gridElement.classList.add("coming-blocks")
    gridElement.style.gridRowStart = 4
    gridElement.style.gridColumnStart = 3
    var r = 4, c = 3
    const grid = {gridElement, r, c}
    template[r][c] = grid
    TEMPLATE.appendChild(gridElement)
}

function createLevel() {
    const gridElement = document.createElement("div")
    gridElement.id = "LEVEL"
    gridElement.classList.add("level")
    gridElement.style.gridRowStart = 5
    gridElement.style.gridColumnStart = 2
    gridElement.innerHTML = "LEVEL: 1"
    var r = 5, c = 2
    const grid = {gridElement, r, c}
    template[r][c] = grid
    TEMPLATE.appendChild(gridElement)
}

function createOverlay() {
    let overlay = document.getElementById("overlay")
    overlay.style.backgroundColor = "black"
    overlay.style.borderColor = "white"
    // title
    const title = document.createElement("div")
    title.classList.add("overlay-title")
    title.id = "OVERLAY TITLE"
    title.style.gridRowStart = 1
    title.style.gridColumnStart = 1
    title.innerHTML = "GAME OVER!"
    overlay.appendChild(title)
    // body
    const body = document.createElement("div")
    body.classList.add("overlay-body")
    body.id = "OVERLAY BODY"
    body.style.gridRowStart = 2
    body.style.gridColumnStart = 1
    body.innerHTML = "<strong>YOUR SCORE:</strong> " + SCORE + "&emsp;&emsp;&emsp;<strong>YOUR LEVEL:</strong> " + LEVEL
    overlay.appendChild(body)
    // button
    const button = document.createElement("button")
    button.classList.add("overlay-button")
    button.id = "OVERLAY BUTTON"
    button.onclick = function() {restartGame()}
    button.innerHTML = "RESTART"
    overlay.appendChild(button)
}

function removeOverlay() {
    overlay.removeChild(document.getElementById("OVERLAY TITLE"))
    overlay.removeChild(document.getElementById("OVERLAY BODY"))
    overlay.removeChild(document.getElementById("OVERLAY BUTTON"))
    overlay.style.backgroundColor = "transparent"
    overlay.style.borderColor = "transparent"
}
