import PlayerID from '../Player';
import {Game} from '../game';
import {IA} from './IA';

export class IAMostCells extends IA {
    constructor(player: PlayerID, game: Game) {
        super(player, game);
        this.strategy = 'mostcells';
    }

    chooseMove = (player) => {
        let bestMove;
        let bestMoveScore = 0;

        const possibleCells = this._game.board.findOpenCells(player);
        for (let cell of possibleCells) {
            const cellsToFlip = this._game.board.getCellsToFlip(this.playerID, cell);
            if (cellsToFlip.length > bestMoveScore) {
                bestMove = {i: cell.boardPos.x, j: cell.boardPos.y};
                bestMoveScore = cellsToFlip.length;
            }
        }

        return bestMove;
    };
}
