
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Configuration
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var gridWidth = 5
var gridHeight = 5
var colorSet = 5

var colorGrid = []
var ownershipGrid = []
var turn = 0;

var computerImaginationDepth = 2;

var colorBank = [
    "#ff389f",
    "#6b36ff",
    "#7bff5a",
    "#3d3d3d",
    "#f2ff3e",
    "#ab00cd",
    "#44c1ff",
    "#ffa113",
    "#f4f4f4",
    "#20ffb1",
    "#ff1c1c",
    "#ffa5e3",
]

var player1 = {
    name: "Vivi",
    isHuman: true,
    claimedTiles: 1,
    currentColor: 0
}

var player2 = {
    name: "George",
    isHuman: false,
    claimedTiles: 1,
    currentColor: 1
}

onload = function(){
    startGame();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Gameplay setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startGame(){
    populateStartingColors();

    createBasicLayout();
    drawGrid();
}

function populateStartingColors() {
    for(var y = 0; y < gridHeight; y++){
        var newColorRow = [];
        var newOwnershipRow = [];
        for(var x = 0; x < gridWidth; x++){
            var r = -1;
            do {
                r = Math.floor(Math.random() * colorSet);
            } while (
                !(
                    (y == 0 || r != colorGrid[y - 1][x]) && 
                    (x == 0 || r != newColorRow[x - 1])
                ) || (
                    (y == gridHeight - 1) && 
                    (x == 0) && 
                    (r == colorGrid[0][gridWidth - 1])
                )
            ); 

            newColorRow.push(r);
            newOwnershipRow.push(null);
        }
        colorGrid.push(newColorRow)
        ownershipGrid.push(newOwnershipRow)
    }
    
    ownershipGrid[gridHeight - 1][0] = 1;
    ownershipGrid[0][gridWidth - 1] = 2;

    player1.currentColor = colorGrid[gridHeight - 1][0];
    player2.currentColor = colorGrid[0][gridWidth - 1];
}

function createBasicLayout(){
    var basicLayoutHTML = `<div id="game-state-container">
        <div class="player current-player" id="player-1" style="outline-color: ${colorBank[player1.currentColor]}">
            <h2>${player1.name}</h2>
            <p id="player-1-score">${player1.claimedTiles}</p>
            <p style="font-weight: bold;" id="player-1-turn-indicator">Your turn!</p>
        </div>
        <div id="game-grid"></div>
        <div class="player" id="player-2" style="outline-color: ${colorBank[player2.currentColor]}"2>
            <h2>${player2.name}</h2>
            <p id="player-2-score">${player2.claimedTiles}</p>
            <p style="visibility: hidden; font-weight: bold;" id="player-2-turn-indicator">Your turn!</p>
        </div>
    </div>
    <div id="color-container">`;
    for(var c = 0; c < colorSet; c++){
        var isOccupied = (c == player1.currentColor || c== player2.currentColor);
        basicLayoutHTML += `<div class="color-button${isOccupied? " occupied": ""}" id="color-button-${c}" style="background-color: ${colorBank[c]}"></div>`;
    }
    basicLayoutHTML += `</div>`
    document.getElementById("main-content").innerHTML = basicLayoutHTML;

    for(let c = 0; c < colorSet; c++){
        document.getElementById(`color-button-${c}`).addEventListener("click", e => switchColor(c));
    }
}

function drawGrid(){
    var gridHtml = `<div id="game-grid">`;

    for(var y = 0; y < gridHeight; y++){
        gridHtml += `<div class="game-grid-row" id="game-grid-row-${y}">`;
        for(var x = 0; x < gridWidth; x++){
            gridHtml += `<div class="game-grid-tile" style="background-color:${colorBank[colorGrid[y][x]]}" id="game-grid-tile-${y}-${x}"></div>`;
        }
        gridHtml += `</div>`;
    }
    gridHtml += `</div>`;

    document.getElementById("game-grid").innerHTML = gridHtml;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Gameplay Functionality
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function switchColor(color){
    if(color == player1.currentColor || color == player2.currentColor){
        return;
    }

    turn += 1;
    
    var prevPlayer;
    if(turn%2){
        document.getElementById(`color-button-${player1.currentColor}`).classList.remove("occupied");
        player1.currentColor = color;
        document.getElementById(`color-button-${player1.currentColor}`).classList.add("occupied");
        
        document.getElementById("player-1").style.outlineColor = colorBank[player1.currentColor];
        document.getElementById("player-1").classList.remove("current-player");
        document.getElementById("player-1-turn-indicator").style.visibility = "hidden";

        document.getElementById("player-2-turn-indicator").style.visibility = "visible";
        document.getElementById("player-2").classList.add("current-player");

        prevPlayer = 1;
    } else {
        document.getElementById(`color-button-${player2.currentColor}`).classList.remove("occupied");
        player2.currentColor = color;
        document.getElementById(`color-button-${player2.currentColor}`).classList.add("occupied");
        
        document.getElementById("player-2").style.outlineColor = colorBank[player2.currentColor];
        document.getElementById("player-2").classList.remove("current-player");
        document.getElementById("player-2-turn-indicator").style.visibility = "hidden";

        document.getElementById("player-1-turn-indicator").style.visibility = "visible";
        document.getElementById("player-1").classList.add("current-player");
        prevPlayer = 2;
    }

    var captured = 0;
    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            if(
                ownershipGrid[y][x] == null && 
                colorGrid[y][x] == color && (
                    y > 0 && ownershipGrid[y-1][x] == prevPlayer ||
                    y < (gridHeight - 1) && ownershipGrid[y+1][x] == prevPlayer ||
                    x > 0 && ownershipGrid[y][x-1] == prevPlayer ||
                    x < (gridWidth - 1) && ownershipGrid[y][x+1] == prevPlayer
            )){
                ownershipGrid[y][x] = prevPlayer;
                captured += 1;
            }

            if(ownershipGrid[y][x] == prevPlayer){
                colorGrid[y][x] = color;
                document.getElementById(`game-grid-tile-${y}-${x}`).style.backgroundColor = colorBank[color];
            }
        }
    }
    
    if(turn%2){
        player1.claimedTiles += captured;
        document.getElementById("player-1-score").innerHTML = player1.claimedTiles;
    } else {
        player2.claimedTiles += captured;
        document.getElementById("player-2-score").innerHTML = player2.claimedTiles;
    }

    if(player1.claimedTiles + player2.claimedTiles == gridHeight * gridWidth){
        endGame();
    }

    if(turn%2 && !player2.isHuman){
        takeComputerTurn();
    }
}

