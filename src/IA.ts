import PlayerID from './Player';
import Game from './Game';

export default class IA {
    playerID: PlayerID;
    readonly _game: Game;

    constructor(player: PlayerID, game: Game) {
        this.playerID = player;
        this._game = game;
    }

    play() {
        let bestMove;
        let bestMoveScore = 0;

        for (let j = 0; j < this._game.board.D; j++) {
            for (let i = 0; i < this._game.board.D; i++) {
                const coord = {i, j};
                const cell = this._game.board.cells[j][i];
                const cellsToFlip = this._game.board.getCellsToFlip(this.playerID, cell);
                if (cellsToFlip.length > bestMoveScore) {
                    bestMove = coord;
                    bestMoveScore = cellsToFlip.length;
                }
            }
        }

        this._game.placeDisk(bestMove);
    }
}
