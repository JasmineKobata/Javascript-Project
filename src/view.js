const Board = require("./board");
const Barrack = require("./pieces/barrack");
const Base = require("./pieces/base");
const Treasure = require("./pieces/treasure")

class View {
    static SQUARE_DIM = 100;

    constructor(game, ctx) {
        this.game = game;
        this.ctx = ctx;
        this.drawBoard();
    }

    drawBoard() {
        let pixelWidth = Board.GRID_WIDTH * View.SQUARE_DIM;
        let pixelHeight = Board.GRID_HEIGHT * View.SQUARE_DIM;
        this.ctx.canvas.width = pixelWidth;
        this.ctx.canvas.height = pixelHeight;
        let ratio = Math.min(
            window.innerHeight / this.ctx.canvas.height,
            window.innerWidth / this.ctx.canvas.width
        )
        this.ctx.scale(ratio, ratio);

        for (let y=0; y < Board.GRID_HEIGHT; y++) {
            for (let x=0; x < Board.GRID_WIDTH; x++) {
                this.ctx.fillStyle = "forestgreen";
                this.ctx.fillRect(
                    View.SQUARE_DIM * x,
                    View.SQUARE_DIM * y,
                    View.SQUARE_DIM,
                    View.SQUARE_DIM);
                this.ctx.strokeStyle = "darkgreen";
                this.ctx.strokeRect(
                    View.SQUARE_DIM * x,
                    View.SQUARE_DIM * y,
                    View.SQUARE_DIM,
                    View.SQUARE_DIM
                )
                for (let i=0; i < this.game.board.grid[y][x].length; i++) {
                    this.game.board.grid[y][x][i].draw(this.ctx, x, y);
                }
            }
        }
    }
}

Barrack.prototype.draw = function(ctx, x, y) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.fillRect(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .10,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .20,
        View.SQUARE_DIM * .80,
        View.SQUARE_DIM * .60);
}

Base.prototype.draw = function(ctx, x, y) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * .35,
        0, 2.0 * Math.PI);
    ctx.fill();
}

Treasure.prototype.draw = function(ctx, x, y) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "darkred" : ctx.fillStyle = "darkblue";
    ctx.fillRect(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .15,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .30,
        View.SQUARE_DIM * .70,
        View.SQUARE_DIM * .40);
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "gold" : ctx.fillStyle = "silver";
    ctx.fillRect(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .20,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .35,
        View.SQUARE_DIM * .60,
        View.SQUARE_DIM * .30);
}

module.exports = View;