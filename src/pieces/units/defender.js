import Unit from "../unit";

class Defender extends Unit {
    constructor(team, pos) {
        super(team, pos);
        this.attack = 1;
        this.defense = 3;
        //if attack is changed to 1, unit.isUpgradable returns true when unit is already upgraded
        //because it checks if upgraded using attack points. Need to implement different check
        //if making upgraded attack points equal to standard attack points
        this.upgrade = {attack: 2, defense: 5}
        this.pointStandard = {attack: 1, defense: 3}
        this.image.src = "./resources/defender.png";
    }
}

export default Defender;