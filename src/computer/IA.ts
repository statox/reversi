import PlayerID from '../Player';
import {Game} from '../game';
import {BoardCoord} from '../Coord';

export abstract class IA {
    playerID: PlayerID;
    nodesEvaluated: number;
    readonly _game: Game;
    strategy: 'mostcells' | 'random' | 'minmax' | 'alphabeta';
    abstract chooseMove: (PlayerID) => BoardCoord;

    constructor(player: PlayerID, game: Game) {
        this.playerID = player;
        this._game = game;
        this.nodesEvaluated = 0;
    }

    play() {
        const move = this.chooseMove(this.playerID);
        this._game.placeDisk(move);
    }
}
