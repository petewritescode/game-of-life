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
        this.addCanvas();
        this.storeCanvasContext();
        this.resizeCanvas();
        this.clearCanvas();
    }

    setupUniverse() {
        this.updateGridSettings();
        this.randomiseGrid();
        this.tick();
    }

    getElementSize() {
        return {
            width: this.options.element.clientWidth,
            height: this.options.element.clientHeight
        };
    }

    addCanvas() {
        const canvas = document.createElement('canvas');
        this.options.element.appendChild(canvas);
        this.canvas = canvas;
    }

    storeCanvasContext() {
        this.context = this.canvas.getContext('2d');
    }

    resizeCanvas() {
        const {
            width,
            height
        } = this.getElementSize();

        this.canvas.width = width;
        this.canvas.height = height;
    }

    clearCanvas() {
        this.context.fillStyle = this.options.deadColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGridSettings() {
        const {
            width,
            height
        } = this.getElementSize();

        const gridCols = Math.floor(width / this.options.cellSize);
        const gridRows = Math.floor(height / this.options.cellSize);
        const gridOffsetX = Math.floor((width - (gridCols * this.options.cellSize)) / 2);
        const gridOffsetY = Math.floor((height - (gridRows * this.options.cellSize)) / 2);

        this.gridSettings = {
            cols: gridCols,
            rows: gridRows,
            offsetX: gridOffsetX,
            offsetY: gridOffsetY
        };
    }

    randomiseGrid() {
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
                const isAlive = cell === 1;
                const numAliveNeighbours = this.getNumAliveNeighbours(x, y);

                if (isAlive) {
                    return (numAliveNeighbours === 2 || numAliveNeighbours === 3) ? 1 : 0;
                } else {
                    return numAliveNeighbours === 3 ? 1 : 0;
                }
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

    tick(timestamp) {
        window.requestAnimationFrame(timestamp => this.tick(timestamp));
        const delta = (timestamp && this.lastTimestamp) ? timestamp - this.lastTimestamp : null;
        const shouldUpdate = !delta || delta >= this.options.interval;

        if (shouldUpdate) {
            this.lastTimestamp = timestamp;
            this.clearCanvas();
            this.draw();
            this.iterateGrid();
        }
    }
}

GameOfLife.defaultOptions = {
    element: null,
    cellSize: 10,
    aliveColor: '#000',
    deadColor: '#fff',
    interval: 200
};
