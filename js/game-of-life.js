class GameOfLife {
    constructor(options) {
        this.options = Object.assign({}, GameOfLife.defaultOptions, options);
        this.canvas = null;
        this.context = null;
        this.canvasSettings = {};
        this.gridSettings = {};
        this.grid = [];
        this.lastTimestamp = null;
        this.neighbourOffsets = [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: -1, y: 1 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ];

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupUniverse();
    }

    setupCanvas() {
        const canvas = document.createElement('canvas');
        this.options.element.appendChild(canvas);
        const context = canvas.getContext('2d');

        this.canvas = canvas;
        this.context = context;
    }

    setupUniverse() {
        this.calculateSettings();
        this.setCanvasSize(this.canvasSettings.width, this.canvasSettings.height);
        this.clearCanvas();
        this.generateStartingGrid();
        window.requestAnimationFrame(timestamp => this.tick(timestamp));
    }

    calculateSettings() {
        const canvasWidth = this.options.element.clientWidth;
        const canvasHeight = this.options.element.clientHeight;
        const gridCols = Math.floor(canvasWidth / this.options.cellSize);
        const gridRows = Math.floor(canvasHeight / this.options.cellSize);
        const gridOffsetX = Math.floor((canvasWidth - (gridCols * this.options.cellSize)) / 2);
        const gridOffsetY = Math.floor((canvasHeight - (gridRows * this.options.cellSize)) / 2);

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

    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clearCanvas() {
        this.context.fillStyle = this.options.deadColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

    iterateGrid() {
        const newGrid = this.grid.map((row, y) => {
            return row.map((cell, x) => {
                const isAlive = cell;
                const numAliveNeighours = this.getNumAliveNeighbours(x, y);

                if (isAlive) {
                    if (numAliveNeighours === 2 || numAliveNeighours === 3) {
                        return 1;
                    }
                } else {
                    if (numAliveNeighours === 3) {
                        return 1;
                    }
                }

                return 0;
            });
        });

        this.grid = newGrid;
    }

    getNumAliveNeighbours(x, y) {
        return this.neighbourOffsets.reduce((prevNum, neighbourOffset) => {
            return prevNum + this.getCellState(x + neighbourOffset.x, y + neighbourOffset.y);
        }, 0);
    }

    getCellState(x, y) {
        const wrappedCoordinates = this.getWrappedCoordinates(x, y);
        return this.grid[wrappedCoordinates.y][wrappedCoordinates.x];
    }

    getWrappedCoordinates(x, y) {
        const maxX = this.grid[0].length - 1;
        const maxY = this.grid.length - 1;
        x = x < 0 ? maxX : x;
        x = x > maxX ? 0 : x;
        y = y < 0 ? maxY : y;
        y = y > maxY ? 0 : y;

        return {
            x,
            y
        }
    }

    tick(timestamp) {
        window.requestAnimationFrame(timestamp => this.tick(timestamp));
        if (!this.lastTimestamp) this.lastTimestamp = -this.options.speed;
        const delta = timestamp - this.lastTimestamp;

        if (delta >= this.options.speed) {
            this.lastTimestamp = timestamp;
            this.clearCanvas();
            this.draw();
            this.iterateGrid();
        }
    }

    draw() {
        this.context.fillStyle = this.options.aliveColor;

        this.grid.forEach((row, rowIndex) => {
            const y = (rowIndex * this.options.cellSize) + this.gridSettings.offsetY;

            row.forEach((cell, cellIndex) => {
                const x = (cellIndex * this.options.cellSize) + this.gridSettings.offsetX;
                const isAlive = cell;

                if (isAlive) {
                    this.context.fillRect(x, y, this.options.cellSize, this.options.cellSize)
                }
            });
        });
    }
}

GameOfLife.defaultOptions = {
    element: null,
    cellSize: 10,
    aliveColor: '#000',
    deadColor: '#fff',
    speed: 200
};
