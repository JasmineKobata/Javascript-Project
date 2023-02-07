import Unit from "../unit";

class Infantry extends Unit {
    constructor(team, pos) {
        super(team, pos);
        this.attack = 2;
        this.defense = 2;
        this.image.src = "./resources/infantry.png";
    }
}

export default Infantry;