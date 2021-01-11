import P5 from 'p5';

export default class MyCircle {
    p5: P5;
    pos: P5.Vector;
    r: number;
    direction: 1 | -1;

    constructor(p5: P5, pos: P5.Vector, r: number) {
        this.p5 = p5;
        this.pos = pos;
        this.r = r;
        this.direction = 1;
    }

    draw() {
        const p5 = this.p5; // just for convenience

        p5.push();

        p5.translate(this.pos);
        p5.noStroke();
        p5.fill('orange');
        p5.ellipse(0, 0, this.r * 2);

        p5.pop();
    }

    update() {
        const p5 = this.p5; // just for convenience

        this.pos.x += this.direction;
        if (this.pos.x + this.r > p5.width) {
            this.direction = -1;
        }
        if (this.pos.x - this.r < 0) {
            this.direction = 1;
        }
    }
}
