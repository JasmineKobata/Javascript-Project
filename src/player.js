class Player {
    constructor(team, treasure, base) {
        this.team = team;
        this.units = [];
        this.treasure = treasure;
        this.base;
    }

    removeUnit(unit) {
        let found = false;
        let i = 0;
        while (!found && i < this.units.length) {
            if (this.units[i++].pos.equals(unit.pos)) {
                found = true;
            }
        }
        return this.units.splice(i-1, 1);
    }
}

export default Player;