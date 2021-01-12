import PlayerID from './Player';
import Game from './Game';
import Board from './Board';
import Cell from './Cell';

export default class IA {
    playerID: PlayerID;
    readonly _game: Game;
    strategy: 'mostcells' | 'random';

    constructor(player: PlayerID, game: Game) {
        this.playerID = player;
        this._game = game;
        this.strategy = 'random';
    }

    play() {
        const bestMove = this.chooseBestMove(this.playerID);
        this._game.placeDisk(bestMove);
    }

    chooseBestMove(player) {
        if (this.strategy === 'mostcells') {
            return this.chooseMostCells(this.playerID);
        }
        if (this.strategy === 'random') {
            return this.chooseRandom(this.playerID);
        }
    }

    findOpenCells(player: PlayerID, board: Board) {
        const stack: Cell[] = [];
        const openCells = [];
        const visited = new Set();
        stack.push(board.cells[Math.ceil(board.D / 2)][Math.ceil(board.D / 2)]);

        while (stack.length) {
            const currentCell = stack.pop();

            if (visited.has(currentCell)) {
                continue;
            }
            visited.add(currentCell);

            if (currentCell.value === undefined) {
                openCells.push(currentCell);
                continue;
            }

            const {x, y} = currentCell.boardPos;

            if (x > 0) {
                if (y > 0) {
                    stack.push(board.cells[y - 1][x - 1]);
                }
                stack.push(board.cells[y][x - 1]);
                if (y < board.D - 1) {
                    stack.push(board.cells[y + 1][x - 1]);
                }
            }
            if (y > 0) {
                stack.push(board.cells[y - 1][x]);
            }
            if (y < board.D - 1) {
                stack.push(board.cells[y + 1][x]);
            }
            if (x < board.D - 1) {
                if (y > 0) {
                    stack.push(board.cells[y - 1][x + 1]);
                }
                stack.push(board.cells[y][x + 1]);
                if (y < board.D - 1) {
                    stack.push(board.cells[y + 1][x + 1]);
                }
            }
        }

        return openCells.filter((c) => this._game.board.getCellsToFlip(player, c).length > 0);
    }
    chooseRandom(player: PlayerID) {
        const possibleCells = this.findOpenCells(player, this._game.board);
        const randIndex = Math.ceil(Math.random() * possibleCells.length - 1);
        const chosenCell = possibleCells[randIndex];
        console.log(possibleCells, randIndex, chosenCell);
        return {i: chosenCell.boardPos.x, j: chosenCell.boardPos.y};
    }

    chooseMostCells(player: PlayerID) {
        let bestMove;
        let bestMoveScore = 0;

        const possibleCells = this.findOpenCells(player, this._game.board);
        for (let cell of possibleCells) {
            const cellsToFlip = this._game.board.getCellsToFlip(this.playerID, cell);
            if (cellsToFlip.length > bestMoveScore) {
                bestMove = {i: cell.boardPos.x, j: cell.boardPos.y};
                bestMoveScore = cellsToFlip.length;
            }
        }

        return bestMove;
    }
}
