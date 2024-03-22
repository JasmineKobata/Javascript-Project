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
        
    }
}

export default ArtificialPlayer;