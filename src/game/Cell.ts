import P5 from 'p5';
import PlayerID from '../Player';

export class Cell {
    value: undefined | PlayerID;
    boardPos: P5.Vector;

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

    draw(p5: P5, size: number) {
        if (this.value === undefined) {
            return;
        }

        p5.push();
        const y = this.boardPos.y * size;
        const x = this.boardPos.x * size;

        p5.translate(x, y);
        if (this.value === 1) {
            p5.fill(0);
        } else {
            p5.fill(250);
        }
        p5.circle(size / 2, size / 2, size * 0.9);
        p5.pop();
    }
}
