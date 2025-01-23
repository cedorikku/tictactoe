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
        if (board[row][col] === '') return;

        board[row][col].addShape(shape);
        console.log(`An ${shape} has been placed.`);
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