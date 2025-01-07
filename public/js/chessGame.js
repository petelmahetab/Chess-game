const socket = io();
const chess = new Chess();
const chessBoard = document.querySelector('.chessboard');

let draggedPiece = null;
let playRole = null;
let soureceSquare = null;

const renderBoard = () => {
    const board = chess.board();
    chessBoard.innerHTML = '';

    board.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const squareElement = document.createElement('div');
            squareElement.classList.add(
                'square',
                (rowIndex + colIndex) % 2 === 0 ? 'dark' : 'light'
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = colIndex;

            // Check if the square contains a piece
            if (square) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add(
                    'piece',
                    square.color === 'w' ? 'white' : 'black'
                );
                pieceElement.innerHTML = getPieceUnicode(square); // Get Unicode for the piece
                squareElement.appendChild(pieceElement);
            }

            chessBoard.appendChild(squareElement); // Add square to the board
        });
    });
};





const handleMove = () => { }

const getPieceUnicode = (piece) => {
    if (!piece || !piece.color || !piece.type) return ''; // Handle invalid or empty squares

    const chessPiecesUnicode = {
        white: {
            king: '\u2654',    // ♔
            queen: '\u2655',   // ♕
            rook: '\u2656',    // ♖
            bishop: '\u2657',  // ♗
            knight: '\u2658',  // ♘
            pawn: '\u2659'     // ♙
        },
        black: {
            king: '\u265A',    // ♚
            queen: '\u265B',   // ♛
            rook: '\u265C',    // ♜
            bishop: '\u265D',  // ♝
            knight: '\u265E',  // ♞
            pawn: '\u265F'     // ♟
        }
    };

    return chessPiecesUnicode[piece.color][piece.type] || '';
};





renderBoard()