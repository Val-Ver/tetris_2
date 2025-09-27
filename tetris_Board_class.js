class Board {
    cols = 0;
    rows = 0;
    grid = [];
    gameover = false;
    score = false;

    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.createGrid();
    }

    createGrid() {
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = 0;
            }
        }
    }

    generateFigureSequence() {
        let sequence = ['I', 'L', 'T', 'O', 'S', 'Z', 'J'];
        let figureSequence = [];
        for (let i = 0; i < sequence.length; i++) {
            figureSequence.push(sequence[this.getRandomInt(0, sequence.length - 1)]);
        }
        return figureSequence;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getCurrentFigure(figureSequence) {
        let figureCurrentName = figureSequence.shift();
        let figureCurrentMatrix = this.initMatrix(figureCurrentName);
        let col = this.cols / 2 - Math.ceil(figureCurrentMatrix[0].length / 2);
        let row;

        if (figureCurrentName == 'S' ||
            figureCurrentName == 'Z' ||
            figureCurrentName == 'O') {
            row = -2;
        } else {
            row = -1;
        }
        let figureCurrent = {
            name: figureCurrentName,
            matrix: figureCurrentMatrix,
            row: row,
            col: col
        };
        return figureCurrent;
    }

    initMatrix(nameMatrix) {
        const tetrominos = {
            'I': [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
            'O': [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
            'Z': [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
            'S': [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
            'T': [[1, 1, 1], [0, 1, 0], [0, 0, 0]],
            'L': [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
            'J': [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
        };
        return tetrominos[nameMatrix];
    }

    getNextFigure(figureSequence) {
        let nextFigureName = figureSequence[0];
        let figureNext = {
            name: nextFigureName,
            matrix: this.initMatrix(nextFigureName)
        };
        return figureNext;
    }

    isFigureMove(figureCurrent) {
        for (let row = 0; row < figureCurrent.matrix.length; row++) {
            for (let col = 0; col < figureCurrent.matrix[row].length; col++) {
                if (!figureCurrent.matrix[row][col]) {
                    continue;
                }
                if (figureCurrent.row + row >= this.rows ||
                    figureCurrent.col + col >= this.cols ||
                    figureCurrent.col + col < 0) {
                    return false;
                }
                if (figureCurrent.row + row >= 0 &&
                    this.grid[figureCurrent.row + row][figureCurrent.col + col]) {
                    return false;
                }
            }
        }
        return true;
    }

    placeFigureInGameMap(figureCurrent) {
        for (let row = 0; row < figureCurrent.matrix.length; row++) {
            for (let col = 0; col < figureCurrent.matrix[row].length; col++) {
                if (figureCurrent.matrix[row][col]) {
                    if (figureCurrent.row + row < 0) {
                        this.gameover = true;
                        return;
                    }
                    this.grid[figureCurrent.row + row][figureCurrent.col + col] = figureCurrent.name;
                }
            }
        }
    }

    rotateFigure(figureCurrent) {
        if (!figureCurrent) { return; }
        let rotateFigureMatrix = [];
        for (let row = 0; row < figureCurrent.matrix.length; row++) {
            let rotateRow = [];
            for (let col = 0; col < figureCurrent.matrix[row].length; col++) {
                rotateRow.push(figureCurrent.matrix[figureCurrent.matrix.length - 1 - col][row]);
            }
            rotateFigureMatrix.push(rotateRow);
        }

        let rotateFigure = {
            name: figureCurrent.name,
            matrix: rotateFigureMatrix,
            row: figureCurrent.row,
            col: figureCurrent.col
        };
        return rotateFigure;
    }

    checkLine() {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell != 0)) {
                this.grid.splice(row, 1);
                let newRow = [];
                for (let col = 0; col < this.cols; col++) {
                    newRow.push(0);
                }
                this.grid.unshift(newRow);
                row++;
                this.score = true;
            }
        }
    }
}


