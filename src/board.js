const Barrack = require("./pieces/barrack")
const Base = require("./pieces/base")
const Treasure = require("./pieces/treasure")

class Board {
    static GRID_WIDTH = 7;
    static GRID_HEIGHT = 8; //0, 0 is top left corner
    static PLAYER_TEAM = 1;
    static ENEMY_TEAM = 2;

    constructor() {
        this.grid = Board.makeGrid();
    }

    print() {
        let strs = [];
        for (let i=0; i < Board.GRID_HEIGHT; i++) {
            let marks = [];
            for (let j=0; j < Board.GRID_WIDTH; j++) {
                marks.push( this.grid[i][j] ? this.grid[i][j] : " ");
            }
            strs.push(`${marks.join("|")}\n`);
        }
        console.log(strs.join('-------\n'));
    }

    static makeGrid() {
        let grid = [];

        for (let i=0; i < Board.GRID_HEIGHT; i++) {
            grid.push([]);
            for (let j=0; j < Board.GRID_WIDTH; j++) {
                grid[i].push([]);
            }
        }
        grid[0][0].push(new Barrack(Board.ENEMY_TEAM));
        grid[0][Board.GRID_WIDTH-1].push(new Barrack(Board.ENEMY_TEAM));
        grid[Board.GRID_HEIGHT-1][0].push(new Barrack(Board.PLAYER_TEAM));
        grid[Board.GRID_HEIGHT-1][Board.GRID_WIDTH-1].push(new Barrack(Board.PLAYER_TEAM));
        grid[0][Math.floor(Board.GRID_WIDTH/2)].push(new Base(Board.ENEMY_TEAM));
        grid[Board.GRID_HEIGHT-1][Math.floor(Board.GRID_WIDTH/2)].push(new Base(Board.PLAYER_TEAM));
        grid[0][Math.floor(Board.GRID_WIDTH/2)].push(new Treasure(Board.ENEMY_TEAM));
        grid[Board.GRID_HEIGHT-1][Math.floor(Board.GRID_WIDTH/2)].push(new Treasure(Board.PLAYER_TEAM));
        return grid;
    }
}

module.exports = Board;