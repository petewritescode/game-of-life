class GameOfLife {
    constructor(options) {
        this.options = Object.assign({}, GameOfLife.defaultOptions, options);
        this.canvas = null;
        this.context = null;
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
        this.setCanvasSize();
        this.clearCanvas();
        this.generateStartingGrid();
        window.requestAnimationFrame(timestamp => this.tick(timestamp));
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
        const newGrid = this.grid.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                const isAlive = cell;
                const noAliveNeighbours = this.neighbourOffsets.reduce((prevNoAliveNeighbours, neighbour) => {
                    return prevNoAliveNeighbours + this.getCellState(cellIndex + neighbour.x, rowIndex + neighbour.y);
                }, 0);

                if (isAlive) {
                    if (noAliveNeighbours === 2 || noAliveNeighbours === 3) {
                        return 1;
                    }
                } else {
                    if (noAliveNeighbours === 3) {
                        return 1;
                    }
                }

                return 0;
            });
        });

        this.grid = newGrid;
    }

    getCellState(x, y) {
        if (this.grid[y] && this.grid[y][x]) {
            return this.grid[y][x];
        }

        return 0;
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
