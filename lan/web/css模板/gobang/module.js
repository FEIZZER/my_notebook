initChessBoard();




//初始化棋盘
function initChessBoard() {
    let chessboard = document.getElementById('chessboard');
    for (let i = 0; i < 14 * 14; i++) {
        let box = document.createElement('span');
        box.className = 'box';
        chessboard.appendChild(box);
    }
    let container = document.getElementsByClassName('container')[0];
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            let chess = document.createElement('span');
            chess.className = 'chessplace';
            chess.style.left = 31.55 + j * 50 + 'px';
            chess.style.top = 31.55 + i * 50 + 'px';
            container.appendChild(chess);
            chess.onclick = function () {
                this.style.backgroundColor = 'black';
                this.style.boxShadow = ' -3px -3px 7px #ffffff10, 2px 2px 5px rgba(94, 104, 121, 0.288)';
            }
        }
    }

}
//落子
function chessDown(){
    
}