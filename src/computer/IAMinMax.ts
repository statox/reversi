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

            const moveScore = this.minmax(childBoard, this.maxDepth, true);
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
                childBoard.placeDisk(this.playerID, move);
                const childBoardEvaluation = this.minmax(childBoard, depth - 1, !maximizingPlayer);
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
            childBoard.placeDisk(otherPlayer, move);
            const childBoardEvaluation = this.minmax(childBoard, depth - 1, !maximizingPlayer);
            if (childBoardEvaluation < localMinEvaluation) {
                localMinEvaluation = childBoardEvaluation;
            }
        }
        return localMinEvaluation;
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
