const Unit = require("../unit")

class Archer extends Unit {
    constructor(team) {
        super(team);
        this.attack = 1;
        this.defense = 1;
        this.attackDist = 2;
    }
}

module.exports = Archer;