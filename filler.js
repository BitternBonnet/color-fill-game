
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Configuration
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var gridWidth = 8;
var gridHeight = 7;
var colorSet = 6;

var maxGridWidth = 10;
var maxGridHeight = 10;
var maxColors = 8;

var gameStates = [];

var captureAllTiles = true;
var autoCapture = false;
var captureGoal = "";

var computerLookAhead = 1;
var maxCloseness = 0;
var currentComputerTurnOptions = [];

var overrideOn = false;

var colorBank = [
    "#de7c81",
    "#78a3df",
    "#9dda8e",
    "#dcdc7f",
    "#b9b0ab",
    "#856382",
    "#5c5748",
    "#d8b17e",
]

var player1 = {
    name: "Vivi",
    isHuman: true
}

var player2 = {
    name: "George",
    isHuman: false
}

onload = function(){
    displayConfigurationScreen();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Game configuration
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayConfigurationScreen(){
    var configurationHTML = `<div id="configuration-container">
        <h2>Game Board</h2>
        <div class="configuration-input" id="board-height">
            <div class="label">Board Height</div>
            <div class="number-selector" id="board-height-selector"></div>
        </div>
        <div class="configuration-input" id="board-width">
            <div class="label">Board Width</div>
            <div class="number-selector" id="board-width-selector"></div>
        </div>
        <div class="configuration-input" id="color-count">
            <div class="label">Color Options</div>
            <div class="number-selector" id="color-count-selector"></div>
        </div>
        <div class="configuration-input">
            <div class="label">End Condition</div>
            <div class="string-selector" id="end-condition-selector">
                <div class="string-selector-option" id="end-condition-selector-100">All tiles claimed</div>
                <div class="string-selector-option" id="end-condition-selector-50">First-past-the-post</div>
            </div>
        </div>
        <div class="configuration-input">
            <div class="label">Auto-capture "landlocked" tiles</div>
            <div class="string-selector" id="auto-capture-selector">
                <div class="string-selector-option" id="auto-capture-selector-true">Yes</div>
                <div class="string-selector-option" id="auto-capture-selector-false">No</div>
            </div>
        </div>
        <h2>Players</h2>
        <div id="player-configuration-container">
            <div class="player-configuration">
                <h3>Player 1</h3>
                <div class="configuration-input">
                    <div class="label">Name</div>
                    <div class="text-field" id="player-1-name-input" contenteditable="true">${player1.name}</div>
                </div>
            </div>
            <div class="player-configuration">
                <h3>Player 2</h3>
                <div class="configuration-input">
                    <div class="label">Name</div>
                    <div class="text-field" id="player-2-name-input" contenteditable="true">${player2.name}</div>
                </div>
                <div class="configuration-input">
                    <div class="label">Type</div>
                    <div class="string-selector" id="opponent-type-selector">
                        <div class="string-selector-option" id="opponent-type-selector-human">Human</div>
                        <div class="string-selector-option" id="opponent-type-selector-comp-easy">NPC 1</div>
                        <div class="string-selector-option" id="opponent-type-selector-comp-mid">NPC 3</div>
                        <div class="string-selector-option" id="opponent-type-selector-comp-hard">NPC 5</div>
                    </div>
                </div>
                <div class="selector-info">
                        <div style="display: none" class="selector-info-option" id="opponent-type-selector-human-info">
                            Local multiplayer game
                        </div>
                        <div style="display: none" class="selector-info-option" id="opponent-type-selector-comp-easy-info">
                            Single-player game against computer opponent that strategizes 1 turn ahead.
                        </div>
                        <div style="display: none" class="selector-info-option" id="opponent-type-selector-comp-mid-info">
                            Single-player game against computer opponent that strategizes 3 turns ahead.
                        </div>
                        <div style="display: none" class="selector-info-option" id="opponent-type-selector-comp-hard-info">
                            Single-player game against computer opponent that strategizes 5 turns ahead.
                        </div>
                    </div>
            </div>
        </div>
        <div>
            <p class='button' id='play-button'>Start Game</p>
        </div>
    </div>`;
    document.getElementById("main-content").innerHTML = configurationHTML;

    for(let s = 3; s <= maxGridHeight; s++){
        document.getElementById(`board-height-selector`).innerHTML += `<div class="number-selector-option" id="board-height-selector-${s}">${s}</div>`;
    }
    for(let s = 3; s <= maxGridHeight; s++){
        document.getElementById(`board-height-selector-${s}`).addEventListener("click", e => handleNumberSelectorInput("height", s));
    }

    for(let s = 3; s <= maxGridWidth; s++){
        document.getElementById(`board-width-selector`).innerHTML += `<div class="number-selector-option" id="board-width-selector-${s}">${s}</div>`;
    }
    for(let s = 3; s <= maxGridWidth; s++){
        document.getElementById(`board-width-selector-${s}`).addEventListener("click", e => handleNumberSelectorInput("width", s));
    }

    for(let s = 3; s <= maxColors; s++){
        document.getElementById(`color-count-selector`).innerHTML += `<div class="number-selector-option" id="color-count-selector-${s}">${s}</div>`;
    }
    for(let s = 3; s <= maxColors; s++){
        document.getElementById(`color-count-selector-${s}`).addEventListener("click", e => handleNumberSelectorInput("color", s));
    }
    
    document.getElementById(`end-condition-selector-100`).addEventListener("click", e => handleStringSelectorInput("end", "all"));
    document.getElementById(`end-condition-selector-50`).addEventListener("click", e => handleStringSelectorInput("end", "fptp"));

    document.getElementById(`auto-capture-selector-true`).addEventListener("click", e => handleStringSelectorInput("autocapture", true));
    document.getElementById(`auto-capture-selector-false`).addEventListener("click", e => handleStringSelectorInput("autocapture", false));

    document.getElementById(`opponent-type-selector-human`).addEventListener("click", e => handleStringSelectorInput("opponent", "human"));
    document.getElementById(`opponent-type-selector-comp-easy`).addEventListener("click", e => handleStringSelectorInput("opponent", "comp-easy"));
    document.getElementById(`opponent-type-selector-comp-mid`).addEventListener("click", e => handleStringSelectorInput("opponent", "comp-mid"));
    document.getElementById(`opponent-type-selector-comp-hard`).addEventListener("click", e => handleStringSelectorInput("opponent", "comp-hard"));
    
    document.getElementById(`board-height-selector-${gridHeight}`).classList.add("selected");
    document.getElementById(`board-width-selector-${gridWidth}`).classList.add("selected");
    document.getElementById(`color-count-selector-${colorSet}`).classList.add("selected");

    if(player2.isHuman) {
        document.getElementById(`opponent-type-selector-human`).classList.add("selected");
        document.getElementById(`opponent-type-selector-human-info`).style.display = "block";
    } else if(computerLookAhead == 1){
        document.getElementById(`opponent-type-selector-comp-easy`).classList.add("selected");
        document.getElementById(`opponent-type-selector-comp-easy-info`).style.display = "block";
    } else if(computerLookAhead == 3){
        document.getElementById(`opponent-type-selector-comp-mid`).classList.add("selected");
        document.getElementById(`opponent-type-selector-comp-mid-info`).style.display = "block";
    } else if(computerLookAhead == 5){
        document.getElementById(`opponent-type-selector-comp-hard`).classList.add("selected");
        document.getElementById(`opponent-type-selector-comp-hard-info`).style.display = "block";
    }

    if(captureAllTiles){
        document.getElementById(`end-condition-selector-100`).classList.add("selected");
    } else {
        document.getElementById(`end-condition-selector-50`).classList.add("selected");
    }

    if(autoCapture){
        document.getElementById(`auto-capture-selector-true`).classList.add("selected");
    } else {
        document.getElementById(`auto-capture-selector-false`).classList.add("selected");
    }

    document.getElementById('play-button').addEventListener("click", e => handleStartGame());
}

function handleStartGame(){
    player1.name = document.getElementById("player-1-name-input").innerText; 
    player2.name = document.getElementById("player-2-name-input").innerText; 

    captureGoal = "";
    if(!captureAllTiles){
        captureGoal = ` / ${Math.ceil(gridHeight * gridWidth / 2)}`;
    }
    
    startGame();
}

function handleStringSelectorInput(selector, option){
    if(selector === "opponent"){
        document.getElementById(`opponent-type-selector-human`).classList.remove("selected");
        document.getElementById(`opponent-type-selector-comp-easy`).classList.remove("selected");
        document.getElementById(`opponent-type-selector-comp-mid`).classList.remove("selected");
        document.getElementById(`opponent-type-selector-comp-hard`).classList.remove("selected");

        document.getElementById(`opponent-type-selector-human-info`).style.display = "none";
        document.getElementById(`opponent-type-selector-comp-easy-info`).style.display = "none";
        document.getElementById(`opponent-type-selector-comp-mid-info`).style.display = "none";
        document.getElementById(`opponent-type-selector-comp-hard-info`).style.display = "none";

        if(option === "human"){
            player2.isHuman = true;
            document.getElementById(`opponent-type-selector-human`).classList.add("selected");
            document.getElementById(`opponent-type-selector-human-info`).style.display = "block";
        } else if (option === "comp-easy"){
            player2.isHuman = false;
            computerLookAhead = 1
            document.getElementById(`opponent-type-selector-comp-easy`).classList.add("selected");
            document.getElementById(`opponent-type-selector-comp-easy-info`).style.display = "block";
        } else if (option === "comp-mid"){
            player2.isHuman = false;
            computerLookAhead = 3;
            document.getElementById(`opponent-type-selector-comp-mid`).classList.add("selected");
            document.getElementById(`opponent-type-selector-comp-mid-info`).style.display = "block";
        } else if (option === "comp-hard"){
            player2.isHuman = false;
            computerLookAhead = 5;
            document.getElementById(`opponent-type-selector-comp-hard`).classList.add("selected");
            document.getElementById(`opponent-type-selector-comp-hard-info`).style.display = "block";
        }
    } else if (selector == "end"){
        if(captureAllTiles){
            document.getElementById(`end-condition-selector-100`).classList.remove("selected");
        } else {
            document.getElementById(`end-condition-selector-50`).classList.remove("selected");
        }

        captureAllTiles = (option === "all");

        if(captureAllTiles){
            document.getElementById(`end-condition-selector-100`).classList.add("selected");
        } else {
            document.getElementById(`end-condition-selector-50`).classList.add("selected");
        }
    } else if (selector == "autocapture"){
        if(autoCapture){
            document.getElementById(`auto-capture-selector-true`).classList.remove("selected");
        } else {
            document.getElementById(`auto-capture-selector-false`).classList.remove("selected");
        }

        autoCapture = option;

        if(autoCapture){
            document.getElementById(`auto-capture-selector-true`).classList.add("selected");
        } else {
            document.getElementById(`auto-capture-selector-false`).classList.add("selected");
        }
    }
}

function handleNumberSelectorInput(selector, index){
    if(selector === "height"){
        document.getElementById(`board-height-selector-${gridHeight}`).classList.remove("selected");
        gridHeight = index;
        document.getElementById(`board-height-selector-${gridHeight}`).classList.add("selected");
    } else if(selector === "width"){
        document.getElementById(`board-width-selector-${gridWidth}`).classList.remove("selected");
        gridWidth = index;
        document.getElementById(`board-width-selector-${gridWidth}`).classList.add("selected");
    } else if(selector === "color"){
        document.getElementById(`color-count-selector-${colorSet}`).classList.remove("selected");
        colorSet = index;
        document.getElementById(`color-count-selector-${colorSet}`).classList.add("selected");
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Game setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startGame(){
    gameStates = [];
    populateStartingGrids();

    createBasicLayout();
    drawGrid();

    maxCloseness = getClosenessScores(0).player1;

    if(overrideOn){
        takeComputerTurn();
    }
}

function populateStartingGrids() {
    if(overrideOn){
        gridHeight = 4;
        gridWidth = 4;
        colorSet = 4;
    }

    var colorGrid = [];
    var ownershipGrid = [];
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

    var p1Start = {x: 0, y: gridHeight - 1};
    var p2Start = {x: gridWidth - 1, y: 0};
    
    ownershipGrid[p1Start.y][p1Start.x] = 1;
    ownershipGrid[p2Start.y][p2Start.x] = 2;

    var p1Links = [];
    var p2Links = [];
    for (var y = 0; y < gridHeight; y++) {
        for (var x = 0; x < gridWidth; x++) {
            if (y + 1 < gridHeight) {
                p1Links.push([
                    {
                        x: x,
                        y: y
                    },
                    {
                        x: x,
                        y: y + 1
                    }
                ]);
                p2Links.push([
                    {
                        x: x,
                        y: y
                    },
                    {
                        x: x,
                        y: y + 1
                    }
                ]);

            }
            if (x + 1 < gridWidth) {
                p1Links.push([
                    {
                        x: x,
                        y: y
                    },
                    {
                        x: x + 1,
                        y: y
                    }
                ]);


                p2Links.push([
                    {
                        x: x,
                        y: y
                    },
                    {
                        x: x + 1,
                        y: y
                    }
                ]);
            }
        }
    }

    if(!overrideOn){ // Default game state
        addNewGameState(colorGrid, ownershipGrid, 0, [], p1Links, p2Links, "Initialize game");
        captureNewLink(0, 1, p1Start.y, p1Start.x);
        captureNewLink(0, 2, p2Start.y, p2Start.x);

    } else if(overrideOn){ // overridden game state
        var overrideColorGrid = [
            [3, 2, 0, 0],
            [1, 3, 0, 3],
            [2, 2, 1, 2],
            [2, 0, 3, 0]
        ];

        var overrideOwnershipGrid = [
            [null, null, 2, 2],
            [null, null, 2, null],
            [1, 1, null, null],
            [1, null, null, null]
        ];

        addNewGameState(overrideColorGrid, overrideOwnershipGrid, 5, [], p1Links, p2Links, "Initialize game");
        gameStates[0].player1.currentColor = 2;
        gameStates[0].player2.currentColor = 0;

        captureNewLink(0, 1, p1Start.y - 1, p1Start.x);
        captureNewLink(0, 1, p1Start.y - 1, p1Start.x + 1);
        captureNewLink(0, 1, p1Start.y, p1Start.x);
        captureNewLink(0, 2, p2Start.y, p2Start.x);
        captureNewLink(0, 2, p2Start.y, p2Start.x - 1);
        captureNewLink(0, 2, p2Start.y + 1, p2Start.x - 1);
    }
    
    printGameState(0);
}

function createBasicLayout(){
    var basicLayoutHTML = `<div id="game-state-container">
        <div class="player" id="player-1" style="border-color: ${colorBank[gameStates[0].player1.currentColor]}">
            <h2>${player1.name}</h2>
            <p id="player-1-score">${gameStates[0].player1.claimedTiles}${captureGoal}</p>
            <p style="visibility: hidden; font-weight: bold;" id="player-1-turn-indicator">Your turn!</p>
        </div>
        <div id="game-grid"></div>
        <div class="player" id="player-2" style="border-color: ${colorBank[gameStates[0].player2.currentColor]}"2>
            <h2>${player2.name}</h2>
            <p id="player-2-score">${gameStates[0].player2.claimedTiles}${captureGoal}</p>
            <p style="visibility: hidden; font-weight: bold;" id="player-2-turn-indicator">Your turn!</p>
        </div>
    </div>
    <div id="color-container">`;
    for(var c = 0; c < colorSet; c++){
        var isOccupied = (c == gameStates[0].player1.currentColor || c == gameStates[0].player2.currentColor);
        basicLayoutHTML += `<div class="color-button${isOccupied? " occupied": ""}" id="color-button-${c}" style="background-color: ${colorBank[c]}"></div>`;
    }
    basicLayoutHTML += `</div>`
    document.getElementById("main-content").innerHTML = basicLayoutHTML;

    for(let c = 0; c < colorSet; c++){
        document.getElementById(`color-button-${c}`).addEventListener("click", e => switchColor(0, c));
    }

    var turn = gameStates[0].turn % 2 + 1;
    document.getElementById(`player-${turn}`).classList.add("current-player");
    document.getElementById(`player-${turn}-turn-indicator`).style.visibility = "visible";
}

function drawGrid(){
    var colorGrid = gameStates[0].colorGrid;
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

function switchColor(gameStateId, color){
    //console.log(`${gameStateId}: switching to ${color}`)

    if(color == gameStates[gameStateId].player1.currentColor || color == gameStates[gameStateId].player2.currentColor){
        return "bad";
    }

    gameStates[gameStateId].turn += 1;

    var updateUI = (gameStateId == 0);
    
    var prevPlayer;
    if(gameStates[gameStateId].turn%2){
        if(updateUI) document.getElementById(`color-button-${gameStates[gameStateId].player1.currentColor}`).classList.remove("occupied");
        
        gameStates[gameStateId].player1.currentColor = color;
        prevPlayer = 1;
        
        if(updateUI){
            document.getElementById(`color-button-${gameStates[gameStateId].player1.currentColor}`).classList.add("occupied");
            
            document.getElementById("player-1").style.outlineColor = colorBank[gameStates[gameStateId].player1.currentColor];
            document.getElementById("player-1").classList.remove("current-player");
            document.getElementById("player-1-turn-indicator").style.visibility = "hidden";

            document.getElementById("player-2-turn-indicator").style.visibility = "visible";
            document.getElementById("player-2").classList.add("current-player");
        }
    } else {
        if(updateUI) document.getElementById(`color-button-${gameStates[gameStateId].player2.currentColor}`).classList.remove("occupied");
        
        gameStates[gameStateId].player2.currentColor = color;
        prevPlayer = 2;

        if(updateUI){
            document.getElementById(`color-button-${gameStates[gameStateId].player2.currentColor}`).classList.add("occupied");
            
            document.getElementById("player-2").style.outlineColor = colorBank[gameStates[gameStateId].player2.currentColor];
            document.getElementById("player-2").classList.remove("current-player");
            document.getElementById("player-2-turn-indicator").style.visibility = "hidden";

            document.getElementById("player-1-turn-indicator").style.visibility = "visible";
            document.getElementById("player-1").classList.add("current-player");
        }
    }

    var captured = 0;
    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            if(
                gameStates[gameStateId].ownershipGrid[y][x] == null && 
                gameStates[gameStateId].colorGrid[y][x] == color && (
                    y > 0 && gameStates[gameStateId].ownershipGrid[y-1][x] == prevPlayer ||
                    y < (gridHeight - 1) && gameStates[gameStateId].ownershipGrid[y+1][x] == prevPlayer ||
                    x > 0 && gameStates[gameStateId].ownershipGrid[y][x-1] == prevPlayer ||
                    x < (gridWidth - 1) && gameStates[gameStateId].ownershipGrid[y][x+1] == prevPlayer
            )){
                gameStates[gameStateId].ownershipGrid[y][x] = prevPlayer;
                captureNewLink(gameStateId, prevPlayer, y, x);
                captured += 1;
            }
        }
    }

    // auto-capture landlocked tiles
    if(gameStateId != 0 || autoCapture){
        captured += claimLandlockedTiles(gameStateId, prevPlayer);
    }

    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            if(gameStates[gameStateId].ownershipGrid[y][x] == prevPlayer){
                gameStates[gameStateId].colorGrid[y][x] = color;
                if(updateUI) document.getElementById(`game-grid-tile-${y}-${x}`).style.backgroundColor = colorBank[color];
            }
        }
    }
    
    if(gameStates[gameStateId].turn%2){
        gameStates[gameStateId].player1.claimedTiles += captured;
        if(updateUI) document.getElementById("player-1-score").innerHTML = `${gameStates[gameStateId].player1.claimedTiles}${captureGoal}`;
    } else {
        gameStates[gameStateId].player2.claimedTiles += captured;
        if(updateUI) document.getElementById("player-2-score").innerHTML = `${gameStates[gameStateId].player2.claimedTiles}${captureGoal}`;
    }

    gameStates[gameStateId].history.push(`Player${prevPlayer} switched to color ${color}`);

    if(isGameOver(gameStateId)){
         if(gameStates[gameStateId].player1.claimedTiles > gameStates[gameStateId].player2.claimedTiles){
            gameStates[gameStateId].winner = 1;
        } else if (gameStates[gameStateId].player1.claimedTiles < gameStates[gameStateId].player2.claimedTiles){
            gameStates[gameStateId].winner = 2;
        } else {
            gameStates[gameStateId].winner = 0;
        }
        gameStates[gameStateId].history.push(`Player${gameStates[gameStateId].winner} wins`)
        
        if(updateUI) {
            endGame(gameStates[gameStateId].winner);
        }

        return "win";
    }

    if(updateUI & gameStates[gameStateId].turn%2 && !player2.isHuman){
        takeComputerTurn();
    }

    return "success";
}

