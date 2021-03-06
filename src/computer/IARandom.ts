import PlayerID from '../Player';
import {Game} from '../game';
import {IA} from './IA';

export class IARandom extends IA {
    constructor(player: PlayerID, game: Game) {
        super(player, game);
        this.strategy = 'random';
    }

    chooseMove = (player) => {
        const possibleCells = this._game.board.findOpenCells(player);
        if (!possibleCells.length) {
            return;
        }
        const randIndex = Math.ceil(Math.random() * possibleCells.length - 1);
        const chosenCell = possibleCells[randIndex];
        return chosenCell;
    };
}
