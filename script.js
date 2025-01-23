const gameboard = (function() {
    const row = 3;
    const column = 3;
    const board = [];

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(Cell());
        }
    }

    const printBoard = () => {
        const boardWithValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithValues);
    };

    const drawShape = (row, col, shape) => {
        if (board[row][col].getValue() !== '') return false;

        board[row][col].addShape(shape);
        console.log(`An ${shape} has been placed.`);
        return true;
    }

    function Cell() {
        let value = '';

        const getValue = () => value;

        const addShape = (shape) => {
            value = shape;
        };

        return {
            getValue,
            addShape
        };
    }

    return { 
        printBoard,
        drawShape
    };
})();

const gameController = (function(
    board,
    playerOneName = "Player 1",
    playerTwoName = "Player 2",
) {

    const players = [
        {
            name: playerOneName,
            shape: 'O'
        },
        {
            name: playerTwoName,
            shape: 'X',
        },
    ]

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const switchActiveTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const printNewRound = () => {
        board.printBoard();   
        console.log(`It's now ${getActivePlayer().name}'s turn`)
    };

    const playRound = (row, column) => {
        if (!board.drawShape(row, column, getActivePlayer().shape)) {
            console.log("Invalid move");
            printNewRound();
        }

        switchActiveTurn();
        printNewRound();
    };
    
    printNewRound();

    return {
        getActivePlayer,
        playRound,
    };

})(gameboard);

gameController.playRound(1, 1);
gameController.playRound(0, 1);
gameController.playRound(0, 1);