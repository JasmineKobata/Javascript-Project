import Unit from "../unit";

class Infantry extends Unit {
    constructor(team, pos, board) {
        super(team, pos, board);
        this.attack = 2;
        this.defense = 2;
    }
}

export default Infantry;