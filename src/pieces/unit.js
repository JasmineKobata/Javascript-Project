import Board from "../board";
import Piece from "../piece";
import {isOnBoard} from "../utils";

class Unit extends Piece {
    constructor(team, pos) {
        super(team, pos);
        this.attack = null;
        this.defense = null;
        this.pointStandard = null;
        this.upgrade = null;
        this.attackDist = 1;
        this.moves = null;
        this.attacks = [];
        this.hasMoved = false;
        this.hasAttacked = false;
        this.hasUpgraded = false;
        this.board = null;
        this.view = null;
    }

    resetActions() {
        this.moves = null;
        this.attacks = [];
    }

    upgrades() {
        this.hasUpgraded = true;
        this.attack = this.upgrade.attack;
        this.defense = this.upgrade.defense;
    }

    downgrade() {
        this.attack = this.pointStandard.attack;
        this.defense = Math.min(this.pointStandard.defense, this.defense);
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

    isUpgradable(currentPlayer) {
        return this.team === currentPlayer.team &&
            this.attack === this.pointStandard.attack &&
            ((this.team === Board.PLAYER_TEAM && this.pos.y < Board.GRID_HEIGHT / 2) ||
            (this.team === Board.ENEMY_TEAM && this.pos.y >= Board.GRID_HEIGHT / 2));
    }

    onHomeTerf() {
        return (this.team === Board.PLAYER_TEAM && this.pos.y >= Board.GRID_HEIGHT / 2) ||
            (this.team === Board.ENEMY_TEAM && this.pos.y < Board.GRID_HEIGHT / 2);
    }
}

export default Unit;