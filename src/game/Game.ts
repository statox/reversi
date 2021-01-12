import P5 from 'p5';
import {Board} from './Board';
import PlayerID from '../Player';

export class Game {
    p5: P5;
    board: Board;
    currentPlayer: PlayerID;
    scores: Object; // TODO Don't be lazy and type that properly
    isOver: boolean;

    constructor(p5: P5) {
        this.p5 = p5;
        this.board = new Board(p5);
        this.currentPlayer = 1;
        this.updateScores();
        this.isOver = false;
    }

    placeDisk(coord: {i: number; j: number}) {
        if (!coord) {
            return false;
        }
        if (this.board.placeDisk(this.currentPlayer, coord)) {
            let otherPlayer;
            if (this.currentPlayer === 1) {
                this.currentPlayer = 2;
                otherPlayer = 1;
            } else {
                this.currentPlayer = 1;
                otherPlayer = 2;
            }

            if (this.board.findOpenCells(this.currentPlayer).length === 0) {
                if (this.board.findOpenCells(otherPlayer).length === 0) {
                    this.isOver = true;
                } else {
                    console.log('Playing again because blocked');
                    if (this.currentPlayer === 1) {
                        this.currentPlayer = 2;
                    } else {
                        this.currentPlayer = 1;
                    }
                }
            }

            this.updateScores();
            return true;
        }
        return false;
    }

    updateScores() {
        this.scores = {
            1: 0,
            2: 0
        };
        this.board.cells.forEach((cellLine) => {
            cellLine.forEach((cell) => {
                if (cell.value) {
                    this.scores[cell.value] += 1;
                }
            });
        });
    }

    draw() {
        this.board.draw();
        let scorePlayer = `Player: ${this.scores[1]}`;
        let scoreIA = `Computer: ${this.scores[2]}`;
        this.p5.fill(250);
        this.p5.stroke(0);
        this.p5.textSize(20);
        this.p5.text(scorePlayer, 10, 20);
        this.p5.text(scoreIA, 10, 40);

        if (this.isOver) {
            const gameOverText = 'GAME OVER';
            this.p5.textSize(40);
            this.p5.text(gameOverText, this.p5.width / 2 - this.p5.textWidth(gameOverText) / 2, this.p5.height / 2);
        }
    }
}
