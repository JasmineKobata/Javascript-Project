const Piece = require("../piece")

class Unit extends Piece {
    constructor(team) {
        super(team);
        this.attack = null;
        this.defense = null;
        this.attackDist = 1;
    }

    move() {

    }

    attack() {

    }
}

module.exports = Unit;