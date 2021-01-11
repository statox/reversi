import P5 from 'p5';
import './styles.scss';

import Game from './Game';
import IA from './IA';

const sketch = (p5: P5) => {
    let game: Game;
    let ia: IA;
    let playerCanClick = true;

    // The sketch setup method
    p5.setup = () => {
        // Creating and positioning the canvas
        const canvas = p5.createCanvas(800, 800);
        canvas.parent('app');

        game = new Game(p5);
        ia = new IA(2, game);
    };

    // The sketch draw method
    p5.draw = () => {
        p5.background(30, 200, 30);
        game.draw();
    };

    p5.mousePressed = () => {
        if (!playerCanClick) {
            return;
        }
        const coord = game.board.xyToIJ({x: p5.mouseX, y: p5.mouseY});
        if (game.placeDisk(coord)) {
            playerCanClick = false;
            setTimeout(() => {
                playerCanClick = true;
                ia.play();
            }, 1000);
        }
    };
};

new P5(sketch);
