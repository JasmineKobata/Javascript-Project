import Board from "./board";

class Game {
    constructor() {
        this.board = new Board();
        this.view = null;
        this.state = 'unselected';
        this.currentPlayer = Board.PLAYER_TEAM;
        this.actionPoints = 4;
        this.ctx = {}; //{ clickedPos, selectedSquare }
    }

    switchPlayers() {
        this.actionPoints = 4;
        this.currentPlayer === Board.PLAYER_TEAM ? this.currentPlayer = Board.ENEMY_TEAM : this.currentPlayer = Board.PLAYER_TEAM;
    }

    //ctx -> {clickedPos always set, selectedSquare that will be set in unselected stage}
    stateMachine() {
        let square = this.board.grid.get(this.ctx.clickedPos);
        switch (this.state) {
            case 'unselected':
                //if unit is selected
                if (this.unitSelected(square.last())) {
                    this.ctx.selectedSquare = square;
                    this.state = 'unit';
                } //else if barrack is selected
                else if (this.barrackSelected(square.first())) {
                    this.state = 'barrack';
                }
                break;
            case 'unit':
                //if action taken
                if (this.actionTaken(this.ctx.clickedPos, this.ctx.selectedSquare)) {
                    this.ctx = {};
                    this.state = 'unselected';
                    if (this.actionPoints === 0) { this.switchPlayers(); }
                    this.view.drawBoard();
                } //else if action not taken
                else {
                    if (!this.unitSelected(square.last())) { this.state = 'unselected' };
                    this.ctx.selectedSquare = square;
                }
                break;
            case 'barrack':
                break;
            default:
                console.log("ERROR: undefined state");
        }
    }

    unitSelected(unit) {
        let unitSelected = false;
        this.view.drawBoard();
        if (unit && unit.parentType() === 'Unit' && unit.team === this.currentPlayer) {
            unit.resetActions(); //reset newly selected unit's action squares
            if (!unit.board) { unit.board = this.board; }

            unit.getMoves().forEach((pos) => {
                this.view.drawMoveHighlights(pos);
                this.view.drawGridElems(pos);
            });
            if (this.actionPoints > 1) {
                unit.getAttacks().forEach((pos) => {
                    this.view.drawAttackHighlights(pos);
                    this.view.drawGridElems(pos);
                })
            }
            this.view.drawOutline(unit.pos);
            unitSelected = true;
        }
        return unitSelected;
    }

    barrackSelected(barrack) {
        let barrackSelected = false;
        if (barrack && barrack.type() === 'Barrack' && barrack.team === this.currentPlayer) {
            this.view.drawBarrackSelection(barrack.pos);
        }
        return barrackSelected;
    }

    actionTaken(pos, square) {
        return this.moveUnit(pos, square) || this.attackUnit(pos, square);
    }

    moveUnit(pos, square) {
        let unitMoved = false;
        let unit = square.last();
        if (unit.moves.find(e => e.x === pos.x && e.y === pos.y)) {
            unit.pos = pos; //reset unit position;
            this.board.grid.get(pos).push(square.pop());
            this.actionPoints--;
//            this.view.drawBoard();
            unitMoved = true;
        }
        return unitMoved;
    }

    attackUnit(pos, square) {
        let unitAttacked = false;
        let unit = square.last();
        if (unit.attacks.find(e => e.x === pos.x && e.y === pos.y)) {
            let attackedSquare = this.board.grid.get(pos);
            let attackedUnit = attackedSquare.last();
            attackedUnit.defense -= unit.attack;
            if (attackedUnit.defense < 1) {
                attackedSquare.pop();
            }
            this.actionPoints--;
//            this.view.drawBoard();
            unitAttacked = true;
        }
        return unitAttacked;
    }
}

export default Game;