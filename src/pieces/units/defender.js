const Unit = require("../unit")

class Defender extends Unit {
    constructor(team) {
        super(team);
        this.attack = 1;
        this.defense = 3;
    }
}

module.exports = Defender;