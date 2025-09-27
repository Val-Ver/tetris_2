
window.addEventListener("load", main);

function main() {
    const game = new Game();
}

class Game {
    cols = 10;
    rows = 20;
    cell = 30;

    board = new Board(this.cols, this.rows);
    draw = new Draw(this.cell, this.board);

    figureSequence = [];
    figureNext = {};
    figureCurrent = {};

    game = false;
    pause = false;
    intervalId = null;

    speed = 1000;
    speedPut = 0;
    speedMax = 400;

    score = new Score(this.speed, this.speedMax);

    constructor() {
        this.getStartButton();
        this.getPauseButtonAndPauseClick();
        this.getHandleKeyPress();
        this.getGameButton();
        this.score.updateScore(this.speed);
    }

    getStartButton() {
        const startButton = document.getElementById("startButton");
        startButton.onclick = () => {
            this.beginGame();
        };
    }

    beginGame() {
        if (this.board.gameover) {
            document.getElementById("gameover").remove();
            document.querySelector('.tetris-conteiner').classList.remove('blurred-element');
            document.querySelector('.tetris-button-right').classList.remove('blurred-element');
            document.querySelector('.tetris-button-left').classList.remove('blurred-element');
            

            this.board.gameover = false;
        }
        if (!this.game) {
            this.game = true;
            this.startGame();
        } else {

            this.game = false;
            this.pause = false;
            this.speed = 1000;

            this.playGameInterval();

            this.score.updateGlobalData(this.speed);
            this.score.updateScore(this.speed);

            this.board.createGrid();
            this.draw.cleanPage();
        }
    }

    getPauseButtonAndPauseClick() {
        const pauseButton = document.getElementById("pauseButton");
        pauseButton.onclick = () => {
            this.isPause();
        };
        document.addEventListener('keydown', (event) => {
            if (event.key == ' ') {
                event.preventDefault();
                this.isPause();
            }
        });
    }

    isPause() {
        if (!this.game) { return; }
        if (!this.pause) {
            this.pause = true;
        } else {
            this.pause = false;
        }
        this.playGameInterval();
    }

    startGame() {
        this.game = true;
        this.figureSequence = this.board.generateFigureSequence();

        this.figureCurrent = this.board.getCurrentFigure(this.figureSequence);
        this.figureNext = this.board.getNextFigure(this.figureSequence);
        this.draw.drawNextFigure(this.figureCurrent);

        this.playGameInterval();
    }

    playGameInterval() {
        if (this.intervalId) { clearInterval(this.intervalId); }
        if (!this.game) { return; }
        if (!this.pause && !this.board.gameover) {
            this.intervalId = setInterval(() => {
                this.updateGame();
                this.draw.drawNextFigure(this.figureNext);
                this.draw.drawCurrentFigure(this.figureCurrent);
            }, this.speed);
        }
    }

    updateGame() {
        this.figureCurrent.row++;
        if (!this.board.isFigureMove(this.figureCurrent)) {
            this.figureCurrent.row--;
            this.board.placeFigureInGameMap(this.figureCurrent);
            if (this.board.gameover) {
                this.playGameInterval();
                this.gameOver();
            }
            this.board.checkLine();
            if (this.board.score) {
                this.speed = this.score.addScore(this.speed);
                this.playGameInterval();
            }
            this.figureCurrent = this.board.getCurrentFigure(this.figureSequence);
            if (this.figureSequence.length == 0) {
                this.figureSequence = this.board.generateFigureSequence();
            }
            this.figureNext = this.board.getNextFigure(this.figureSequence);
        }
    }

    getGameButton() {
        const buttonGame = document.querySelectorAll(".game-button");
        buttonGame.forEach((button) => {
            //button.addEventListener('touchdown', () => {

			button.addEventListener('pointerdown', () => {
                if(!this.game || this.pause || this.board.gameover) { return; }
                const valueButton = button.dataset.value;
                this.changeClickOrKeyPress(valueButton);
            });
            if (button.dataset.value == 'ArrowDown') {
                //button.addEventListener('touchup', () => {
                button.addEventListener('pointerup', () => {
                    if(!this.game || this.pause || this.board.gameover) { return; }
                    this.speed = this.speedPut;
                    this.playGameInterval();
                });
            }
        });
    }

    getHandleKeyPress() {
        document.addEventListener('keydown', (event) => {
            if (this.board.gameover || !this.game) { return; }
            this.changeClickOrKeyPress(event.key);
        });
        document.addEventListener('keyup', (event) => {
            if (this.board.gameover || !this.game) { return; }
            if (event.key == 'ArrowDown') {
                this.speed = this.speedPut;
                this.playGameInterval();
            }
        });
    }

    changeClickOrKeyPress(value) {
        this.speedPut = this.speed;
        if (this.pause) { return; }
        switch (value) {
            case 'ArrowUp':
                let rotateTetramino = this.board.rotateFigure(this.figureCurrent);
                if (this.board.isFigureMove(rotateTetramino)) {
                    this.figureCurrent.matrix = rotateTetramino.matrix;
                    this.draw.drawCurrentFigure(this.figureCurrent);
                }
                break;

            case 'ArrowDown':
                this.speed = 10;
                this.playGameInterval();
                if (!this.board.isFigureMove(this.figureCurrent)) {
                    this.figureCurrent.row--;
                }
                break;

            case 'ArrowLeft':
                this.moveLeftOrRight(this.figureCurrent, -1);
                break;

            case 'ArrowRight':
                this.moveLeftOrRight(this.figureCurrent, +1);
                break;

            case 'ArrowDownSpeed':
                while (this.board.isFigureMove(this.figureCurrent)) {
                    this.figureCurrent.row++;
                }
                this.figureCurrent.row--;
                this.draw.drawCurrentFigure(this.figureCurrent);
                break;
            default:
                return;
        }
    }

    moveLeftOrRight(figureCurrent, stepCol) {
        figureCurrent.col += stepCol;
        if (this.board.isFigureMove(figureCurrent)) {
            this.draw.drawCurrentFigure(figureCurrent);
        } else {
            figureCurrent.col -= stepCol;
        }
    }

    gameOver() {
        
        document.querySelector('.tetris-conteiner').classList.add('blurred-element');
        document.querySelector('.tetris-button-right').classList.add('blurred-element');
        document.querySelector('.tetris-button-left').classList.add('blurred-element');

        const gameContainer = document.querySelector('.game-conteiner');

        const gameOverDiv = document.createElement("div");
        gameOverDiv.id = "gameover";
        gameOverDiv.className = 'game-over';

        const grave = document.createElement("div");
        grave.textContent = String.fromCodePoint(0x1F480);
        grave.style.fontSize = '390px';

        const gameOverText = document.createElement("div");
        gameOverText.textContent = 'GAME OVER';
        gameOverText.style.color = 'red';
        gameOverText.style.fontSize = '80px';

        const gameOverButton = document.createElement("button");
        gameOverButton.id = "gameOverButton";


        gameOverButton.textContent = 'GAME AGAIN';
        gameOverButton.addEventListener('click', () => {
            this.beginGame();
        });
        gameOverDiv.appendChild(grave);
        gameOverDiv.appendChild(gameOverText);
        gameOverDiv.appendChild(gameOverButton);
        gameContainer.appendChild(gameOverDiv);
    }
}

