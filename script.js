const gameboard = (function () {
    const row = 3;
    const column = 3;
    const board = [];

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(Cell());
        }
    }

    const getBoardState = () => board.map(row => row.map(cell => cell.getValue()));

    //! Remove if UI gets added
    const printBoard = () => {
        const boardWithValues = getBoardState();
        console.table(boardWithValues);
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
        drawShape,
        getBoardState,
    };
})();

const gameController = (function (
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

    function checkWin() {
        const boardWithValues = board.getBoardState();

        const checkRows = () => {
            for (let i = 0, cellValue; i < 3; i++) {
                cellValue = boardWithValues[i][0];
                if (cellValue === boardWithValues[i][1] &&
                    (cellValue === boardWithValues[i][2]) &&
                    (cellValue === 'O' || cellValue === 'X')) {
                    return true;
                }
            }
            return false;
        }

        const checkColumns = () => {
            return false;
        }

        const checkDiagonals = () => {
            return false;
        }


        const result = (checkRows() || checkColumns() || checkDiagonals()) ? true : false;
        return result;
    }

    const playRound = (row, column) => {
        if (!board.drawShape(row, column, getActivePlayer().shape)) {
            console.log("Invalid move");
            printNewRound();
        }

        // TODO Add win condition checking logic
        // If 5 moves have gone, start checking for winning combinations

        // if (tracker.getMoves >= 5) {
        //     result = checkWin();
        // }
        const result = checkWin();

        if (result) {
            console.log(`${getActivePlayer().name} has won the battle!`);
            moves = 0;
            // reset board
            return;
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

// for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) { 
//         gameController.playRound(i, j);
//     }
// }

// Game testing
gameController.playRound(2, 0);
gameController.playRound(0, 0);
gameController.playRound(2, 1);
gameController.playRound(0, 1);
gameController.playRound(2, 2);