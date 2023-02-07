import Board from "../board";
import Piece from "../piece";
import {isOnBoard} from "../utils";

class Unit extends Piece {
    constructor(team, pos) {
        super(team, pos);
        this.attack = null;
        this.defense = null;
        this.attackDist = 1;
        this.moves = null;
        this.attacks = [];
        this.hasMoved = false;
        this.hasAttacked = false;
        this.board = null;
    }

    resetActions() {
        this.moves = null;
        this.attacks = [];
    }

    getMoves() {
        this.moves = this.getMovesSet();
        this.moves.delete(JSON.stringify(this.pos));
        this.moves = [...this.moves].map(elem => {
            return JSON.parse(elem);
        });
        return this.moves;
    }

    getMovesSet(validVisited = new Set(), maxDist = 2, pos = this.pos) {
        if (maxDist === 0) { return validVisited; }

        for (let y=pos.y-1; y <= pos.y + 1; y++) {
            for (let x=pos.x-1; x <= pos.x + 1; x++) {
                let newPos = {y: y, x: x};
                if (isOnBoard(newPos) && !this.hasUnit(newPos)) {
                    if (!validVisited.has(JSON.stringify(newPos))) {
                        validVisited.add(JSON.stringify(newPos));
                    }
                    validVisited = this.getMovesSet(validVisited, maxDist-1, newPos);
                }
            }
        }

        return validVisited;
    }

    getAttacks() {
        for (let y=this.pos.y-this.attackDist; y <= this.pos.y + this.attackDist; y++) {
            for (let x=this.pos.x-this.attackDist; x <= this.pos.x + this.attackDist; x++) {
                let newPos = {y: y, x: x};
                if (isOnBoard(newPos)) {
                    let square = this.board.grid.get(newPos);
                    if (this.hasUnit(newPos) && square.last().team !== this.team) {
                        this.attacks.push(newPos);
                    }
                }
            }
        }
        return this.attacks;
    }

    hasUnit(pos) {
        let square = this.board.grid.get(pos);
        if (square.length > 0) {
            let elemType = square.last().parentType();
            if (elemType === 'Unit') {
                return true;
            }
        }
        return false;
    }
}

export default Unit;