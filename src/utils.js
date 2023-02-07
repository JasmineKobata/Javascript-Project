import Board from "./board";

export function isOnBoard(pos) {
    return pos.x > -1 && pos.x < Board.GRID_WIDTH && pos.y > -1 && pos.y < Board.GRID_HEIGHT;
}

Array.prototype.get = function(pos) {
    return this[pos.y][pos.x];
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

Array.prototype.first = function() {
    return this[0];
}

export default Array;