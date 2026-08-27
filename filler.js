
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Configuration
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var gridWidth = 8;
var gridHeight = 7;
var colorSet = 6;

var gameStates = [];

var captureAllTiles = true;
var autoCapture = false;
var captureGoal = "";

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
    "#6fffcd",
    "#ff1c1c",
    "#ffa5e3",
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
                        <div class="string-selector-option" id="opponent-type-selector-comp-easy">Computer</div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p class='button' id='play-button'>Start Game</p>
        </div>
    </div>`;
    document.getElementById("main-content").innerHTML = configurationHTML;

    for(let s = 3; s < 16; s++){
        document.getElementById(`board-height-selector`).innerHTML += `<div class="number-selector-option" id="board-height-selector-${s}">${s}</div>`;
    }
    for(let s = 3; s < 16; s++){
        document.getElementById(`board-height-selector-${s}`).addEventListener("click", e => handleNumberSelectorInput("height", s));
    }

    for(let s = 3; s < 16; s++){
        document.getElementById(`board-width-selector`).innerHTML += `<div class="number-selector-option" id="board-width-selector-${s}">${s}</div>`;
    }
    for(let s = 3; s < 16; s++){
        document.getElementById(`board-width-selector-${s}`).addEventListener("click", e => handleNumberSelectorInput("width", s));
    }

    for(let s = 3; s <= 12; s++){
        document.getElementById(`color-count-selector`).innerHTML += `<div class="number-selector-option" id="color-count-selector-${s}">${s}</div>`;
    }
    for(let s = 3; s <= 12; s++){
        document.getElementById(`color-count-selector-${s}`).addEventListener("click", e => handleNumberSelectorInput("color", s));
    }
    
    document.getElementById(`end-condition-selector-100`).addEventListener("click", e => handleStringSelectorInput("end", "all"));
    document.getElementById(`end-condition-selector-50`).addEventListener("click", e => handleStringSelectorInput("end", "fptp"));

    document.getElementById(`auto-capture-selector-true`).addEventListener("click", e => handleStringSelectorInput("autocapture", true));
    document.getElementById(`auto-capture-selector-false`).addEventListener("click", e => handleStringSelectorInput("autocapture", false));

    document.getElementById(`opponent-type-selector-human`).addEventListener("click", e => handleStringSelectorInput("opponent", "human"));
    document.getElementById(`opponent-type-selector-comp-easy`).addEventListener("click", e => handleStringSelectorInput("opponent", "comp-easy"));
    
    document.getElementById(`board-height-selector-${gridHeight}`).classList.add("selected");
    document.getElementById(`board-width-selector-${gridWidth}`).classList.add("selected");
    document.getElementById(`color-count-selector-${colorSet}`).classList.add("selected");

    if(player2.isHuman) {
        document.getElementById(`opponent-type-selector-human`).classList.add("selected");
    } else {
        document.getElementById(`opponent-type-selector-comp-easy`).classList.add("selected");
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
        if(player2.isHuman){
            document.getElementById(`opponent-type-selector-human`).classList.remove("selected");
        } else {
            document.getElementById(`opponent-type-selector-comp-easy`).classList.remove("selected");
        }

        if(option === "human"){
            player2.isHuman = true;
            document.getElementById(`opponent-type-selector-human`).classList.add("selected");
        } else if (option === "comp-easy"){
            player2.isHuman = false;
            document.getElementById(`opponent-type-selector-comp-easy`).classList.add("selected");
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
}

function populateStartingGrids() {
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

    addNewGameState(colorGrid, ownershipGrid, 0, [], p1Links, p2Links, "Initialize game");
    captureNewLink(0, 1, p1Start.y, p1Start.x);
    captureNewLink(0, 2, p2Start.y, p2Start.x);

    console.log(gameStates[0]);
}

function createBasicLayout(){
    var basicLayoutHTML = `<div id="game-state-container">
        <div class="player current-player" id="player-1" style="outline-color: ${colorBank[gameStates[0].player1.currentColor]}">
            <h2>${player1.name}</h2>
            <p id="player-1-score">${gameStates[0].player1.claimedTiles}${captureGoal}</p>
            <p style="font-weight: bold;" id="player-1-turn-indicator">Your turn!</p>
        </div>
        <div id="game-grid"></div>
        <div class="player" id="player-2" style="outline-color: ${colorBank[gameStates[0].player2.currentColor]}"2>
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
    console.log(`${gameStateId}: switching to ${color}`)

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

    gameStates[gameStateId].history.push(`Player${prevPlayer} switched to color ${color}`)
    console.log(gameStates[gameStateId])

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
            return "win";
        }
    }

    if(updateUI & gameStates[gameStateId].turn%2 && !player2.isHuman){
        takeComputerTurn();
    }

    return "success";
}

function claimLandlockedTiles(gameStateId, player){
    var captured = 0;
    var closenesses = getClosenessGrids(gameStateId);
    console.log(closenesses);

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
    if(gameStateId == 0 && captureAllTiles){
        var captured = gameStates[gameStateId].player1.claimedTiles + gameStates[gameStateId].player2.claimedTiles;
        var total = gridHeight * gridWidth;
        return ( captured == total );
    } 

    // otherwise use first-past-the-post
    var thePost = gridHeight * gridWidth / 2;
    return (gameStates[gameStateId].player1.claimedTiles > thePost) || (gameStates[gameStateId].player2.claimedTiles > thePost);
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

function getClosenessGrids(gameStateId){
    // 0 is max closeness. 
    // null is a tile that is not linked to this player
    // 1 indicates one connection away, 2 is a walk of two away, etc

    // returns two grids of the set size, one for each player.
    var grids = {
        player1: [],
        player2: []
    };
 
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                  Computer Turn Logic
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function takeComputerTurn(){
    var result = oneTurnLookAhead();
    switchColor(0, result);
}

function oneTurnLookAhead(){
    var options = [];
    var backupOptions = [];

    for(var co = 0; co < colorSet; co++){
        var thisCopy = copyGameState(0);
        var result = switchColor(thisCopy, co)
        
        if(result == "win" && gameStates[thisCopy].player2.claimedTiles >= gameStates[thisCopy].player1.claimedTiles){ 
            return co;
        } else if (result == "success"){
            options.push({
                color: co,
                score: gameStates[thisCopy].player2.claimedTiles
            });
        } else if (result != "bad"){
            backupOptions.push({
                color: co,
                score: gameStates[thisCopy].player2.claimedTiles
            });
        }
    }

    // sort by which nets the highest score
    options.sort((a, b) => b.score - a.score);

    // if the only move is a losing move, make the best losing move
    if(options.length == 0){
        console.log("No viable options, forced to play a losing move").
        backupOptions.sort((a, b) => b.score - a.score);
        return backupOptions[0].color;
    }

    // detect endgame
    if(options.filter(item => item.score == options[0].score).length == options.length){
        console.log("all options equally viable, will attempt to find something landlocked.")
        
        var closenesses = getClosenessGrids(0);
        for(var y = 0; y < gridHeight; y++){
            for(var x = 0; x < gridWidth; x++){
                if(gameStates[0].ownershipGrid[y][x] == null && closenesses.player1[y][x] == null && closenesses.player2[y][x] != null){
                    if(options.find(item => item.color == gameStates[0].colorGrid[y][x])){
                        console.log("Switching to a landlocked color option.")
                        return gameStates[0].colorGrid[y][x];
                    }
                }
            }
        }
    }

    console.log(options);
    console.log("Switching to highest-scoring color option.")
    return options[0].color;
}