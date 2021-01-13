/*
 * Use with
 * npx ts-node src/tests/test.ts
 * node -r ts-node/register/transpile-only src/tests/tests.ts
 * node --inspect-break -r ts-node/register/transpile-only src/tests/tests.ts
 */

import heapdump from 'heapdump';
import {Game} from '../game';
import {IA, IARandom, IAMostCells, IAMinMax} from '../computer';

const playOneGame = (gameNumber: number) => {
    let evaluatedNodes = 0;
    const game = new Game();
    const ia1 = new IARandom(1, game);
    // const ia1 = new IAMostCells(1, game);
    const ia2 = new IAMinMax(2, game, 3);
    // const ia2 = new IAMostCells(2, game);
    // const ia2 = new IARandom(2, game);

    let turn = 0;
    while (!game.isOver) {
        turn++;
        if (gameNumber % 2) {
            ia1.play();
            ia2.play();
        } else {
            ia1.play();
            ia2.play();
        }
        evaluatedNodes += ia2.nodesEvaluated;
    }

    // console.log(`Evaluated ${evaluatedNodes} nodes`);
    let winner = 1;
    if (game.scores[2] > game.scores[1]) {
        winner = 2;
    }

    return winner;
};

const showStats = (winnerCount: {1: number; 2: number}, turns: number) => {
    console.log(`Player 1 : ${(winnerCount[1] * 100) / turns}% - ${winnerCount[1]}`);
    console.log(`Player 2 : ${(winnerCount[2] * 100) / turns}% - ${winnerCount[2]}`);
};

const main = () => {
    // const turns = 10000;
    const turns = 1000;
    // const turns = 5;
    const winnerCount = {1: 0, 2: 0};

    for (let turn = 0; turn < turns; turn++) {
        // console.log(turn);
        if (turn % (turns / 100) === 0) {
            console.log(`\t${(turn * 100) / turns}%`);
            showStats(winnerCount, turn);
        }
        const winner = playOneGame(turn);
        winnerCount[winner] += 1;
    }

    console.log(showStats(winnerCount, turns));
};

function oneGameThenDump() {
    playOneGame(1);
    console.log('writting dump');
    heapdump.writeSnapshot(function (err, filename) {
        console.log('dump written to', filename);
    });
}

main();
// oneGameThenDump();

// Random vs. random
// Player 1 : 49.11% - 4911
// Player 2 : 50.89% - 5089

// Random vs. most cells
// Player 1 : 42.82% - 4282
// Player 2 : 57.18% - 5718

// Random vs minmax (depth 3)
//Player 1 : 27.857142857142858% - 117
//Player 2 : 72.14285714285714% - 303
