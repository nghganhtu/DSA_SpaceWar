const playerClass = (playerName, playerRole) => {
    // Inherits objects from Network Class
    networkClass.call(this);

    // Inherits objects from Ship Class
    shipClass.call(this);

    // Initialize the hidden grid 10x10.
    // Goal: When we hover the mouse, there will be the animation to change the displayed color of each element (each grid)
    // First, create an array with length 10, then inside each element of the array, we create new array of length 10
    // to form a 10x10 array
    this.gridHidden = new Array(10);
    for (let i = 0; i < this.gridHidden.length; i++)
        this.gridHidden[i] = new Array(10);

    this.gridActual = new Array(10);
    for (let i = 0; i < this.gridActual.length; i++)
        this.gridActual[i] = new Array(10);

    this.currLife = [2, 3, 3, 4, 5];
    this.name = playerName;
    this.playerRole = playerRole;

    this.turn = 0;
    this.shipArranged = false;
    this.autoButtonPushed = false;
    this.confirmButtonPushed = false;

    // Initialize ships position
    this.ship = [
        // Spacecraft 1
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 2
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 3
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 4
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 5
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        }
    ];
};

// Inherit methods from PlayerClass to playerClass.
// playerClass.prototype = Object.create(PlayClass.prototype);
playerClass.prototype.drawGridActual = () => {
    var i = 1, j = 1, indent = 0;

    if (this.playerRole === 2)
        indent = 700;

    for (i = 0; i < this.shipType.length; i++) {
        for (j = 0; j < this.shipType[i].size; j++) {
            noFill();
            rect(indent + i * 85 + 40 + 20 * j, 40, 20, 25);
        }
        for (j = 0; j < this.currLife[i]; j++) {
            fill(this.shipType[i].color.r, this.shipType[i].color.g, this.shipType[i].color.b);
            rect(indent + i * 85 + 40 + 20 * j, 40, 20, 25);
        }
    }

    fill(64, 54, 255);
    for (i = 1; i <= 10; i++) {
        for (j = 1; j <= 10; j++) {

            fill(64, 54, 255);
            rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);

            // draws the ships on the map
            if (this.gridActual[i - 1][j - 1] > 0) {

                fill(this.shipType[this.gridActual[i - 1][j - 1] - 1].color.r, this.shipType[this.gridActual[i - 1][j - 1] - 1].color.g, this.shipType[this.gridActual[i - 1][j - 1] - 1].color.b);
                ellipse(indent + 65 + 30 * i, 65 + 30 * j, 25, 25);
            }

            if(this.gridActual[i - 1][j - 1] === ISLAND){   // In another files we can put it after finish
                fill(255, 212, 128);
                rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);
            }
        }
    }
};

playerClass.prototype.drawGridHidden = () => {
    let i = 1, j = 1, indent = 0;

    fill(255, 255, 255);
    textSize(30);

    if (this.playerRole === 2) {
        indent = 700;
        text("Player 2", 160 + indent, 400, 200, 50);
    }
    else {
        text("Player 1", 160 + indent, 400, 200, 50);
    }

    textSize(20);
    text("turn : " + this.turn, 90 + indent, 10, 100, 20);

    for (i = 0; i < this.shipType.length; i++) {
        for (j = 0; j < this.shipType[i].size; j++) {
            noFill();
            if(this.currLife[i] > 0 && j < this.shipType[i].size){
                fill(this.shipType[i].color.r, this.shipType[i].color.g, this.shipType[i].color.b);  
            }
            rect(indent + i * 85 + 40 + 20 * j, 40, 20, 25);
        }
    }


    fill(64, 54, 255);
    for (i = 1; i <= 10; i++) {
        for (j = 1; j <= 10; j++) {
            // block not yet hit
            //   if(this.gridHidden[i-1][j-1] === 0){
            fill(64, 54, 255);
            if(densityLens === false || this.playerRole !== 2){
                if(this.gridHidden[i - 1][j - 1] === ISLAND){
                    //sandy beach colour
                    fill(255, 212, 128);
                }
                rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);
            }

            // target hit inside the block
            if (this.gridHidden[i - 1][j - 1] > 0) {
                // red color
                fill(255, 56, 63);
                ellipse(indent + 65 + 30 * i, 65 + 30 * j, 20, 20);
            }

            // missed inside block
            else if (this.gridHidden[i - 1][j - 1] === -1) {
                // yellow color
                fill(255, 255, 0);
                ellipse(indent + 65 + 30 * i, 65 + 30 * j, 20, 20);
            }
        }
    }
    return 0;
};

