import Piece from "../piece";
import Board from "../board";

class Treasure extends Piece {
    constructor(team, pos) {
        super(team, pos);
        this.team === Board.PLAYER_TEAM ? this.image.src = "./resources/treasureblue.png" : this.image.src = "./resources/treasurered.png";
    }
}

export default Treasure;