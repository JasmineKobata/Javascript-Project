import Barrack from "./pieces/barrack";
import Base from "./pieces/base";
import Treasure from "./pieces/treasure";

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
        this.barracks = {
            player: [],
            enemy: []
        };
        this.grid = Board.makeGrid(this.treasure, this.base, this.barracks);
    }

    static makeGrid(treasure, base, barracks) {
        let grid = [];

        for (let i=0; i < Board.GRID_HEIGHT; i++) {
            grid.push([]);
            for (let j=0; j < Board.GRID_WIDTH; j++) {
                grid[i].push([]);
            }
        }

        let pos = {y: 0, x: 0};
        let barrack = new Barrack(Board.ENEMY_TEAM, pos);
        grid.get(pos).push(barrack);
        barracks.enemy.push(barrack);

        pos = {y: 0, x: Board.GRID_WIDTH-1};
        barrack = new Barrack(Board.ENEMY_TEAM, pos);
        grid.get(pos).push(barrack);
        barracks.enemy.push(barrack);

        pos = {y: Board.GRID_HEIGHT-1, x: 0};
        barrack = new Barrack(Board.PLAYER_TEAM, pos);
        grid.get(pos).push(barrack);
        barracks.player.push(barrack);

        pos = {y: Board.GRID_HEIGHT-1, x: Board.GRID_WIDTH-1};
        barrack = new Barrack(Board.PLAYER_TEAM, pos);
        grid.get(pos).push(barrack);
        barracks.player.push(barrack);

        grid.get(base.enemy.pos).push(base.enemy);
        grid.get(base.player.pos).push(base.player);

        grid.get(treasure.enemy.pos).push(treasure.enemy);
        grid.get(treasure.player.pos).push(treasure.player);

        return grid;
    }

    isWon() {
        return this.treasure.player.pos.equals(this.base.enemy.pos) ||
            this.treasure.enemy.pos.equals(this.base.player.pos);
    }
}

export default Board;