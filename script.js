const gameboard = (function () {
    const row = 3;
    const column = 3;
    const board = [];

    const emptyBoard = () => {
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < column; j++) {
                board[i].push(Cell());
            }
        }
    }
    emptyBoard();

    const getBoardState = () => board.map(row => row.map(cell => cell.getValue()));

    // TODO Remove if UI gets added
    const printBoard = () => {
        const boardWithValues = getBoardState();
        console.table(boardWithValues);
    };

    const drawShape = (row, col, shape) => {
        if (board[row][col].getValue() !== '') return false;

        board[row][col].addShape(shape);
        // TODO Remove later
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
        emptyBoard,
    };
})();

const gameController = (function (
    playerOneName = "Player 1",
    playerTwoName = "Player 2",
) {

    let turn = 0;
    const getTurn = () => turn;
    const setTurn = (newTurn) => turn = newTurn;

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
    const resetActivePlayer = () => activePlayer = players[0];

    const switchActiveTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    // TODO Remove if UI gets added
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

    let gameState = "play";
    const getGameState = () => gameState;

    const handleGameOver = () => {
        if (getTurn() === 9) {
            // TODO Remove later
            console.log("It's a tie!");
            gameState = "tie";
        } else {
            // TODO Remove later
            console.log(`${getActivePlayer().name} has won the battle!`);
            gameState = "win";
        }
    }

    const playRound = (row, column) => {
        if (!gameboard.drawShape(row, column, getActivePlayer().shape)) {
            console.log("Invalid move"); // TODO Remove later
            printNewRound(); // TODO Remove later
            return;
        }

        // If 5 moves have gone, start checking for winning combinations
        if (getTurn() >= 4) {
            const won = checkWin();
            if (won) {
                handleGameOver();
                return;
            }
        }

        switchActiveTurn();
        printNewRound();
        setTurn(getTurn() + 1);

        // If 9 moves have gone, show a tie
        if (getTurn() === 9) {
            handleGameOver();
        }
    };

    const newGame = () => {
        gameboard.emptyBoard();
        gameState = "play";
        setTurn(0);
        resetActivePlayer();
    }

    printNewRound();

    return {
        getActivePlayer,
        playRound,
        getTurn,
        newGame,
        getGameState,
    };
})();

const screenController = (function(
    document,
) {
    const grid = document.querySelector(".grid");
    const button = document.getElementById("newGameBtn");
    const status = document.getElementById("status");

    status.textContent = `${gameController.getActivePlayer().name}'s turn`;

    const updateScreen = () => {
        const boardWithValues = gameboard.getBoardState();
        const gameState = gameController.getGameState();

        if (gameState === "draw" || gameState === "win") {
            status.textContent = (gameState === "draw") ? "It's a draw!" : `${gameController.getActivePlayer().name} has won!`;
            setButtonState(true);
        } else {
            status.textContent = `${gameController.getActivePlayer().name}'s turn`;
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellValue = boardWithValues[i][j];
                document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                    .textContent=cellValue;
            }
        }
    }

    const createBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const box = document.createElement("button");
                box.classList.add("box");
                box.setAttribute("data-row", i);
                box.setAttribute("data-col", j);

                grid.appendChild(box);
            }
        }
    }

    const setButtonState = (flag) => {
        const boxes = document.querySelectorAll(".box");
        
        boxes.forEach(box => {
            box.disabled = flag;
        })
    }

    button.addEventListener("click", () => {
        gameController.newGame();
        updateScreen();
        setButtonState(false);
    })

    grid.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "button") {
            const row = e.target.getAttribute("data-row");
            const col = e.target.getAttribute("data-col");

            gameController.playRound(row, col);
            updateScreen();
        }
    });

    return { 
        createBoard,
    };

})(document);

// Game testing
screenController.createBoard();