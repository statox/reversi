import {BoardCoord, ScreenCoord} from '../Coord';
import PlayerID from '../Player';

export class Board {
    D: number;
    cells: PlayerID[][];
    lastPlayed: BoardCoord | undefined;
    lastFailed: BoardCoord | undefined;
    openCells: BoardCoord[];

    constructor(cells?: PlayerID[][]) {
        this.D = 8;

        this.cells = [];

        if (!cells) {
            for (let j = 0; j < this.D; j++) {
                this.cells.push([]);
                for (let i = 0; i < this.D; i++) {
                    this.cells[j].push(undefined);
                }
            }

            this.cells[3][3] = 1;
            this.cells[3][4] = 2;
            this.cells[4][3] = 2;
            this.cells[4][4] = 1;
        } else {
            for (let j = 0; j < this.D; j++) {
                this.cells.push([]);
                for (let i = 0; i < this.D; i++) {
                    this.cells[j].push(cells[j][i]);
                }
            }
        }

        this.openCells = [];
    }

    isCoordInBoard(coord: BoardCoord) {
        const {i, j} = coord;
        return i >= 0 && i < this.D && j >= 0 && j < this.D;
    }

    xyToIJ(dim: {width; height}, coord: ScreenCoord): BoardCoord {
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

    placeDisk(player: PlayerID, coord: BoardCoord) {
        const {i, j} = coord;
        if (!this.isCoordInBoard(coord)) {
            return false;
        }

        const cellsToFlip = this.getCellsToFlip(player, coord);
        if (!cellsToFlip.length) {
            this.setFailedPlay(coord);
            return false;
        }
        this.cells[j][i] = player;
        this.setLastPlayed(coord);
        cellsToFlip.forEach((c) => this.flipCell(c));
        return true;
    }

    flipCell(coord: BoardCoord) {
        const {i, j} = coord;
        const currentValue = this.cells[j][i];
        if (currentValue === undefined) {
            return;
        }
        if (currentValue === 1) {
            this.cells[j][i] = 2;
            return;
        }
        if (currentValue === 2) {
            this.cells[j][i] = 1;
            return;
        }
    }

    setLastPlayed(c: BoardCoord) {
        this.lastPlayed = c;
    }

    setFailedPlay(c: BoardCoord) {
        this.lastFailed = c;
    }

    setOpenCells(cs: BoardCoord[]) {
        this.openCells = cs;
    }

    getCellsToFlip(player: PlayerID, coord?: BoardCoord): BoardCoord[] {
        if (!coord || !this.isCoordInBoard(coord)) {
            return [];
        }
        const {i, j} = coord;
        if (this.cells[j][i] !== undefined) {
            return [];
        }

        let otherPlayer = 1;
        if (player === 1) {
            otherPlayer = 2;
        }

        const cellsToFlip: BoardCoord[] = [];

        // LEFT
        let dx = i - 1;
        let dy = j;
        let tmpCells: BoardCoord[] = [];
        while (dx >= 0 && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dx--;
        }
        if (dx >= 0 && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        // RIGHT
        dx = i + 1;
        dy = j;
        tmpCells = [];
        while (dx < this.D && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dx++;
        }
        if (dx < this.D && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        // TOP
        dx = i;
        dy = j - 1;
        tmpCells = [];
        while (dy >= 0 && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dy--;
        }
        if (dy >= 0 && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        // BOTTOM
        dx = i;
        dy = j + 1;
        tmpCells = [];
        while (dy < this.D && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dy++;
        }
        if (dy < this.D && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        // TOP LEFT
        dx = i - 1;
        dy = j - 1;
        tmpCells = [];
        while (dx >= 0 && dy >= 0 && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dx--;
            dy--;
        }
        if (dx >= 0 && dy >= 0 && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        // TOP RIGHT
        dx = i + 1;
        dy = j - 1;
        tmpCells = [];
        while (dx < this.D && dy >= 0 && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dx++;
            dy--;
        }
        if (dx < this.D && dy >= 0 && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        // BOTOM LEFT
        dx = i - 1;
        dy = j + 1;
        tmpCells = [];
        while (dx >= 0 && dy < this.D && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dx--;
            dy++;
        }
        if (dx >= 0 && dy < this.D && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        // BOTOM RIGHT
        dx = i + 1;
        dy = j + 1;
        tmpCells = [];
        while (dx < this.D && dy < this.D && this.cells[dy][dx] === otherPlayer) {
            tmpCells.push({i: dx, j: dy});
            dx++;
            dy++;
        }
        if (dx < this.D && dy < this.D && this.cells[dy][dx] === player) {
            cellsToFlip.push(...tmpCells);
        }

        return cellsToFlip;
    }

    findOpenCells(player: PlayerID): BoardCoord[] {
        const stack: BoardCoord[] = [];
        const openCells = [];
        const visited = new Set();
        stack.push({i: Math.ceil(this.D / 2), j: Math.ceil(this.D / 2)});

        const coordAsString = (coord: BoardCoord) => `${coord.i}-${coord.j}`;

        while (stack.length) {
            const currentCell = stack.pop();
            const cellKey = coordAsString(currentCell);

            if (visited.has(cellKey)) {
                continue;
            }
            visited.add(cellKey);

            const {i, j} = currentCell;
            if (this.cells[j][i] === undefined) {
                openCells.push(currentCell);
                continue;
            }

            if (i > 0) {
                if (j > 0) {
                    stack.push({i: i - 1, j: j - 1});
                }
                stack.push({i: i - 1, j});
                if (j < this.D - 1) {
                    stack.push({i: i - 1, j: j + 1});
                }
            }
            if (j > 0) {
                stack.push({i, j: j - 1});
            }
            if (j < this.D - 1) {
                stack.push({i, j: j + 1});
            }
            if (i < this.D - 1) {
                if (j > 0) {
                    stack.push({i: i + 1, j: j - 1});
                }
                stack.push({i: i + 1, j});
                if (j < this.D - 1) {
                    stack.push({i: i + 1, j: j + 1});
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
