class GameOfLifeBg {
    constructor(options) {
        this.options = Object.assign({}, GameOfLifeBg.defaultOptions, options);
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupUniverse();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.className = 'game-of-life-bg';
        this.options.element.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this.options.aliveColor;

        this.canvas = canvas;
        this.ctx = ctx;
    }

    setupUniverse() {
        this.calculateSettings();
        this.setCanvasSize();
        this.clearCanvas();
        this.generateStartingGrid();
        this.tick();
    }

    calculateSettings() {
        const {
            element,
            cellSize
        } = this.options;

        const canvasWidth = element.clientWidth;
        const canvasHeight = element.clientHeight;
        const gridCols = Math.floor(canvasWidth / cellSize);
        const gridRows = Math.floor(canvasHeight / cellSize);
        const gridOffsetX = Math.floor((canvasWidth - (gridCols * cellSize)) / 2);
        const gridOffsetY = Math.floor((canvasHeight - (gridRows * cellSize)) / 2);

        this.canvasSettings = {
            width: canvasWidth,
            height: canvasHeight
        };

        this.gridSettings = {
            cols: gridCols,
            rows: gridRows,
            offsetX: gridOffsetX,
            offsetY: gridOffsetY
        };
    }

    setCanvasSize() {
        this.canvas.width = this.canvasSettings.width;
        this.canvas.height = this.canvasSettings.height;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    generateStartingGrid() {
        let grid = [];

        for (let row = 0; row < this.gridSettings.rows; row++) {
            let rowCells = [];

            for (let col = 0; col < this.gridSettings.cols; col++) {
                const cell = Math.round(Math.random());
                rowCells.push(cell);
            }

            grid.push(rowCells);
        }

        this.grid = grid;
    }

    tick() {
        window.requestAnimationFrame(() => this.tick());
        this.clearCanvas();
        this.draw();
        this.calculateNextGrid();
    }

    draw() {
        this.grid.forEach((row, rowIndex) => {
            const y = (rowIndex * this.options.cellSize) + this.gridSettings.offsetY;

            row.forEach((cell, cellIndex) => {
                const x = (cellIndex * this.options.cellSize) + this.gridSettings.offsetX;
                const isAlive = cell;

                if (isAlive) {
                    this.ctx.fillRect(x, y, this.options.cellSize, this.options.cellSize)
                }
            });
        });
    }

    calculateNextGrid() {
        this.generateStartingGrid();
    }
}

GameOfLifeBg.defaultOptions = {
    element: null,
    cellSize: 10,
    aliveColor: '#000',
    deadColor: '#fff'
};
