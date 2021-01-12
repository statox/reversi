import PlayerID from '../Player';
import Game from '../Game';

export default abstract class IA {
    playerID: PlayerID;
    readonly _game: Game;
    strategy: 'mostcells' | 'random';
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
