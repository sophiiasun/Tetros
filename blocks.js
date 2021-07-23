// i'm dating tmas <3

// wallkicks https://tetris.fandom.com/wiki/SRS
wallKickx = [8][4], wallKicky = [8][4]; 
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
        var tmp = this.xArray; this.xArray = this.yArray; this.yArray = this.xArray; 
        for(var i = 0; i < 4; ++i)
            this.yArray[i] *= -1; 
    }
    this.rotateCounterClockwise = function(){ // (x,y ) ==> (-y, x)
        var tmp = this.xArray; this.xArray = this.yArray; this.yArray = this.xArray; 
        for(var i = 0; i < 4; ++i)
            this.xArray[i] *= -1; 
    }
}