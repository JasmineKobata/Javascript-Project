class Piece {
    constructor(team, pos) {
        this.team = team;
        this.pos = pos
        this.image = new Image();
    }

    parentType() {
        return Object.getPrototypeOf(this.constructor).name;
    }

    type() {
        return this.constructor.name;
    }
}

export default Piece;