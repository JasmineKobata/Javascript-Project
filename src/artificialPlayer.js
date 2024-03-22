import Player from "./player";

class ArtificialPlayer extends Player {
    constructor(team) {
        super(team);
    }

    //5 Moves available:
    //-Buy units
    //-Upgrade unit
    //-Move unit
    //-Attack enemy
    chooseMove() {
        //Priority Tree:
        //if unit exists within reach of treasure
        //  move to treasure square
        //else if unit can attack
        //  attack
        //else if unit exists within attack range & 2+ attack points left
        //  move to attack range & attack
        //
    }
}

export default ArtificialPlayer;