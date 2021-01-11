import P5 from 'p5';
import Cell from './Cell';
import PlayerID from './Player';

export default class Board {
    p5: P5;
    D: number;
    cells: Cell[][]; // TODO: Strong typing

    constructor(p5: P5) {
        this.p5 = p5;
        this.D = 8;

        this.cells = [];
        for (let j = 0; j < this.D; j++) {
            this.cells.push([]);
            for (let i = 0; i < this.D; i++) {
                this.cells[j].push(new Cell(this.p5, p5.createVector(i, j), undefined));
            }
        }

        this.cells[3][3].value = 1;
        this.cells[3][4].value = 2;
        this.cells[4][3].value = 2;
        this.cells[4][4].value = 1;
    }

    draw() {
        const p5 = this.p5;
        const d = Math.min(p5.width, p5.height) / this.D;
        for (let j = 0; j < this.D; j++) {
            const y = j * d;
            for (let i = 0; i < this.D; i++) {
                const x = i * d;
                p5.push();
                p5.translate(x, y);
                p5.stroke(0);
                p5.fill(0, 150, 0);
                p5.square(0, 0, d);
                p5.pop();

                this.cells[j][i].draw(d);
            }
        }
    }

    xyToIJ(coord: {x: number; y: number}) {
        const {x, y} = coord;
        const d = Math.min(this.p5.width, this.p5.height) / this.D;
        const i = Math.floor(x / d);
        const j = Math.floor(y / d);
        if (i >= 0 && j >= 0 && i < this.D && j < this.D) {
            return {i, j};
        }
        return;
    }

    placeDisk(player: PlayerID, coord: {i: number; j: number}) {
        const {i, j} = coord;
        if (!this.cells[j] || !this.cells[j][i]) {
            return false;
        }

        const cell = this.cells[j][i];
        const cellsToFlip = this.getCellsToFlip(player, cell);
        if (!cellsToFlip.length) {
            return false;
        }
        cell.value = player;
        cellsToFlip.forEach((c) => c.flip());
        return true;
    }

    getCellsToFlip(player: PlayerID, cell?: Cell) {
        if (!cell) {
            return [];
        }
        if (cell.value !== undefined) {
            return [];
        }
        let otherPlayer = 1;
        if (player === 1) {
            otherPlayer = 2;
        }
        const {x, y} = cell.boardPos;

        const cellsToFlip = [];

        // LEFT
        let dx = x - 1;
        let dy = y;
        let tmpCells = [];
        while (dx >= 0 && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dx--;
        }
        if (dx >= 0 && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        // RIGHT
        dx = x + 1;
        dy = y;
        tmpCells = [];
        while (dx < this.D && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dx++;
        }
        if (dx < this.D && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        // TOP
        dx = x;
        dy = y - 1;
        tmpCells = [];
        while (dy >= 0 && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dy--;
        }
        if (dy >= 0 && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        // BOTTOM
        dx = x;
        dy = y + 1;
        tmpCells = [];
        while (dy < this.D && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dy++;
        }
        if (dy < this.D && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        // TOP LEFT
        dx = x - 1;
        dy = y - 1;
        tmpCells = [];
        while (dx >= 0 && dy >= 0 && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dx--;
            dy--;
        }
        if (dx >= 0 && dy >= 0 && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        // TOP RIGHT
        dx = x + 1;
        dy = y - 1;
        tmpCells = [];
        while (dx < this.D && dy >= 0 && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dx++;
            dy--;
        }
        if (dx < this.D && dy >= 0 && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        // BOTOM LEFT
        dx = x - 1;
        dy = y + 1;
        tmpCells = [];
        while (dx >= 0 && dy < this.D && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dx--;
            dy++;
        }
        if (dx >= 0 && dy < this.D && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        // BOTOM RIGHT
        dx = x + 1;
        dy = y + 1;
        tmpCells = [];
        while (dx < this.D && dy < this.D && this.cells[dy][dx].value === otherPlayer) {
            tmpCells.push(this.cells[dy][dx]);
            dx++;
            dy++;
        }
        if (dx < this.D && dy < this.D && this.cells[dy][dx].value === player) {
            cellsToFlip.push(...tmpCells);
        }

        return cellsToFlip;
    }
}
