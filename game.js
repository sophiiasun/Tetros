function createBoard() {
    createTitle()
    createScore()
    createLoadingBlock()
    createHoldBlock()
    createGameboard()
    createComingBlocks()
    createLevel()
}

function createTitle() {
    const gridElement = document.createElement("div")
    gridElement.classList.add("title")
    gridElement.style.gridRowStart = 1
    gridElement.style.gridColumnStart = 1
    var r = 2, c = 2
    const grid = {gridElement, r, c}
    TEMPLATE.appendChild(gridElement)
}

function createScore() {
    const gridElement = document.createElement("div")
    gridElement.classList.add("score")
    gridElement.style.gridRowStart = 2
    gridElement.style.gridColumnStart = 2
    var r = 2, c = 2
    const grid = {gridElement, r, c}
    TEMPLATE.appendChild(gridElement)
}

function createLoadingBlock() {
    const gridElement = document.createElement("div")
    gridElement.classList.add("loading-block")
    gridElement.style.gridRowStart = 3
    gridElement.style.gridColumnStart = 2
    var r = 3, c = 2
    const grid = {gridElement, r, c}
    TEMPLATE.appendChild(gridElement)
}

function createHoldBlock() {
    const gridElement = document.createElement("div")
    gridElement.classList.add("hold-block")
    gridElement.style.gridRowStart = 4
    gridElement.style.gridColumnStart = 1
    var r = 4, c = 1
    const grid = {gridElement, r, c}
    TEMPLATE.appendChild(gridElement)
}

function createGameboard() {
    const gridElement = document.createElement("div")
    gridElement.classList.add("game-board")
    gridElement.style.gridRowStart = 4
    gridElement.style.gridColumnStart = 2
    var r = 4, c = 2
    const grid = {gridElement, r, c}
    TEMPLATE.appendChild(gridElement)
}

function createComingBlocks() {
    const gridElement = document.createElement("div")
    gridElement.classList.add("coming-blocks")
    gridElement.style.gridRowStart = 4
    gridElement.style.gridColumnStart = 3
    var r = 4, c = 3
    const grid = {gridElement, r, c}
    TEMPLATE.appendChild(gridElement)
}

function createLevel() {
    const gridElement = document.createElement("div")
    gridElement.classList.add("level")
    gridElement.style.gridRowStart = 5
    gridElement.style.gridColumnStart = 2
    var r = 5, c = 2
    const grid = {gridElement, r, c}
    TEMPLATE.appendChild(gridElement)
}