function claimLandlockedTiles(gameStateId, player){
    var captured = 0;
    var closenesses = getClosenessGrids(gameStateId);
    //console.log(closenesses);

    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            if(player == 1){
                if(gameStates[gameStateId].ownershipGrid[y][x] == null && closenesses.player2[y][x] == null && closenesses.player1[y][x] != null){
                    gameStates[gameStateId].ownershipGrid[y][x] = player;
                    captureNewLink(gameStateId, player, y, x);
                    captured += 1;
                }
            } else if(player == 2){
                    if(gameStates[gameStateId].ownershipGrid[y][x] == null && closenesses.player1[y][x] == null && closenesses.player2[y][x] != null){
                        gameStates[gameStateId].ownershipGrid[y][x] = player;
                        captureNewLink(gameStateId, player, y, x);
                        captured += 1;
                }
            }
        }
    }

    return captured;
}

function isGameOver(gameStateId){
    var captured = gameStates[gameStateId].player1.claimedTiles + gameStates[gameStateId].player2.claimedTiles;
    var total = gridHeight * gridWidth;

    if(gameStateId == 0 && captureAllTiles){
        console.log(`${gameStateId}: Checking endgame for all-tile game: ${captured}/${total} captured`);
        return ( captured == total );
    } 

    // otherwise use first-past-the-post
    var thePost = gridHeight * gridWidth / 2;
    console.log(`${gameStateId}: Checking endgame for all-tile game: need greater than ${thePost} to win OR all captured to draw (${captured}/${total})`);
    return (gameStates[gameStateId].player1.claimedTiles >= thePost) || (gameStates[gameStateId].player2.claimedTiles >= thePost);
}

