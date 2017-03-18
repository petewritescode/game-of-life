class GameOfLifeBg {
    constructor(options) {
        this.options = Object.assign({}, GameOfLifeBg.defaultOptions, options);
        this.init();
    }

    init() {
        this.createCanvas();
        this.calculateGridSize();
        this.setCanvasSize();
        this.tick();
    }

    createCanvas() {
        const { element } = this.options;
        const canvas = document.createElement('canvas');
        canvas.className = 'game-of-life-bg';
        element.appendChild(canvas);
        this.canvas = canvas;
    }

    calculateGridSize() {
        const {
            element,
            cellSize
        } = this.options;

        const width = element.clientWidth;
        const height = element.clientHeight;
        this.cols = Math.floor(width / cellSize);
        this.rows = Math.floor(height / cellSize);
    }

    setCanvasSize() {
        this.canvas.width = this.cols * this.options.cellSize;
        this.canvas.height = this.rows * this.options.cellSize;
    }
}

GameOfLifeBg.defaultOptions = {
    element: null,
    cellSize: 10
};
