import Board from "./board";

export function isOnBoard(pos) {
    return pos.x > -1 && pos.x < Board.GRID_WIDTH && pos.y > -1 && pos.y < Board.GRID_HEIGHT;
}

export function isButton(pos) {
    return pos.y > Board.GRID_HEIGHT + 0.25 &&
        pos.y < Board.GRID_HEIGHT + 0.75 &&
        pos.x > 4 && pos.x < 5;
}

export function willPlayAgain(pos) {
     return pos.x > Board.GRID_WIDTH / 2 - 0.75 &&
        pos.x < Board.GRID_WIDTH / 2 + 0.75 &&
        pos.y > Math.floor((Board.GRID_HEIGHT) / 2) &&
        pos.y < Math.floor((Board.GRID_HEIGHT) / 2) + 0.5;
}

export function isUpgradeButton(squarePos, clickPos) {
    let x = clickPos.x - squarePos.x;
    let y = clickPos.y - squarePos.y;

    return x > 0 && x < 0.25 && y > 0 && y < 0.25;
}

export function isUpgradeConfirmation(squarePos, clickPos) {
    let x = clickPos.x - squarePos.x;
    let y = clickPos.y - squarePos.y;
    return x > 0 && x < 1 && y > 0 && y < 0.25;
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

Object.prototype.equals = function(pos) {
    return this.x === pos.x && this.y === pos.y;
}

export default Array;