function endGame(winner){
    console.log(`game ends with winner ${winner}`);

    document.getElementById("color-container").style.visibility = "hidden";
    document.getElementById("player-1-turn-indicator").style.visibility = "hidden";
    document.getElementById("player-2-turn-indicator").style.visibility = "hidden";
    document.getElementById("player-1").classList.remove("current-player");
    document.getElementById("player-2").classList.remove("current-player");

    var winnerHtml = `<div id="game-over">`
    if(winner == 1){
        winnerHtml += `<h2 style="text-shadow: 1px 0px 5px ${colorBank[gameStates[0].player1.currentColor]}">${[player1.name]} wins!</h2>`
    } else if (winner == 2){
        winnerHtml += `<h2 style="text-shadow: 1px 0px 5px ${colorBank[gameStates[0].player2.currentColor]}">${[player2.name]} wins!</h2>`
    } else {
        winnerHtml += `<h2>It's a draw!</h2>`
    }
    winnerHtml += `<p class='button' id='play-again-button'>Play Again</p>
        <p class='button' id='change-settings-button'>Change Settings</p>
    </div>`;

    document.getElementById("main-content").innerHTML += winnerHtml;

    document.getElementById("play-again-button").addEventListener("click", e => startGame());
    document.getElementById("change-settings-button").addEventListener("click", e => displayConfigurationScreen());
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Closeness calculations
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function captureNewLink(gameStateId, capturedBy, capturedY, capturedX){
    // remove this link from opponent's links
    if(capturedBy == 1){
        gameStates[gameStateId].player2.links = gameStates[gameStateId].player2.links.filter(item => !(
            (item[0].x == capturedX && item[0].y == capturedY) || 
            (item[1].x == capturedX && item[1].y == capturedY)
        ));
    } else if (capturedBy == 2){
        gameStates[gameStateId].player1.links = gameStates[gameStateId].player1.links.filter(item => !(
            (item[0].x == capturedX && item[0].y == capturedY) || 
            (item[1].x == capturedX && item[1].y == capturedY)
        ));
    } 

    // collapse this link in current player's links
    var start;
    if(capturedBy == 1){ 
        start = {x: 0, y: gridHeight - 1}; // p1 Start
    } else if(capturedBy == 2){
        start = {x: gridWidth - 1, y: 0}; // p2 Start
    }

    if(start.y == capturedY && start.x == capturedX){
        return; // if this is the starting tile there are no links to collapse
    }

    if(capturedBy == 1){
        collapseLinksForPlayer1(gameStateId, capturedY, capturedX);
    } else if (capturedBy == 2){
        collapseLinksForPlayer2(gameStateId, capturedY, capturedX);
    }
}

function collapseLinksForPlayer1(gameStateId, y, x){
    for(var l = 0; l < gameStates[gameStateId].player1.links.length; l++){
        for(var p = 0; p < 2; p++){
            var currentPoint = gameStates[gameStateId].player1.links[l][p]
            if(currentPoint.y == y && currentPoint.x == x){
                gameStates[gameStateId].player1.links[l][p] = {x: 0, y: gridHeight - 1};
            }
        }
    }

    gameStates[gameStateId].player1.links = gameStates[gameStateId].player1.links.filter(item => !(item[0].x == item[1].x && item[0].y == item[1].y));
}

function collapseLinksForPlayer2(gameStateId, y, x){
    for(var l = 0; l < gameStates[gameStateId].player2.links.length; l++){
        for(var p = 0; p < 2; p++){
            var currentPoint = gameStates[gameStateId].player2.links[l][p]
            if(currentPoint.y == y && currentPoint.x == x){
                gameStates[gameStateId].player2.links[l][p] = {x: gridWidth - 1, y: 0};
            }
        }
    }

    gameStates[gameStateId].player2.links = gameStates[gameStateId].player2.links.filter(item => !(item[0].x == item[1].x && item[0].y == item[1].y));
}

function getClosenessScores(gameStateId){
    var scores = {
        player1: 0,
        player2: 0,
    }

    if(gameStateId != 0 && gameStates[gameStateId].player1.closenessScore){
        scores.player1 = gameStates[gameStateId].player1.closenessScore;
        scores.player2 = gameStates[gameStateId].player2.closenessScore;
        return scores;
    }

    getClosenessGrids(gameStateId);

    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            if(gameStates[gameStateId].player1.closenesses[y][x] != null){
                scores.player1 += gameStates[gameStateId].player1.closenesses[y][x] 
            }
            if(gameStates[gameStateId].player2.closenesses[y][x] != null){
                scores.player2 += gameStates[gameStateId].player2.closenesses[y][x] 
            }
        }
    }

    var maxCloseness = 0;

    gameStates[gameStateId].player1.closenessScore = scores.player1;
    gameStates[gameStateId].player2.closenessScore = scores.player2;

    return scores;
}

