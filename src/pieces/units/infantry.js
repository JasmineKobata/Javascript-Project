import Unit from "../unit";

class Infantry extends Unit {
    constructor(team, pos) {
        super(team, pos);
        this.attack = 2;
        this.defense = 2;
        this.upgrade = {attack: 4, defense: 3}
        this.pointStandard = {attack: 2, defense: 2}
        this.image.src = "./resources/infantry.png";
    }
}

export default Infantry;