function endGame(){
    document.getElementById("color-container").style.visibility = "hidden";
    document.getElementById("player-1-turn-indicator").style.visibility = "hidden";
    document.getElementById("player-2-turn-indicator").style.visibility = "hidden";
    document.getElementById("player-1").classList.remove("current-player");
    document.getElementById("player-2").classList.remove("current-player");

    var winnerHtml = `<div id="game-over">`
    if(player1.claimedTiles > player2.claimedTiles){
        winnerHtml += `<h2 style="text-shadow: 1px 0px 5px ${colorBank[player1.currentColor]}">${[player1.name]} wins!</h2>`
    } else if (player1.claimedTiles < player2.claimedTiles){
        winnerHtml += `<h2 style="text-shadow: 1px 0px 5px ${colorBank[player2.currentColor]}">${[player2.name]} wins!</h2>`
    } else {
        winnerHtml += `<h2>It's a draw!</h2>`
    }
    winnerHtml += "<div id='play-again-button'>Play Again</div></div>"

    document.getElementById("main-content").innerHTML += winnerHtml;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Computer Turn Logic
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function takeComputerTurn(){
    var cGrid = [];
    var oGrid = [];
    for(var y = 0; y < gridHeight; y++){
        var cRow = [];
        var oRow = [];
        for(var x = 0; x < gridWidth; x++){
            cRow.push(colorGrid[y][x] + 0);
            oRow.push(ownershipGrid[y][x] + 0);
        }
        cGrid.push(cRow);
        oGrid.push(oRow);
    }
    var turnResults = imagineNextTurn(turn, cGrid, oGrid);
    console.log(turnResults);

    for(var cid = 1; cid < computerImaginationDepth; cid++){
        // other player's turn
        var opponentTurnResults = []
        for(var i = 0; i < turnResults.length; i++){
            var cGrid = [];
            var oGrid = [];
            for(var y = 0; y < gridHeight; y++){
                var cRow = [];
                var oRow = [];
                for(var x = 0; x < gridWidth; x++){
                    cRow.push(turnResults[i].colors[y][x] + 0);
                    oRow.push(turnResults[i].ownership[y][x] + 0);
                }
                cGrid.push(cRow);
                oGrid.push(oRow);
            }

            var turnResult = imagineNextTurn(turnResults[i].turn, 
                cGrid, 
                oGrid,
                turnResults[i].startingPlay,
                turnResults[i].p1Score, 
                turnResults[i].p2Score,
                turnResults[i].playHistory
            )

            opponentTurnResults = [...opponentTurnResults, ...turnResult];
        }
        var sorted = opponentTurnResults.sort(function(a, b) {return a.p1Score - b.p1Score})
        opponentTurnResults = sorted.slice(0,10)

        // computer's turn
        turnResults = []
        for(var i = 0; i < opponentTurnResults.length; i++){
            var cGrid = [];
            var oGrid = [];
            for(var y = 0; y < gridHeight; y++){
                var cRow = [];
                var oRow = [];
                for(var x = 0; x < gridWidth; x++){
                    cRow.push(opponentTurnResults[i].colors[y][x] + 0);
                    oRow.push(opponentTurnResults[i].ownership[y][x] + 0);
                }
                cGrid.push(cRow);
                oGrid.push(oRow);
            }

            var turnResult = imagineNextTurn(opponentTurnResults[i].turn, 
                cGrid, 
                oGrid,
                opponentTurnResults[i].startingPlay,
                opponentTurnResults[i].p1Score, 
                opponentTurnResults[i].p2Score,
                opponentTurnResults[i].playHistory
            )

            turnResults = [...turnResults, ...turnResult];
        }
        sorted = turnResults.sort(function(a, b) {return a.p2Score - b.p2Score})
        turnResults = sorted.slice(0,10)
    }
    console.log(turnResults)
    console.log(turnResults[0].startingPlay)
    switchColor(turnResults[0].startingPlay)
}

function imagineNextTurn(thisTurn, cGridTurn, oGridTurn, startingPlay=null, p1Score=0, p2Score=0, playHistory = []){
    var turnResults = [];
    for(var c = 0; c < colorSet; c++){
        var cGrid = [];
        var oGrid = [];
        for(var y = 0; y < gridHeight; y++){
            var cRow = [];
            var oRow = [];
            for(var x = 0; x < gridWidth; x++){
                cRow.push(cGridTurn[y][x] + 0);
                oRow.push(oGridTurn[y][x] + 0);
            }
            cGrid.push(cRow);
            oGrid.push(oRow);
        }
            
        var p1Color = cGrid[gridHeight - 1][0];
        var p2Color = cGrid[0][gridWidth - 1];
        console.log(`Imaginary turn ${thisTurn}: p1 ${p1Color}, p2 ${p2Color}`);

        if (c != p1Color && c != p2Color){
            var playResult = imagineNextPlay(thisTurn%2 + 1, c, cGrid, oGrid);
            playResult.turn = thisTurn + 1;
            if(startingPlay == null){
                playResult.startingPlay = c;
            } else {
                playResult.startingPlay = startingPlay;
            }

            var history = JSON.parse(JSON.stringify(playHistory));
            playResult.playHistory = [...history, c]
            playResult.p1Score = p1Score;
            playResult.p2Score = p2Score;
            if(thisTurn%2 == 0){
                playResult.p1Score += playResult.captured;
            } else {
                playResult.p2Score += playResult.captured;
            }
            turnResults.push(playResult);
        }
    }
    return turnResults;
}

function imagineNextPlay(asPlayer, color, cGridPlay, oGridPlay){
    var cGrid = [];
    var oGrid = [];
    for(var y = 0; y < gridHeight; y++){
        var cRow = [];
        var oRow = [];
        for(var x = 0; x < gridWidth; x++){
            cRow.push(cGridPlay[y][x] + 0);
            oRow.push(oGridPlay[y][x] + 0);
        }
        cGrid.push(cRow);
        oGrid.push(oRow);
    }

    var p1Color = cGrid[gridHeight - 1][0];
    var p2Color = cGrid[0][gridWidth - 1];
    console.log(`   Imaginary play ${asPlayer} capturing ${color}: p1 ${p1Color}, p2 ${p2Color}`);

    var captured = 0;
    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            if(
                oGrid[y][x] == null && 
                cGrid[y][x] == color && (
                    y > 0 && oGrid[y-1][x] == asPlayer ||
                    y < (gridHeight - 1) && oGrid[y+1][x] == asPlayer ||
                    x > 0 && oGrid[y][x-1] == asPlayer ||
                    x < (gridWidth - 1) && oGrid[y][x+1] == asPlayer
            )){
                oGrid[y][x] = asPlayer;
                captured += 1;
            }

            if(oGrid[y][x] == asPlayer){
                cGrid[y][x] = color;
            }
        }
    }

    return {
        "ownership": JSON.parse(JSON.stringify(oGrid)), 
        "colors": JSON.parse(JSON.stringify(cGrid)), 
        "captured": captured
    }
}
