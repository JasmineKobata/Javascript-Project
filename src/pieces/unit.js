import Board from "../board";
import Piece from "../piece";
import {isOnBoard, left, right, up, down} from "../utils";

class Unit extends Piece {
    constructor(team, pos) {
        super(team, pos);
        this.attack = null;
        this.defense = null;
        this.pointStandard = null;
        this.upgrade = null;
        this.level = 1;
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
        this.level = 2;
        this.hasUpgraded = true;
        this.attack = this.upgrade.attack;
        this.defense = this.upgrade.defense;
    }

    downgrade() {
        this.level = 1;
        this.attack = this.pointStandard.attack;
        this.defense = Math.min(this.pointStandard.defense, this.defense);
    }

    getMoves() {
        this.moves = this.getMovesSetBFS();
        this.moves.delete(JSON.stringify(this.pos));
        this.moves = [...this.moves].map(elem => {
            return JSON.parse(elem);
        });
        return this.moves;
    }

    getMovesSetDFS(validVisited = new Set(), maxDist = 2, pos = this.pos) {
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
    
    getMovesSetBFS(validVisited = new Set(), maxDist = 2, pos = this.pos) {
        if (maxDist === 0) { return validVisited; }
        var q = [pos];

        while (q.length !== 0) {
            let newPos = q.shift();
            validVisited.add(JSON.stringify(newPos));

            this.addToQueue(q, newPos.left(), validVisited, this.isWithinDist(pos, newPos.left(), maxDist));
            this.addToQueue(q, newPos.right(), validVisited, this.isWithinDist(pos, newPos.right(), maxDist));
            this.addToQueue(q, newPos.up(), validVisited, this.isWithinDist(pos, newPos.up(), maxDist));
            this.addToQueue(q, newPos.down(), validVisited, this.isWithinDist(pos, newPos.down(), maxDist));
        }

        return validVisited;
    }

    addToQueue(q, pos, validVisited, withinDist) {
        if (isOnBoard(pos) && withinDist && !this.hasUnit(pos)
            && !validVisited.has(JSON.stringify(pos)))
            q.push(pos);
    }

    isWithinDist(pos, newPos, maxDist) {
        return Math.abs(pos.x - newPos.x) <= maxDist && Math.abs(pos.y - newPos.y) <= maxDist;
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
            this.level == 1 &&
            ((this.team === Board.PLAYER_TEAM && this.pos.y < Board.GRID_HEIGHT / 2) ||
            (this.team === Board.ENEMY_TEAM && this.pos.y >= Board.GRID_HEIGHT / 2));
    }

    onHomeTurf() {
        return (this.team === Board.PLAYER_TEAM && this.pos.y >= Board.GRID_HEIGHT / 2) ||
            (this.team === Board.ENEMY_TEAM && this.pos.y < Board.GRID_HEIGHT / 2);
    }
}

export default Unit;