import Unit from "../unit";

class Archer extends Unit {
    constructor(team, pos) {
        super(team, pos);
        this.attack = 1;
        this.defense = 1;
        this.attackDist = 2;
        this.image.src = "./resources/archer.png";
    }
}

export default Archer;