import PlayerID from '../Player';
import {Game} from '../game';

export abstract class IA {
    playerID: PlayerID;
    readonly _game: Game;
    strategy: 'mostcells' | 'random' | 'minmax';
    abstract chooseMove: (PlayerID) => {i: number; j: number};

    constructor(player: PlayerID, game: Game) {
        this.playerID = player;
        this._game = game;
    }

    play() {
        const move = this.chooseMove(this.playerID);
        this._game.placeDisk(move);
    }
}
