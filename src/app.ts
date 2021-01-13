import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './styles.scss';

import {Game} from './game';
import {IA, IARandom, IAMostCells, IAMinMax, IAAlphaBeta} from './computer';
import {P5Drawer} from './drawingUtils';

const sketch = (p5: P5) => {
    let p5Drawer: P5Drawer;
    let game: Game;
    let ia: IA;
    let iaPlayer: IA;
    let playerCanClick = true;
    let autoPlay: () => void;
    let autoPlayBtn: P5.Element;
    let autoPlayFull: () => void;
    let autoPlayFullBtn: P5.Element;

    autoPlay = () => {
        if (playerCanClick && game.currentPlayer === 1) {
            iaPlayer.play();
            playerCanClick = false;
            setTimeout(() => {
                playerCanClick = true;
                ia.play();
                const openCells = game.board.findOpenCells(1);
                game.board.setOpenCells(openCells);
            }, 1000);
        }
    };

    autoPlayFull = () => {
        if (game.currentPlayer === 1) {
            iaPlayer.play();
        } else {
            ia.play();
        }
        setTimeout(autoPlayFull, 100);
    };

    // The sketch setup method
    p5.setup = () => {
        // Creating and positioning the canvas
        const canvas = p5.createCanvas(800, 800);
        canvas.parent('app');

        p5Drawer = new P5Drawer(p5);

        game = new Game();
        ia = new IAAlphaBeta(2, game);
        iaPlayer = new IAMostCells(1, game);
        // iaPlayer = new IAMinMax(1, game);

        // Initialize the cells the player can choose
        const openCells = game.board.findOpenCells(1);
        game.board.setOpenCells(openCells);

        autoPlayBtn = p5.createButton('Choose best move');
        autoPlayBtn.mousePressed(autoPlay);

        autoPlayFullBtn = p5.createButton('Autoplay full');
        autoPlayFullBtn.mousePressed(autoPlayFull);
    };

    // The sketch draw method
    p5.draw = () => {
        p5.background(30, 200, 30);
        p5Drawer.drawGame(game);
    };

    p5.mousePressed = () => {
        // Don't allow the player to play if the computer is playing
        if (!playerCanClick) {
            return;
        }
        const coord = game.board.xyToIJ({width: p5.width, height: p5.height}, {x: p5.mouseX, y: p5.mouseY});
        // If the player chose a valid position
        // let the computer play and update the cells player can play
        if (game.placeDisk(coord)) {
            playerCanClick = false;
            setTimeout(() => {
                playerCanClick = true;
                ia.play();
                const openCells = game.board.findOpenCells(1);
                game.board.setOpenCells(openCells);
            }, 1000);
        }
    };
};

new P5(sketch);
