import Unit from "../unit";

class Archer extends Unit {
    constructor(team, pos) {
        super(team, pos);
        this.attack = 1;
        this.defense = 1;
        this.attackDist = 3;
        this.upgrade = {attack: 2, defense: 2}
        this.pointStandard = {attack: 1, defense: 1}
        this.image.src = "./resources/archer.png";
    }
}

export default Archer;