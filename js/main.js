const SIZE = 4;

const directions = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1}
];

let board = initBoard();
let boardSolved = initBoard();

function initBoard() {
    let board = [];

    for (let i = 0; i < SIZE; i++) {
        board[i] = [];

        for (let j = 0; j < SIZE; j++) {
            board[i][j] = i * SIZE + j + 1;
        }
    }

    board[SIZE - 1][SIZE - 1] = null;

    return board;
}

function findTilePosByNum(board, num) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === num) {
                return {x: i, y: j};
            }
        }
    }
}

function swapTiles(board, x1, y1, x2, y2) {
    let temp = board[x1][y1];
    board[x1][y1] = board[x2][y2];
    board[x2][y2] = temp;
}

function calcPossibleMoves(tilePos) {
    return directions.filter(dir =>
        tilePos.x + dir.x >= 0 &&
        tilePos.x + dir.x < SIZE &&
        tilePos.y + dir.y >= 0 &&
        tilePos.y + dir.y < SIZE
    );
}

function shuffleBoard(board, moves = 1000) {
    let emptyPos = findTilePosByNum(board, null);

    for (let i = 0; i < moves; i++) {
        const possibleMoves = calcPossibleMoves(emptyPos);
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        swapTiles(board, emptyPos.x, emptyPos.y, emptyPos.x + randomMove.x, emptyPos.y + randomMove.y);
        emptyPos = {x: emptyPos.x + randomMove.x, y: emptyPos.y + randomMove.y};
    }
}

function drawBoard(board) {
    let boardWrapper = $('.board');

    boardWrapper.html('');

    board.forEach((row) => {
        row.forEach((cell) => {
            let tile = $('<div class="board__tile">').attr('data-num', cell ?? '').html(cell);
            tile.on('click', (e) => clickTile(board, e.target));
            boardWrapper.append(tile);
        });
    });
}

function clickTile(board, tileEl) {
    let tile = $(tileEl);
    let tileNum = tile.attr('data-num');

    if (tileNum === '') {
        return false;
    }

    tileNum = parseInt(tileNum);

    let emptyPos = findTilePosByNum(board, null);
    let tilePos = findTilePosByNum(board, tileNum);
    let newTilePos;

    const possibleMoves = calcPossibleMoves(tilePos);

    for (let i = 0; i < possibleMoves.length; i++) {
        let move = possibleMoves[i];
        newTilePos = {x: tilePos.x + move.x, y: tilePos.y + move.y};

        if (JSON.stringify(newTilePos) === JSON.stringify(emptyPos)) {
            swapTiles(board, emptyPos.x, emptyPos.y, tilePos.x, tilePos.y);
            drawBoard(board);
            continue;
        }
    }

    let puzzleSolved = board.every((v, i) => v.every((v2, j) => v2 === boardSolved[i][j]));

    // Win condition check
    if (puzzleSolved) {
        setTimeout(() => {
            alert('You win!');
        }, 100);
    }
}

shuffleBoard(board, 100);
drawBoard(board);
