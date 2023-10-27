const SIZE = 4;
const NUM_IN_A_ROW = 3;

const directions = {
    'left': {x: -1, y: 0},
    'right': {x: 1, y: 0},
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1}
};

let board = initBoard();
let boardSolved = initBoard();
let bombTiles = [];
let time = null;
let moves = 0;

function startTimer() {
    time = 0;

    setInterval(() => {
        time++;
        $('.content__stat-time-val').attr('data-val', time);
    }, 1000);
}

function setMoves() {
    moves++;

    $('.content__stat-moves-val').attr('data-val', moves);
}

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

function fillBombTiles(board, num = 3) {
    let newBombTilesCount = 0;

    bombTiles = [];

    while (newBombTilesCount < num) {
        let tileNum = Math.ceil(Math.random() * (board.length * board.length - 1));

        if (!bombTiles.includes(tileNum)) {
            bombTiles.push(tileNum);
            newBombTilesCount++;
        }
    }
}

function findTilePosByNum(board, num) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === num) {
                return {x: j, y: i};
            }
        }
    }
}

function swapTiles(board, x1, y1, x2, y2) {
    let temp = board[y1][x1];
    board[y1][x1] = board[y2][x2];
    board[y2][x2] = temp;
}

function calcPossibleMoves(tilePos) {
    return Object.fromEntries(Object.entries(directions).filter(v =>
        tilePos.x + v[1].x >= 0 &&
        tilePos.x + v[1].x < SIZE &&
        tilePos.y + v[1].y >= 0 &&
        tilePos.y + v[1].y < SIZE
    ));
}

function shuffleBoard(board, moves = 1000) {
    let emptyPos = findTilePosByNum(board, null);

    for (let i = 0; i < moves; i++) {
        const possibleMoves = calcPossibleMoves(emptyPos);
        const randomMoveKey = (Object.keys(possibleMoves)[(Math.random() * Object.keys(possibleMoves).length) | 0]);
        const randomMove = possibleMoves[randomMoveKey];

        swapTiles(board, emptyPos.x, emptyPos.y, emptyPos.x + randomMove.x, emptyPos.y + randomMove.y);
        emptyPos = {x: emptyPos.x + randomMove.x, y: emptyPos.y + randomMove.y};
    }
}

function drawBoard(board) {
    let boardWrapper = $('.board');

    boardWrapper.html('');

    board.forEach((row) => {
        row.forEach((num) => {
            let tile = $('<div class="board__tile">')
                .attr('data-num', num ?? '')
                .attr('style', 'background-image: url(img/puzzles/1/' + num + '.png)')
                .html(num);

            if (bombTiles.includes(num)) {
                tile.attr('data-type', 'bomb');
            }

            tile.on('click', (e) => clickTile(board, e.target));
            boardWrapper.append(tile);
        });
    });
}

function clickTile(board, tileEl) {
    if (time === null) {
        startTimer();
    }

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

    for (const [moveDir, move] of Object.entries(possibleMoves)) {
        newTilePos = {x: tilePos.x + move.x, y: tilePos.y + move.y};

        if (JSON.stringify(newTilePos) === JSON.stringify(emptyPos)) {
            swapTiles(board, emptyPos.x, emptyPos.y, tilePos.x, tilePos.y);
            drawBoard(board);
            continue;
        }
    }

    setMoves();

    bombTilesCheck(board);

    winConCheck(board);
}

const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

function bombTilesCheck(board) {
    let blow = false;

    bombTiles = shuffleArray(bombTiles);

    mainLoop: for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            // Check horizontal
            if (
                j < SIZE - 2
                && bombTiles.includes(board[i][j])
                && bombTiles.includes(board[i][j + 1])
                && bombTiles.includes(board[i][j + 2])
            ) {
                blow = true;
                break mainLoop;
            }

            // Check vertical
            if (
                i < SIZE - 2
                && bombTiles.includes(board[i][j])
                && bombTiles.includes(board[i + 1][j])
                && bombTiles.includes(board[i + 2][j])
            ) {
                blow = true;
                break mainLoop;
            }
        }
    }

    if (blow) {
        let bombTileIndex = 0;

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (bombTiles.includes(board[i][j])) {
                    board[i][j] = bombTiles[bombTileIndex];
                    bombTileIndex++;
                }
            }
        }

        fillBombTiles(board);
    }

    drawBoard(board);
}

function winConCheck(board) {
    let puzzleSolved = board.every((v, i) => v.every((v2, j) => v2 === boardSolved[i][j]));

    if (puzzleSolved) {
        setTimeout(() => {
            alert('You win!');
        }, 100);
    }
}

shuffleBoard(board, 1);
fillBombTiles(board);
drawBoard(board);

bombTilesCheck(board);