playerClass.prototype.arrangeShip = () => {
    // solve random function ceiling
    var size;
    var a, b, i, num, shipOverlapped = false;

    for (size = 5; size > 0; size--) {
        // put condition for overlap check 
        shipOverlapped = false;
        num = size;

        if (size === 1 || size === 2) {
            num++;
        }
        if (floor(random(0, 2))) { // horizontal arrangement trigger       
            while (1) {
                a = floor(random(0, 10));
                b = floor(random(0, 11 - num));

                for (i = 0; i < num; i++) {
                    if (this.gridActual[a][b + i] !== 0) {
                        shipOverlapped = true;
                        // break and search for a non-overlapping spot again 
                        break;
                    }
                }

                if (!shipOverlapped) {
                    // updates ships begin coordinate which will be sent to database
                    this.ship[size - 1].begin.x = a;
                    this.ship[size - 1].begin.y = b;

                    for (i = 0; i < num; i++) {
                        this.gridActual[a][b + i] = size; //  horizontal arrangement by random
                    }

                    // updates ships end coordinate which will be sent to database
                    this.ship[size - 1].end = a;
                    this.ship[size - 1].end = b + i;
                    break; // breaks from while loop as ship is arranged successfully
                }
                shipOverlapped = false;
            }
        }
        else {
            while (1) {
                b = floor(random(0, 10));
                a = floor(random(0, 11 - num));

                for (i = 0; i < num; i++) {
                    if (this.gridActual[a + i][b] !== 0) {
                        shipOverlapped = true;
                        // break from for loop if ship overlaps
                        break;
                    }
                }

                if (!shipOverlapped) {
                    // updates ships begin coordinate which will be sent to database
                    this.ship[size - 1].begin.x = a;
                    this.ship[size - 1].begin.x = b;

                    for (i = 0; i < num; i++) {
                        this.gridActual[a + i][b] = size; //  vertical arrangement by random
                    }
                    // updates ships end coordinate which will be sent to database
                    this.ship[size - 1].end = a + i;
                    this.ship[size - 1].end = b;
                    break;
                }
                shipOverlapped = false;
            }
        }
    }
};

playerClass.prototype.initializeGrid = () => {
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            this.gridHidden[i][j] = randomMap[i][j];
            this.gridActual[i][j] = randomMap[i][j];
        }
    }

    this.turn = 0;
    this.shipArranged = false;
    this.autoButtonPushed = false;
    this.confirmButtonPushed = false;

    this.currLife = [2, 3, 3, 4, 5];
    this.ship = [
        // Spacecraft 1
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 2
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 3
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 4
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        },
        // Spacecraft 5
        {
            begin: { x: 0, y : 0 },
            end: { x: 0, y : 0 }
        }
    ];

    this.sendHtppRequest = true;
    this.startOnlineGame = false;
};

playerClass.prototype.checkShipLifeStatus = () => {
    if ((this.currLife[0] + this.currLife[1] + this.currLife[2] + this.currLife[3] + this.currLife[4]) === 0) {
        return true;
    }
    return false;
};

playerClass.prototype.play = (playerRole) => {
    var indent = 0, i = 1, j = 1;
    // if all opponents ships have sunk declare victory
    if (this.checkShipLifeStatus() === true) {
        return true;
    }

    if (this.turn < 100) {
        // check for win condition in each turn
        if (playerRole === 2) {
            indent = 700;
        }

        // ensure player is not able to hit the same grid again
        for (i = 1; i <= 10; i++) {
            for (j = 1; j <= 10; j++) {
                if (mouseX > indent + 50 + 30 * i && mouseX < indent + 50 + 30 * (i + 1) && mouseY > 50 + 30 * j && mouseY < 50 + 30 * (j + 1)) {
                    if (!mouseIsPressed) {
                        fill(140, 184, 250, 200);
                        rect(indent + 50 + 30 * i, 50 + 30 * j, 30, 30);
                    }
                    if (mouseIsPressed) {
                        if ((this.gridActual[i - 1][j - 1] === 0) && (this.gridHidden[i - 1][j - 1] === 0)) {
                            this.turn++;
                            // this deletes water block at location
                            this.gridHidden[i - 1][j - 1] = -1;
                            this.hitX = i - 1;
                            this.hitY = j - 1;

                            //send your hit coordinates info to the server
                            // send player2.hitX and player2.hitY
                                playerSwitching = true;
                                if (this.checkShipLifeStatus() === true) {
                                    return true;
                                }  

                            // returns when shot misses
                            return 0;
                        }

                        else if ((this.gridActual[i - 1][j - 1] > 0) && (this.gridHidden[i - 1][j - 1] === 0)) {

                            // subtract ships life which is hit 
                            // mark as hit on hidden grid
                            this.gridHidden[i - 1][j - 1] = 1;
                            this.currLife[this.gridActual[i - 1][j - 1] - 1]--;

                            this.hitX = i - 1;
                            this.hitY = j - 1;
                            //send your hit coordinates info to the server
                            // send player2.hitX and player2.hitY
                            if (playerIs === 2) {
                                playerOneTurn = true;
                            }
                            else {
                                playerOneTurn = false;
                            }
                            return 0;
                        }

                        //player1.gridHidden[i-1][j-1]=-1;
                        mouseIsPressed = false;
                    }
                }
            }
        }
        // if above if statement doesn't return than extra shot
    }
    return 0;
};

playerClass.prototype.deployShipsReceivedFromServer = () => {
    var i = 0, j = 0;

    for (i = 0; i < 5; i++) {
        // ship is arranged horizontally
        if (this.ship[i].beign.x === this.ship[i].end.x) {

            for (j = 0; j < this.shipType[i].size; j++) {

                this.gridActual[this.ship[i].begin.x][this.ship[i].begin.y + j] = 1;
            }
        }

        //ship is arranged vertically
        else {
            for (j = 0; j < this.shipType[i].size; j++) {

                this.gridActual[this.ship[i].begin.x + j][this.ship[i].begin.y] = 1;
            }
        }
    }
};