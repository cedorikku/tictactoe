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

    const clearBoard = () => {
        board = [];
    }

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
        gameboard.printBoard();
        console.log(`It's now ${getActivePlayer().name}'s turn`)
    };

    function checkWin() {
        const boardWithValues = gameboard.getBoardState();

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
            for (let i = 0, cellValue; i < 3; i++) {
                cellValue = boardWithValues[0][i];
                if (cellValue === boardWithValues[1][i] &&
                    (cellValue === boardWithValues[2][i]) &&
                    (cellValue === 'O' || cellValue === 'X')) {
                    return true;
                }
            }
            return false;
        }

        const checkDiagonals = () => {
            const centerValue = boardWithValues[1][1];
            if ((centerValue === boardWithValues[0][0] && centerValue === boardWithValues[2][2]) &&
                (centerValue === 'O' || centerValue === 'X')) {
                return true;
            } 
            
            if ((centerValue === boardWithValues[0][2] && centerValue === boardWithValues[2][0]) &&
                (centerValue === 'O' || centerValue === 'X')) {
                return true;
            }
            return false;
        }

        const result = (checkRows() || checkColumns() || checkDiagonals()) ? true : false;
        return result;
    }

    const playRound = (row, column) => {
        if (!gameboard.drawShape(row, column, getActivePlayer().shape)) {
            console.log("Invalid move");
            printNewRound();
            return;
        }

        // TODO Add win condition checking logic
        // If 5 moves have gone, start checking for winning combinations

        // if (tracker.getMoves >= 5) {
        //     result = checkWin();
        // }
        const result = checkWin();

        // TODO go along with screen
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

})();
