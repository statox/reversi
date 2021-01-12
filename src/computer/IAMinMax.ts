import PlayerID from '../Player';
import {Game, Board} from '../game';
import {IA} from './IA';

export class IAMinMax extends IA {
    maxEvaluation: number;
    minEvaluation: number;
    maxDepth: number;
    nodesEvaluated: number;

    constructor(player: PlayerID, game: Game, maxDepth?: number) {
        super(player, game);
        this.strategy = 'minmax';
        this.maxEvaluation = game.board.D * game.board.D + 1;
        this.minEvaluation = -this.maxEvaluation;
        this.maxDepth = maxDepth | 3;
    }

    chooseMove = (player) => {
        let bestMove;
        let bestMoveScore = this.minEvaluation;
        this.nodesEvaluated = 0;

        const possibleCells = this._game.board.findOpenCells(player);
        if (!possibleCells.length) {
            return;
        }

        for (let cell of possibleCells) {
            const childBoard = new Board(this._game.board.cells);
            childBoard.placeDiskWithCell(this.playerID, cell);

            const moveScore = this.minmax(childBoard, this.maxDepth, true);
            if (moveScore > bestMoveScore) {
                bestMove = cell;
                bestMoveScore = moveScore;
            }
            this.deleteObjects(childBoard);
        }

        // HACK
        // I think its needed when the player is in position of returning
        // all the disks of the board but I'm not sure why
        if (!bestMove) {
            // console.log('min max AI HACK');
            bestMove = possibleCells[0];
        }

        // console.log(`Evaluated ${this.nodesEvaluated} nodes`);
        return {i: bestMove.boardPos.x, j: bestMove.boardPos.y};
    };

    deleteObjects(board: Board) {
        for (let j = 0; j < board.D; j++) {
            for (let i = 0; i < board.D; i++) {
                delete board.cells[j][i];
            }
        }
        for (let j = 0; j < board.D; j++) {
            delete board.cells[j];
        }
        delete board.cells;

        for (let i = 0; i < board.openCells.length; i++) {
            delete board.openCells[i];
        }

        delete board.lastPlayed;
        delete board.lastFailed;
    }

    minmax(board: Board, depth: number, maximizingPlayer: boolean) {
        this.nodesEvaluated += 1;
        if (depth === 0 || board.isTerminal()) {
            return this.evaluateBoard(board, this.playerID);
        }

        if (maximizingPlayer) {
            let localMaxEvaluation = this.minEvaluation;
            for (let move of board.findOpenCells(this.playerID)) {
                // copy board and place disk in the copy
                const childBoard = new Board(board.cells);
                childBoard.placeDiskWithCell(this.playerID, move);
                const childBoardEvaluation = this.minmax(childBoard, depth - 1, !maximizingPlayer);
                this.deleteObjects(childBoard);
                if (childBoardEvaluation > localMaxEvaluation) {
                    localMaxEvaluation = childBoardEvaluation;
                }
            }
            return localMaxEvaluation;
        }

        let localMinEvaluation = this.maxEvaluation;
        const otherPlayer = this.playerID === 1 ? 2 : 1;
        for (let move of board.findOpenCells(otherPlayer)) {
            // copy board and place disk in the copy
            const childBoard = new Board(board.cells);
            childBoard.placeDiskWithCell(otherPlayer, move);
            const childBoardEvaluation = this.minmax(childBoard, depth - 1, !maximizingPlayer);
            this.deleteObjects(childBoard);
            if (childBoardEvaluation < localMinEvaluation) {
                localMinEvaluation = childBoardEvaluation;
            }
        }
        return localMinEvaluation;
    }

    evaluateBoard(board: Board, player: PlayerID) {
        let playerScore = 0;
        let otherPlayerScore = 0;
        board.cells.flat().forEach((c) => {
            if (c.value === player) {
                playerScore++;
            } else if (c.value !== undefined) {
                otherPlayerScore++;
            }
        });

        return playerScore - otherPlayerScore;
    }
}
