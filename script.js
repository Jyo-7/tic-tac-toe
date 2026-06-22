function gameBoard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (row,column,playerMarker) => {
         if(board[row][column].getValue() === 0){
            board[row][column].addMarker(playerMarker);
         }
         else{
            return;
         }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
        row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };
    
    //Winner Conditions
    const winnerCheck = () => {

        for(let row = 0; row < 3; row++){
            let first = board[row][0].getValue();

            if(first !== 0 && first === board[row][1].getValue() && first === board[row][2].getValue()){
                return first;
            }
        }

        for(let col = 0; col < 3; col++){
            let first = board[0][col].getValue();

            if(first !== 0 && first === board[1][col].getValue() && first === board[2][col].getValue()){
                return first;
            }
        }

        let center = board[1][1].getValue();

        if( center !== 0 && center === board[0][0].getValue() && center === board[2][2].getValue()){
            return center;
        }

        if( center !== 0 && center === board[0][2].getValue() && center === board[2][0].getValue()){
            return center;
        }
        
        return null;
    }

    const drawCheck = () => {
       return board.flat().every(cell => cell.getValue() !== 0);
    }

    const resetBoard = () => {
        for(let i = 0; i < 3; i++){
            for( let j = 0; j < 3; j++){
                board[i][j].reset();
            }
        }
    }

    return {
        getBoard,placeMarker,printBoard,winnerCheck,resetBoard,drawCheck,
    };
}



function gameController(playerOneName = "playerOne", playerTwoName = "playerTwo") {
    const board = gameBoard();

    const players = [
        {   name:playerOneName,
            marker:"X",
        },
        {   name:playerTwoName,
            marker:"O",
        }
    ];

    let currentPlayer = players[0];

    const playerSwitch = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getCurrentPlayer().name}'s turn.`);
    };


    const playRound = (row,column) => {

        console.log(`Dropping ${getCurrentPlayer().name}'s token into row ${row}, column ${column}...`);
        board.placeMarker(row,column, getCurrentPlayer().marker);

        const winner = board.winnerCheck();
        if(winner){
            console.log(`${getCurrentPlayer}.name wins`);
            // board.resetBoard();
        }
        else{
            playerSwitch();
            printNewRound();
        }
    };

    printNewRound();

    return {playRound,getCurrentPlayer, 
        getBoard : board.getBoard,
        winnerCheck : board.winnerCheck,
        resetBoard : board.resetBoard,
        drawCheck : board.drawCheck,
    };
}


function Cell(){
    let value = 0;
    
    const addMarker = (playerMarker) => {
        value = playerMarker;
        console.log(value);
    };

    const getValue = () => value;

    const reset = () => value = 0;

    return {
        addMarker,getValue,reset
    };
}


function displayController(){

    const startGame = document.querySelector(".start");
    const dialog = document.querySelector(".dialog");
    const playersForm = document.querySelector(".form");

    let playerOneName;
    let playerTwoName;

    startGame.addEventListener("click", () => 
        dialog.showModal()
    );

    playersForm.addEventListener("submit",(e) => {
        e.preventDefault();
        playerOneName = document.getElementById("one").value.toUpperCase();
        playerTwoName = document.getElementById("two").value.toUpperCase();
        console.log(`${playerOneName}`);
        dialog.close();

        // object instance
        const game = gameController(playerOneName,playerTwoName);

        const turnDiv = document.querySelector(".turn");
        const boardDiv = document.querySelector(".board-content");
        const winnerDiv = document.querySelector(".result");
        const restartDiv = document.querySelector(".restart");

        let isGameOver = false;  //to prevent user from clicking occupied cell

        const screenRender = () => {

            boardDiv.textContent = "";

            const board = game.getBoard();
            const currentPlayer = game.getCurrentPlayer();

            turnDiv.textContent = `${currentPlayer.name}'s Turn`;

            board.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {

                    const cellBtn = document.createElement("button");
                    cellBtn.classList.add("cell");

                    cellBtn.dataset.row = rowIndex;
                    cellBtn.dataset.column = colIndex;

                    cellBtn.textContent = cell.getValue();
                    boardDiv.appendChild(cellBtn);
                });
            });
        };

        const restartGame = () => {

            if(restartDiv.querySelector(".restartbtn")) return;

            const btn = document.createElement("button");
            btn.classList.add("restartbtn");
            btn.textContent = "Play Again";
            restartDiv.appendChild(btn);

            btn.addEventListener("click", (event) => {
                isGameOver = false; 
                winnerDiv.textContent = "";
                restartDiv.removeChild(btn);
                event.target.remove();
                startGame.click();
            });
        }

        // triggered when cell inside the board is clicked 
        function clickHandler(e) {

            if(isGameOver) {
                return;
            }

            const selectedRow = e.target.dataset.row;
            const selectedCol = e.target.dataset.column;

            if(!selectedCol) return;

            game.playRound(selectedRow, selectedCol);

            screenRender();

            const currentPlayer = game.getCurrentPlayer();

            //Checking for winner
            const winner = game.winnerCheck();
            if(winner) {
                winnerDiv.textContent = `${currentPlayer.name} WON`;
                isGameOver = true;
                game.resetBoard();
                restartGame();
            }

            const draw = game.drawCheck();
            if(draw) {
                winnerDiv.textContent = "IT'S A TIE";
                isGameOver = true;
                game.resetBoard();
                restartGame();
            }         
        }

        boardDiv.addEventListener("click", clickHandler);

        screenRender();
    });
}

displayController();