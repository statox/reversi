import PlayerID from '../Player';
import {Game, Board} from '../game';
import {IA} from './IA';

export class IAAlphaBeta extends IA {
    maxEvaluation: number;
    minEvaluation: number;
    maxDepth: number;

    constructor(player: PlayerID, game: Game, maxDepth?: number) {
        super(player, game);
        this.strategy = 'alphabeta';
        this.maxEvaluation = game.board.D * game.board.D + 1;
        this.minEvaluation = -this.maxEvaluation;
        this.maxDepth = maxDepth || 3;
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
            childBoard.placeDisk(this.playerID, cell);

            const moveScore = this.alphabeta(childBoard, this.maxDepth, this.minEvaluation, this.maxEvaluation, true);
            if (moveScore > bestMoveScore) {
                bestMove = cell;
                bestMoveScore = moveScore;
            }
        }

        // HACK
        // I think its needed when the player is in position of returning
        // all the disks of the board but I'm not sure why
        if (!bestMove) {
            // console.log('min max AI HACK');
            bestMove = possibleCells[0];
        }

        // console.log(`Evaluated ${this.nodesEvaluated} nodes`);
        return bestMove;
    };

    alphabeta(board: Board, depth: number, alpha: number, beta: number, maximizingPlayer: boolean) {
        this.nodesEvaluated += 1;
        if (depth === 0 || board.isTerminal()) {
            return this.evaluateBoard(board, this.playerID);
        }

        if (maximizingPlayer) {
            let v = this.minEvaluation;
            for (let move of board.findOpenCells(this.playerID)) {
                // copy board and place disk in the copy
                const childBoard = new Board(board.cells);
                childBoard.placeDisk(this.playerID, move);
                const childBoardEvaluation = this.alphabeta(childBoard, depth - 1, alpha, beta, !maximizingPlayer);

                v = Math.max(v, childBoardEvaluation);
                if (v >= beta) {
                    return v;
                }
                alpha = Math.max(alpha, v);
            }
            return v;
        }

        let v = this.maxEvaluation;
        for (let move of board.findOpenCells(this.playerID)) {
            // copy board and place disk in the copy
            const childBoard = new Board(board.cells);
            childBoard.placeDisk(this.playerID, move);
            const childBoardEvaluation = this.alphabeta(childBoard, depth - 1, alpha, beta, !maximizingPlayer);

            v = Math.min(v, childBoardEvaluation);
            if (alpha >= v) {
                return v;
            }
            beta = Math.min(beta, v);
        }
        return v;
    }

    evaluateBoard(board: Board, player: PlayerID) {
        let playerScore = 0;
        let otherPlayerScore = 0;

        board.cells.forEach((cellLine) => {
            cellLine.forEach((cell) => {
                if (cell === player) {
                    playerScore++;
                } else if (cell !== undefined) {
                    otherPlayerScore++;
                }
            });
        });

        return playerScore - otherPlayerScore;
    }
}
