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

    const resetBoard = () => {
        for(let i = 0; i < 3; i++){
            for( let j = 0; j < 3; j++){
                board[i][j].reset();
            }
        }
    }

    return {
        getBoard,placeMarker,printBoard,winnerCheck,resetBoard
    };
}

function gameController(){
    const board = gameBoard();

    const players = [
        {   name:"playerOne",
            marker:"x",
        },
        {   name:"playerTwo",
            marker:"o",
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
            board.resetBoard();
        }
        else{
            playerSwitch();
            printNewRound();
        }
    };

    printNewRound();

    return {playRound,getCurrentPlayer};
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

const game = gameController();