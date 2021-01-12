import PlayerID from '../Player';

export class Cell {
    value: undefined | PlayerID;
    boardPos: {x: number; y: number};

    constructor(pos, value?) {
        this.boardPos = pos;
        this.value = value;
    }

    flip() {
        if (!this.value) {
            return;
        }
        if (this.value === 1) {
            this.value = 2;
        } else {
            this.value = 1;
        }
    }
}
