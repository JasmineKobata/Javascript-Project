const Unit = require("../unit")

class Infantry extends Unit {
    constructor(team) {
        super(team);
        this.attack = 2;
        this.defense = 2;
    }
}

module.exports = Infantry;