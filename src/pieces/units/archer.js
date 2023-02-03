import Unit from "../unit";

class Archer extends Unit {
    constructor(team, pos, board) {
        super(team, pos, board);
        this.attack = 1;
        this.defense = 1;
        this.attackDist = 2;
    }
}

export default Archer;