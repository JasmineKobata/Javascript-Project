import Unit from "../unit";

class Defender extends Unit {
    constructor(team, pos) {
        super(team, pos);
        this.attack = 1;
        this.defense = 3;
        this.upgrade = {attack: 2, defense: 5}
        this.pointStandard = {attack: 1, defense: 3}
        this.image.src = "./resources/defender.png";
    }
}

export default Defender;