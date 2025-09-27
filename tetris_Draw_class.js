class Draw {
    canvas = document.getElementById("GameBoard");
    ctx = this.canvas.getContext('2d');
    canvasNew = document.getElementById("BoardNextFigure");
    ctxNew = this.canvasNew.getContext('2d');
    cout = 0;
    cols = 0;
    rows = 0;
    grid = [];

    constructor(cell, board) {
        this.cell = cell;
        this.cols = board.cols;
        this.rows = board.rows;
        this.grid = board.grid;
    }

    cleanPage() {
        this.drawGameBoard();
        this.drawNextFigure();
    }

    initColorFigure(nameFigure) {
        const colorTetrominos = {
            'I': 'cyan',
            'O': 'yellow',
            'Z': 'purple',
            'S': 'green',
            'T': 'red',
            'L': 'blue',
            'J': 'orange'
        };
        return colorTetrominos[nameFigure];
    }

    drawNextFigure(figureNext) {
        this.ctxNew.clearRect(0, 0, this.cell * 4 + 5, this.cell * 4 + 5);
        this.ctxNew.lineWidth = 1;
        this.ctxNew.strokeStyle = "black";
        this.ctxNew.strokeRect(0, 0, this.cell * 4 + 5, this.cell * 4 + 5);
        this.ctxNew.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.ctxNew.fillRect(0, 0, this.cell * 4 + 5, this.cell * 4 + 5);

        if (figureNext) {
            let x = 0;
            let y = 3;
            if (figureNext.matrix.length != 4) {
                x = this.cell / 2;
                y = this.cell / 2;
            }
            this.drawCellFigure(this.ctxNew, x, y, figureNext);
        }
    }

    drawGameBoard() {
        let x = 0;
        let y = 0;

        const lineWidth = 3;
        this.ctx.clearRect(x, y, this.cell * this.cols, this.cell * this.rows);

        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, this.cell * this.cols, this.cell * this.rows);

        this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.ctx.fillRect(x, y, this.cell * this.cols, this.cell * this.rows);

        if (this.grid) {
            let fillStyle;
            const lineWidth = 3;
            this.ctx.lineWidth = lineWidth;
            for (let row = 0; row < this.grid.length; row++) {
                for (let col = 0; col < this.grid[row].length; col++) {
                    this.ctx.fillStyle = "rgba(255, 255, 255, 0)";
                    this.ctx.strokeStyle = "rgba(255, 255, 255, 0)";
                    if (this.grid[row][col] != 0) {
                        fillStyle = this.initColorFigure(this.grid[row][col]);
                        this.ctx.fillStyle = fillStyle;
                        this.ctx.fillRect(x + this.cell * col, y + this.cell * row, this.cell - 2, this.cell - 2);
                        this.drawCellShadow(this.ctx, x, y, lineWidth, col, row);
                    }
                }
            }
        }
    }

    drawCurrentFigure(figureCurrent) {
        if (!figureCurrent) {
            this.drawGameBoard();
        } else {
            this.drawGameBoard();
            let x = this.cell * figureCurrent.col;
            let y = this.cell * figureCurrent.row;

            this.drawCellFigure(this.ctx, x, y, figureCurrent);
        }
    }

    drawCellFigure(ctx, x, y, figure) {
        let fillStyle = this.initColorFigure(figure.name);
        const lineWidth = 3;
        ctx.lineWidth = lineWidth;

        for (let row = 0; row < figure.matrix.length; row++) {

            for (let col = 0; col < figure.matrix[row].length; col++) {
                ctx.fillStyle = "rgba(255, 255, 255, 0)";
                ctx.strokeStyle = "rgba(255, 255, 255, 0)";
                if (figure.matrix[row][col] != 0) {
                    ctx.fillStyle = fillStyle;
                    ctx.fillRect(x + this.cell * col, y + this.cell * row, this.cell - 2, this.cell - 2);
                    this.drawCellShadow(ctx, x, y, lineWidth, col, row);
                }
            }
        }
    }

    drawCellShadow(ctx, x, y, lineWidth, col, row) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.moveTo((x + this.cell * col), (y + this.cell * row) + lineWidth / 2);
        ctx.lineTo((x + this.cell * col) + this.cell - 2, (y + this.cell * row) + lineWidth / 2);
        ctx.moveTo((x + this.cell * col) + lineWidth / 2, (y + this.cell * row));
        ctx.lineTo((x + this.cell * col) + lineWidth / 2, (y + this.cell * row) + this.cell - 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.moveTo((x + this.cell * col) + this.cell - lineWidth, (y + this.cell * row));
        ctx.lineTo((x + this.cell * col) + this.cell - lineWidth, (y + this.cell * row) + this.cell - 2);
        ctx.moveTo((x + this.cell * col), (y + this.cell * row) + this.cell - lineWidth);
        ctx.lineTo((x + this.cell * col) + this.cell - 2, (y + this.cell * row) + this.cell - lineWidth);
        ctx.stroke();
    }
}