function getAdjustedClosenessScore(score){
    return (maxCloseness - score)/maxCloseness;
}

function doesPlayerTwoHaveOnlyLandlockedTiles(gameStateId){
    var result = {
        "onlyLandlockedRemain": true,
        "landlocked": []
    };

    var closenesses = getClosenessGrids(gameStateId);

    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            if(closenesses.player1[y][x] == null && gameStates[gameStateId].ownershipGrid[y][x] == null){
                console.log(`p2 has landlocked at ${y},${x}`)
                // check if the tile is landlocked by p1
                result.landlocked.push(gameStates[gameStateId].colorGrid[y][x])
            } else if(closenesses.player2[y][x] != null && gameStates[gameStateId].ownershipGrid[y][x] == null){
                // check if the tile is NOT  landlocked by p2. 
                console.log(`a non-landlocked tile exists at ${y},${x}`)
                result.onlyLandlockedRemain = false;
            }
        }
    }

    console.log(`${gameStateId}: Found ${result.landlocked.length} landlocked tiles`)
    return result;
}

function getClosenessGrids(gameStateId){
    // 0 is max closeness. 
    // null is a tile that is not linked to this player
    // 1 indicates one connection away, 2 is a walk of two away, etc

    // returns two grids of the set size, one for each player.
    var grids = {
        player1: [],
        player2: []
    };

    
    if(gameStateId != 0 && gameStates[gameStateId].player1.closenesses){
        grids.player1 = gameStates[gameStateId].player1.closenesses;
        grids.player2 = gameStates[gameStateId].player2.closenesses;
        return grids;
    }
 
    // populate grid with null tiles/set already-owned tiles to closeness 0.
    for(var y = 0; y < gridHeight; y++){
        var p1Row = [];
        var p2Row = [];

        for(var x = 0; x < gridWidth; x++){
            var owner = gameStates[gameStateId].ownershipGrid[y][x];
            if(owner == 1){
                p1Row.push(0);
                p2Row.push(null);
            } else if (owner == 2){
                p1Row.push(null);
                p2Row.push(0);
            } else {
                p1Row.push(null);
                p2Row.push(null);
            }
        }

        grids.player1.push(p1Row);
        grids.player2.push(p2Row);
    }

    var nodeQueue = [{x: 0, y: gridHeight - 1, c: 0}]; // start the queue with p1's starting tile
    var p1Links = gameStates[gameStateId].player1.links;
    while(nodeQueue.length > 0){
        var curNode = nodeQueue.pop();
        var closeness = curNode.c + 1;

        for(var l = 0; l < p1Links.length; l++){
            for(var n = 0; n < 2; n++){
                if(p1Links[l][n].x == curNode.x && p1Links[l][n].y == curNode.y){
                    var oppositeNode = p1Links[l][(n + 1) % 2];
                    if(grids.player1[oppositeNode.y][oppositeNode.x] == null || grids.player1[oppositeNode.y][oppositeNode.x] > closeness){
                        grids.player1[oppositeNode.y][oppositeNode.x] = closeness;
                        nodeQueue.push({x: oppositeNode.x, y: oppositeNode.y, c: closeness})
                    }
                }
            }
        }
    }

    gameStates[gameStateId].player1.closenesses = grids.player1;

    nodeQueue = [{x: gridWidth - 1, y: 0, c: 0}]; // start the queue with p2's starting tile
    var p2Links = gameStates[gameStateId].player2.links;
    while(nodeQueue.length > 0){
        var curNode = nodeQueue.pop();
        var closeness = curNode.c + 1;

        for(var l = 0; l < p2Links.length; l++){
            for(var n = 0; n < 2; n++){
                if(p2Links[l][n].x == curNode.x && p2Links[l][n].y == curNode.y){
                    var oppositeNode = p2Links[l][(n + 1) % 2];
                    if(grids.player2[oppositeNode.y][oppositeNode.x] == null || grids.player2[oppositeNode.y][oppositeNode.x] > closeness){
                        grids.player2[oppositeNode.y][oppositeNode.x] = closeness;
                        nodeQueue.push({x: oppositeNode.x, y: oppositeNode.y, c: closeness})
                    }
                }
            }
        }
    }

    gameStates[gameStateId].player2.closenesses = grids.player2;
        
    return grids;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Game state utilities
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addNewGameState(colorGrid, ownershipGrid, turn, history, p1Links, p2Links, message){
    var newHistory = [...history, message];
    
    var player1Color = colorGrid[gridHeight - 1][0];
    var player2Color = colorGrid[0][gridWidth - 1];
    
    var newGameState = {
        colorGrid: [],
        ownershipGrid: [],
        turn: turn,
        player1: {
            currentColor: player1Color,
            claimedTiles: 0,
            links: []
        },
        player2: {
            currentColor: player2Color,
            claimedTiles: 0,
            links: []
        },
        history: newHistory,
    };

    for(var y = 0; y < gridHeight; y++){
        var newColorRow = [];
        var newOwnershipRow = [];
        for(var x = 0; x < gridWidth; x++){
            newColorRow.push(colorGrid[y][x]);
            newOwnershipRow.push(ownershipGrid[y][x]);
            if(ownershipGrid[y][x] == 1){
                newGameState.player1.claimedTiles++;
            } else if (ownershipGrid[y][x] == 2){
                newGameState.player2.claimedTiles++;
            }
        }
        newGameState.colorGrid.push(newColorRow);
        newGameState.ownershipGrid.push(newOwnershipRow);
    }

    for(var l = 0; l < p1Links.length; l++){
        newGameState.player1.links.push([
            {
                x: p1Links[l][0].x,
                y: p1Links[l][0].y
            },
            {
                x: p1Links[l][1].x,
                y: p1Links[l][1].y
            }
        ]);
    }

    for(var l = 0; l < p2Links.length; l++){
        newGameState.player2.links.push([
            {
                x: p2Links[l][0].x,
                y: p2Links[l][0].y
            },
            {
                x: p2Links[l][1].x,
                y: p2Links[l][1].y
            }
        ]);
    }

    gameStates.push(newGameState);
    return gameStates.length - 1;
}

function copyGameState(originalId){
    addNewGameState(
        gameStates[originalId].colorGrid,
        gameStates[originalId].ownershipGrid,
        gameStates[originalId].turn,
        gameStates[originalId].history,
        gameStates[originalId].player1.links,
        gameStates[originalId].player2.links,
        `Game state copied from ${originalId}`
    );

    return gameStates.length - 1;
}

function countRemainingColors(gameStateId){
    var colorCounts = [];
    for(var c = 0; c < colorSet; c++ ){
        colorCounts.push(0);
    }

    for(var y = 0; y < gridHeight; y++){
        for(var x = 0; x < gridWidth; x++){
            var color = gameStates[gameStateId].colorGrid[y][x];
            colorCounts[color]++;
        }
    }

    return colorCounts;
}

function printGameState(gameStateId){
    return; // comment out this line to turn full gamestate logs back on

    var printString = `GAME STATE ${gameStateId}`;

    for(var y = 0; y < gridHeight; y++){
        printString += "\n";
        for(var x = 0; x < gridWidth; x++){
            if(gameStates[gameStateId].ownershipGrid[y][x] == 1){
                printString += " ░"; 
            } else if(gameStates[gameStateId].ownershipGrid[y][x] == 2){
                printString += " ▓"; 
            } else {
                printString += ` ${gameStates[gameStateId].colorGrid[y][x]}`; 
            }
        }

        printString += "\t"
        for(var x = 0; x < gridWidth; x++){
            printString += ` ${gameStates[gameStateId].colorGrid[y][x]}`; 
        }

        printString += "\t"
        for(var x = 0; x < gridWidth; x++){
            if(gameStates[gameStateId].ownershipGrid[y][x] == 1){
                printString += " ○"; 
            } else if(gameStates[gameStateId].ownershipGrid[y][x] == 2){
                printString += " ●"; 
            } else {
                printString += ` ▒`; 
            }
        }
    } 
    
    printString += `\n\tPlayer1: On color ${gameStates[gameStateId].player1.currentColor} `;
    printString += `with score ${gameStates[gameStateId].player1.claimedTiles}.`;
    
    printString += `\n\tPlayer2: On color ${gameStates[gameStateId].player2.currentColor} `;
    printString += `with score ${gameStates[gameStateId].player2.claimedTiles}.`;

    printString += `\n\tIt is Player${gameStates[gameStateId].turn % 2 + 1}'s turn.`;

    console.info(printString);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Computer Turn Logic
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function takeComputerTurn(){
    printGameState(0);
    var scores = getClosenessScores(0);

    var landlockedOnly = doesPlayerTwoHaveOnlyLandlockedTiles(0);
    console.log(`Checking switch to landlocked. Autocapture: ${autoCapture}; Only Landlocked Remain: ${landlockedOnly.onlyLandlockedRemain}; P2 Landlocked: ${landlockedOnly.landlocked.length}`);
    if(!autoCapture && landlockedOnly.onlyLandlockedRemain && landlockedOnly.landlocked.length > 0){
        switchColor(0, landlockedOnly.landlocked[0]);
        printGameState(0);
        return;
    }

    currentComputerTurnOptions = [];
    console.log('has look ahead', computerLookAhead);
    var result = lookAhead(0, 1, computerLookAhead);

    console.log(result);
    currentComputerTurnOptions.sort((a,b) => {
        var aScore = getAdjustedClosenessScore(a.p2Closeness);
        var bScore = getAdjustedClosenessScore(b.p2Closeness);
        return bScore + b.p2Claimed - aScore - a.p2Claimed;
    });
    console.log(currentComputerTurnOptions);
    var chosenMove = currentComputerTurnOptions[0];

    switchColor(0, chosenMove.startingColor);
    printGameState(0);
}

function lookAhead(gameStateId, depth, maxDepth, startingColor=null, recursion=true){
    var options = [];
    var backupOptions = [];

    for(var color = 0; color < colorSet; color++){
        var newGameStateId = copyGameState(gameStateId);
        var result = switchColor(newGameStateId, color);
        var closenesses = getClosenessScores(newGameStateId);

        if(result != "bad"){
            printGameState(newGameStateId);
            //console.log(`${newGameStateId}: was copied from ${gameStateId}`);
        }

        var sc = startingColor;
        if(startingColor == null){
            sc = color;
        }

        var newOption = {
                "gameStateId": newGameStateId,
                "color": color, 
                "p1Claimed": gameStates[newGameStateId].player1.claimedTiles,
                "p2Claimed": gameStates[newGameStateId].player2.claimedTiles,
                "p1Closeness": closenesses.player1,
                "p2Closeness": closenesses.player2,
                "startingColor": sc
            }

        var currentPlayer = (gameStates[gameStateId].turn) % 2 + 1;
        
        if(result != "bad"){
            //console.log(`${newGameStateId}: child of ${gameStateId} at depth ${depth}; player${currentPlayer} switching to ${color} yields ${result} ~ ${newOption.p1Claimed}/${newOption.p1Closeness} to ${newOption.p2Claimed}/${newOption.p2Closeness}`);
        } else {
            //console.log(`${newGameStateId}: child of ${gameStateId} at depth ${depth}; player${currentPlayer} switching to ${color} yields ${result}`);
        }

        if(result != "bad"){
            // legal move 

            if (!recursion || depth >= maxDepth) {
                // stop iterating if depth reached or no recurision
                //console.log(`${newGameStateId}: reached depth ${depth}/${maxDepth}. Using recursion? ${recursion}. Adding option without children`);
                options.push(newOption);

                if(depth >= maxDepth){
                    currentComputerTurnOptions.push(newOption);
                }
            } else if(currentPlayer == 2){
                var childOptions = lookAhead(newGameStateId, depth + 1, maxDepth, sc, false);

                //console.log(`${newGameStateId}: depth ${depth}, has ${childOptions.length} children`);
                //console.log(childOptions);

                childOptions.sort((a, b) => b.p1Claimed - a.p1Claimed);
                var maxChildScore = childOptions[0].p1Claimed;
                var highestChildOptions = childOptions.filter(child => child.p1Claimed == maxChildScore);

                //console.log(`${newGameStateId}: new option has max child score of ${maxChildScore}, and ${highestChildOptions.length} children have this score.`)

                for(var hco = 0; hco < highestChildOptions.length; hco++){
                    var hcoGameStateId = highestChildOptions[hco].gameStateId;
                    
                    printGameState(hcoGameStateId);
                    //console.log(`${hcoGameStateId}: (as ${newGameStateId}) adding player2's ${depth + 2}-depth moves in response to p1.`)
                    
                    var grandchildOptions = lookAhead(hcoGameStateId, depth + 2, maxDepth, sc, true);
                    options.push(...grandchildOptions);

                    printGameState(hcoGameStateId);
                    //console.log(`${hcoGameStateId}: (as ${newGameStateId}) added ${grandchildOptions.length} grandchild options.`)
                }
            } 
        }
    }

    if(options.length){
        //console.log(`${newGameStateId}: Completed and found ${options.length} options.`)
        return options;
    }

    //console.log(`${newGameStateId}: Completed and found no options. Will return with backup option only.`)
    //console.log(backupOptions)
    backupOptions.sort((a, b) => b.p2Claimed - a.p2Claimed);
    currentComputerTurnOptions.push(backupOptions[0]);
    return backupOptions;
}
