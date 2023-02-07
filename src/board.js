import Barrack from "./pieces/barrack";
import Base from "./pieces/base";
import Treasure from "./pieces/treasure";
import Archer from "./pieces/units/archer";
import Defender from "./pieces/units/defender";
import Infantry from "./pieces/units/infantry";

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

        let pos = {y: 0, x: 0};
        grid.get(pos).push(new Barrack(Board.ENEMY_TEAM, pos));

        pos = {y: 0, x: Board.GRID_WIDTH-1};
        grid.get(pos).push(new Barrack(Board.ENEMY_TEAM, pos));

        pos = {y: Board.GRID_HEIGHT-1, x: 0};
        grid.get(pos).push(new Barrack(Board.PLAYER_TEAM, pos));

        pos = {y: Board.GRID_HEIGHT-1, x: Board.GRID_WIDTH-1};
        grid.get(pos).push(new Barrack(Board.PLAYER_TEAM, pos));

        pos = {y: 0, x: Math.floor(Board.GRID_WIDTH/2)};
        grid.get(pos).push(new Base(Board.ENEMY_TEAM, pos));

        pos = {y: Board.GRID_HEIGHT-1, x: Math.floor(Board.GRID_WIDTH/2)}
        grid.get(pos).push(new Base(Board.PLAYER_TEAM, pos));

        pos = {y: 0, x: Math.floor(Board.GRID_WIDTH/2)}
        grid.get(pos).push(new Treasure(Board.ENEMY_TEAM, pos));

        pos = {y: Board.GRID_HEIGHT-1, x: Math.floor(Board.GRID_WIDTH/2)}
        grid.get(pos).push(new Treasure(Board.PLAYER_TEAM, pos));

        //Temp units for testing
        pos = {y: 3, x: 0}
        grid.get(pos).push(new Archer(Board.PLAYER_TEAM, pos));
        pos = {y: 3, x: 1}
        grid.get(pos).push(new Infantry(Board.PLAYER_TEAM, pos));
        pos = {y: 2, x: 1}
        grid.get(pos).push(new Archer(Board.PLAYER_TEAM, pos));
        pos = {y: 4, x: 1}
        grid.get(pos).push(new Archer(Board.PLAYER_TEAM, pos));
        pos = {y: 3, x: 3}
        grid.get(pos).push(new Defender(Board.ENEMY_TEAM, pos));

        return grid;
    }
}

export default Board;