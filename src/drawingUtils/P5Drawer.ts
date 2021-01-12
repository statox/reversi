import P5 from 'p5';
import {Board, Cell, Game} from '../game';

export class P5Drawer {
    p5: P5;

    constructor(p5: P5) {
        this.p5 = p5;
    }

    drawCell(cell: Cell, size: number) {
        const p5 = this.p5;
        if (cell.value === undefined) {
            return;
        }

        p5.push();
        const y = cell.boardPos.y * size;
        const x = cell.boardPos.x * size;

        p5.translate(x, y);
        if (cell.value === 1) {
            p5.fill(0);
        } else {
            p5.fill(250);
        }
        p5.circle(size / 2, size / 2, size * 0.9);
        p5.pop();
    }

    drawBoard(board: Board) {
        const p5 = this.p5;

        const d = Math.min(p5.width, p5.height) / board.D;
        for (let j = 0; j < board.D; j++) {
            const y = j * d;
            for (let i = 0; i < board.D; i++) {
                const x = i * d;
                p5.push();
                p5.translate(x, y);
                p5.stroke(0);
                if (board.lastPlayed && board.lastPlayed.boardPos.x === i && board.lastPlayed.boardPos.y === j) {
                    p5.fill(0, 50, 0);
                } else if (board.lastFailed && board.lastFailed.boardPos.x === i && board.lastFailed.boardPos.y === j) {
                    p5.fill(50, 0, 0);
                } else if (board.openCells.some((c) => c.boardPos.x === i && c.boardPos.y === j)) {
                    p5.fill('rgba(100, 100, 200, 0.1)');
                } else {
                    p5.fill(0, 150, 0);
                }
                p5.square(0, 0, d);
                p5.pop();

                this.drawCell(board.cells[j][i], d);
            }
        }
    }

    drawGame(game: Game) {
        const p5 = this.p5;

        this.drawBoard(game.board);
        let scorePlayer = `Player: ${game.scores[1]}`;
        let scoreIA = `Computer: ${game.scores[2]}`;
        p5.fill(250);
        p5.stroke(0);
        p5.textSize(20);
        p5.text(scorePlayer, 10, 20);
        p5.text(scoreIA, 10, 40);

        if (game.isOver) {
            const gameOverText = 'GAME OVER';
            p5.textSize(40);
            p5.text(gameOverText, p5.width / 2 - p5.textWidth(gameOverText) / 2, p5.height / 2);
        }
    }
}
