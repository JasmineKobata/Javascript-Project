import Piece from "../piece";
import Board from "../board";

class Unit extends Piece {
    constructor(team, pos, board) {
        super(team, pos);
        this.attack = null;
        this.defense = null;
        this.attackDist = 1;
        this.board = board;
        this.getMoves();
    }

    getMoves() {
        let validMoves = this.getMovesSet();
        validMoves.delete(JSON.stringify(this.pos));
        validMoves = [...validMoves].map(elem => {
            return JSON.parse(elem);
        });
        console.log(validMoves)
        return validMoves;
    }

    getMovesSet(validVisited = new Set(), maxDist = 2, pos = this.pos) {
        if (maxDist === 0) { return validVisited; }

        for (let y=pos.y-1; y <= pos.y + 1; y++) {
            for (let x=pos.x-1; x <= pos.x + 1; x++) {
                let newPos = {y: y, x: x};
                if (this.isOnBoard(newPos)) {
                    if (!validVisited.has(JSON.stringify(newPos))) {
                        validVisited.add(JSON.stringify(newPos));
                    }
                    validVisited = this.getMovesSet(validVisited, maxDist-1, newPos);
                }
            }
        }

        return validVisited;
    }

    attack() {

    }

    hasUnit(pos) {
        let boardSquare = this.board.grid(pos);
        let lastElem = boardSquare[boardSquare.length - 1];
        if (boardSquare.length > 0 && typeof lastElem === 'Unit') {
            return true;
        }
        return false;
    }

    isOnBoard(pos) {
        return pos.x > -1 && pos.x < Board.GRID_WIDTH && pos.y > -1 && pos.y < Board.GRID_HEIGHT;
    }
}

export default Unit;