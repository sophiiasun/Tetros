// wallkicks https://tetris.fandom.com/wiki/SRS
var wallKickx = [8], wallKicky = [8]; 
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

function Block(x, y, type, rot){ // vs code suggests to change to class? lmk if that's what u want
    this.x = x; this.y = y; 
    this.type = type; 
    this.rot = rot; 
    this.xArray = [4]; this.yArray = [4]; 
    // array is processed in clockwise order 
    if(this.type == 0) {
        // i piece centred at 3rd bottom block
        this.xArray = [0, 0, 0, 0]; this.yArray = [2, 1, 0, -1]; 
    } else if(this.type == 1) { // j piece
        this.xArray = [-1, -1, 0, 1]; this.yArray = [1, 0, 0, 0]; 
    } else if (this.type == 2) { // l piece  
        this.xArray = [-1, 0, 1, 1]; this.yArray = [0, 0, 0, 1];
    } else if (this.type==3) { // o piece (bottom right is centre) 
        this.xArray = [-1, -1, 0, 0]; this.yArray = [1, 0, 0, 1]; 
    } else if (this.type==4) { // s piece 
        this.xArray = [-1, 0, 0, 1]; this.yArray = [0, 0, 1, 1]; 
    } else if (this.type==5) { // t piece
        this.xArray = [-1, 0, 0, 1]; this.yArray = [0, 0, 1, 0];  
    } else { // z piece 
        this.xArray = [-1, 0, 0, 1]; this.yArray = [1, 1, 0, 0];
    }   
    this.rotateClockwise = function(){ // (x, y) ==> (y, -x); 
        for(var i = 0; i < 4; i++){
            var tmp = this.xArray[i]; this.xArray[i] = this.yArray[i];  this.yArray[i] = tmp; 
            this.yArray[i] *= -1; 
        }
    }
    this.rotateCounterClockwise = function(){ // (x,y ) ==> (-y, x)
        for(var i = 0; i < 4; i++){
            var tmp = this.xArray[i]; this.xArray[i] = this.yArray[i]; this.yArray[i] = tmp; 
            this.xArray[i] *= -1; 
        }
    }
    this.flip = function(){ // (x,y ) ==> (-y, x)
        for(var i = 0; i < 4; i++){
            this.xArray[i] *= -1; this.yArray[i] *=-1;  
        }
    }
}

// randomized shuffling : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
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
        arr[i] = new Block(0, 0, i, 0); 
    }
    arr = shuffle(arr); 
    return arr; 
}
