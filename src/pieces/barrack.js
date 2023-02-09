import Piece from "../piece";

class Barrack extends Piece {
    constructor(team, pos) {
        super(team, pos);
        this.image.src = "./resources/barracks2.png";
    }
}

export default Barrack;