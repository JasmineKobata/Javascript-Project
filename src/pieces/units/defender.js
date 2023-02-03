import Unit from "../unit";

class Defender extends Unit {
    constructor(team, pos, board) {
        super(team, pos, board);
        this.attack = 1;
        this.defense = 3;
    }
}

export default Defender;