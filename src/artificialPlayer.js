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
        //if unit exists within reach of treasure & unit not on treasure
        //  move to treasure square
        //else if unit can attack & not yet attacked
        //  attack
        //else if unit is upgradeable & not yet upgraded
        //  upgrade
        //else if unit exists within attack range & 2+ attack points
        //  move to attack range & attack
        //else if barracks are empty, unit not bought, & 2+ attack points
        //  buy unit
        //else unmoved unit exists
        //  move unit towards treasure
        //else forfeit remaining points
    }
}

export default ArtificialPlayer;