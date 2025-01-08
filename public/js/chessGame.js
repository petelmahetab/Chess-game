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


    if(playRole ==='b'){
        chessBoard.classList.add('flipped')
    }else{
        chessBoard.classList.remove('flipped')
    }
};





const handleMove = (source,target) => { 
    const move={
        from:`${String.fromCharCode(97+source.col)}${8-source.row}`,
        to:`${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion:'q'
    }
  socket.emit('move',move); //for sending to backend
console.log(move)
}

const getPieceUnicode = (piece) => {
    if (!piece || !piece.color || !piece.type) {
        console.error('Invalid piece:', piece); // Debugging invalid pieces
        return ''; // Handle invalid or empty squares
    }

    const chessPiecesUnicode = {
        k: '\u2654',    // ♔
        q: '\u2655',   // ♕
        r: '\u2656',    // ♖
        b: '\u2657',  // ♗
        n: '\u2658',  // ♘
        p: '\u2659'     // ♙
    };
   
    // n: '\u2658', // Knight
    

    // Check if the piece type exists in the mapping
    if (!chessPiecesUnicode[piece.type]) {
        console.error(`Unknown piece type: ${piece.type}`);
        return ''; // Return empty string for unknown types
    }

    // Calculate Unicode for black pieces by adding 6 to the white piece's Unicode
    const unicodeOffset = piece.color === 'b' ? 6 : 0;
    return String.fromCharCode(chessPiecesUnicode[piece.type].charCodeAt(0) + unicodeOffset);
};


//SEND to backend the all Front-End Part will be done Now....
socket.on('playerRole',(role)=>{
    playRole=role
    renderBoard();
})
socket.on('spectatorRole',(role)=>{
    playRole=null
    renderBoard();
})


socket.on('move', (m) => {
    console.log('Move received:', m);
    // Update the board with the move
    chess.move(m); // Update the chess instance
    renderBoard(); // Re-render the board
});

socket.on('boardState', (fen) => {
    console.log('Board state received:', fen);
    chess.load(fen); // Load the new state into the chess instance
    renderBoard(); // Re-render the board
});

renderBoard()