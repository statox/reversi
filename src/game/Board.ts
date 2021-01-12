import {Cell} from './Cell';
import PlayerID from '../Player';

export class Board {
    D: number;
    cells: Cell[][]; // TODO: Strong typing
    lastPlayed: Cell | undefined;
    lastFailed: Cell | undefined;
    openCells: Cell[];

    constructor(cells?: Cell[][]) {
        this.D = 8;

        this.cells = [];

        if (!cells) {
            for (let j = 0; j < this.D; j++) {
                this.cells.push([]);
                for (let i = 0; i < this.D; i++) {
                    this.cells[j].push(new Cell({x: i, y: j}, undefined));
                }
            }

            this.cells[3][3].value = 1;
            this.cells[3][4].value = 2;
            this.cells[4][3].value = 2;
            this.cells[4][4].value = 1;
        } else {
            for (let j = 0; j < this.D; j++) {
                this.cells.push([]);
                for (let i = 0; i < this.D; i++) {
                    this.cells[j].push(new Cell({x: i, y: j}, cells[j][i].value));
                }
            }
        }

        this.openCells = [];
    }

    xyToIJ(dim: {width; height}, coord: {x: number; y: number}) {
        const {x, y} = coord;
        const {width, height} = dim;
        const d = Math.min(width, height) / this.D;
        const i = Math.floor(x / d);
        const j = Math.floor(y / d);
        if (i >= 0 && j >= 0 && i < this.D && j < this.D) {
            return {i, j};
        }
        return;
    }

    placeDiskWithCell(player: PlayerID, cell: Cell) {
        if (!cell) {
            return false;
        }
        const i = cell.boardPos.x;
        const j = cell.boardPos.y;
        return this.placeDisk(player, {i, j});
    }

    placeDisk(player: PlayerID, coord: {i: number; j: number}) {
        const {i, j} = coord;
        if (!this.cells[j] || !this.cells[j][i]) {
            return false;
        }

        const cell = this.cells[j][i];
        const cellsToFlip = this.getCellsToFlip(player, cell);
        if (!cellsToFlip.length) {
            this.setFailedPlay(cell);
            return false;
        }
        cell.value = player;
        this.setLastPlayed(cell);
        cellsToFlip.forEach((c) => c.flip());
        return true;
    }

    setLastPlayed(c: Cell) {
        this.lastPlayed = c;
        setTimeout(() => (this.lastPlayed = undefined), 1000);
    }

    setFailedPlay(c: Cell) {
        this.lastFailed = c;
        setTimeout(() => (this.lastFailed = undefined), 500);
    }

    setOpenCells(cs: Cell[]) {
        this.openCells = cs;
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

    findOpenCells(player: PlayerID) {
        const stack: Cell[] = [];
        const openCells = [];
        const visited = new Set();
        stack.push(this.cells[Math.ceil(this.D / 2)][Math.ceil(this.D / 2)]);

        while (stack.length) {
            const currentCell = stack.pop();

            if (visited.has(currentCell)) {
                continue;
            }
            visited.add(currentCell);

            if (currentCell.value === undefined) {
                openCells.push(currentCell);
                continue;
            }

            const {x, y} = currentCell.boardPos;

            if (x > 0) {
                if (y > 0) {
                    stack.push(this.cells[y - 1][x - 1]);
                }
                stack.push(this.cells[y][x - 1]);
                if (y < this.D - 1) {
                    stack.push(this.cells[y + 1][x - 1]);
                }
            }
            if (y > 0) {
                stack.push(this.cells[y - 1][x]);
            }
            if (y < this.D - 1) {
                stack.push(this.cells[y + 1][x]);
            }
            if (x < this.D - 1) {
                if (y > 0) {
                    stack.push(this.cells[y - 1][x + 1]);
                }
                stack.push(this.cells[y][x + 1]);
                if (y < this.D - 1) {
                    stack.push(this.cells[y + 1][x + 1]);
                }
            }
        }

        return openCells.filter((c) => this.getCellsToFlip(player, c).length > 0);
    }

    isTerminal() {
        if (this.findOpenCells(1).length === 0 && this.findOpenCells(2).length === 0) {
            return true;
        }
    }
}
