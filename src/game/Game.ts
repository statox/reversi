import {Board} from './Board';
import PlayerID from '../Player';

export class Game {
    board: Board;
    currentPlayer: PlayerID;
    scores: Object; // TODO Don't be lazy and type that properly
    isOver: boolean;

    constructor() {
        this.board = new Board();
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
}
