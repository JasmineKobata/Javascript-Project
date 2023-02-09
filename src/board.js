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
        let pos1 = {y: Board.GRID_HEIGHT-1, x: Math.floor(Board.GRID_WIDTH/2)}
        let pos2 = {y: 0, x: Math.floor(Board.GRID_WIDTH/2)}
        this.treasure = {
            player: new Treasure(Board.PLAYER_TEAM, pos1),
            enemy: new Treasure(Board.ENEMY_TEAM, pos2)};

        pos1 = {y: 0, x: Math.floor(Board.GRID_WIDTH/2)};
        pos2 = {y: Board.GRID_HEIGHT-1, x: Math.floor(Board.GRID_WIDTH/2)}
        this.base = {
            player: new Base(Board.PLAYER_TEAM, pos2),
            enemy: new Base(Board.ENEMY_TEAM, pos1)};
        this.grid = Board.makeGrid(this.treasure, this.base);
    }

    static makeGrid(treasure, base) {
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


        grid.get(base.enemy.pos).push(base.enemy);
        grid.get(base.player.pos).push(base.player);

        grid.get(treasure.enemy.pos).push(treasure.enemy);
        grid.get(treasure.player.pos).push(treasure.player);

        //Temp units for testing
        // pos = {y: 6, x: 3}
        // grid.get(pos).push(new Archer(Board.PLAYER_TEAM, pos));
        // pos = {y: 1, x: 3}
        // grid.get(pos).push(new Infantry(Board.ENEMY_TEAM, pos));
        // pos = {y: 3, x: 4}
        // grid.get(pos).push(new Archer(Board.PLAYER_TEAM, pos));
        // pos = {y: 4, x: 1}
        // grid.get(pos).push(new Archer(Board.PLAYER_TEAM, pos));
        // pos = {y: 3, x: 3}
        // grid.get(pos).push(new Defender(Board.ENEMY_TEAM, pos));

        return grid;
    }

    isWon() {
        return this.treasure.player.pos.equals(this.base.enemy.pos) ||
            this.treasure.enemy.pos.equals(this.base.player.pos);
    }
}

export default Board;