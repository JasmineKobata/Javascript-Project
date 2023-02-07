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
        this.board.grid.forEach((col) => {
            col.forEach((row) => {
                row.forEach((e) => {
                    if (e.parentType() === 'Unit') {
                        e.hasMoved = false;
                        e.hasAttacked = false;
                    }
                })
            })
        })
        this.actionPoints = 4;
        this.currentPlayer === Board.PLAYER_TEAM ? this.currentPlayer = Board.ENEMY_TEAM : this.currentPlayer = Board.PLAYER_TEAM;
    }

    //ctx -> {clickedPos always set, selectedSquare that will be set in unselected stage}
    stateMachine() {
        let square = this.board.grid.get(this.ctx.clickedPos);
        switch (this.state) {
            case 'unselected':
                //if unit is selected
                console.log("A");
                if (this.unitSelected(square.last())) {
                    this.ctx.selectedSquare = square;
                    this.state = 'unit';
                } //else if barrack is selected
                else if (this.actionPoints > 1 && this.barrackSelected(square.first())) {
                    this.ctx.menu = this.view.drawBarrackSelection(square.first().pos);
                    this.ctx.selectedSquare = square;
                    this.state = 'barrack';
                }
                break;
            case 'unit':
                //if action taken
                if (this.actionTaken(this.ctx.clickedPos, this.ctx.selectedSquare)) {
                    console.log("B");
                    this.ctx = {};
                    this.state = 'unselected';
                    if (this.actionPoints === 0) { this.switchPlayers(); }
                    this.view.drawBoard();
                } //else if action not taken
                else {
                    console.log("C");
                    if (this.unitSelected(square.last())) {}
                    else if (this.actionPoints > 1 && this.barrackSelected(square.first())) {
                        this.ctx.menu = this.view.drawBarrackSelection(square.first().pos);
                        this.state = 'barrack';
                    }
                    else {
                        this.state = 'unselected';
                    }
                    this.ctx.selectedSquare = square;
                }
                break;
            case 'barrack':
                //if unit is bought
                if (this.unitBought(this.ctx.exactPos, this.ctx.menu, this.ctx.selectedSquare)) {
                    console.log("D");
                    this.ctx = {};
                    this.state = 'unselected';
                    if (this.actionPoints === 0) { this.switchPlayers(); }
                    this.view.drawBoard();
                } //else if unit is not bought
                else {
                    console.log("E");
                    if (this.unitSelected(square.last())) {
                        this.state = 'unit';
                    }
                    else if (this.barrackSelected(square.first())) {
                        this.ctx.menu = this.view.drawBarrackSelection(square.first().pos);
                    } else {
                        this.state = 'unselected';
                    }
                    this.ctx.selectedSquare = square;
                }
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

            if (!unit.hasMoved) {
                unit.getMoves().forEach((pos) => {
                    this.view.drawMoveHighlights(pos);
                    this.view.drawGridElems(pos);
                });
            }
            if (!unit.hasAttacked) {
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
        this.view.drawBoard();
        return barrack && barrack.type() === 'Barrack' && barrack.team === this.currentPlayer;
    }

    unitBought(pos, menu, square) {
        let unitBought = false;
        let newPos = this.adjustMenuPosition(square.first(), pos);

        let unit;
        if (unit = menu.find(e => e.pos.x === newPos.x && e.pos.y === newPos.y)) {
            unit.pos = square.first().pos;
            square.push(unit);
            this.actionPoints -= 2;
            unitBought = true;
        }

        return unitBought;
    }

    adjustMenuPosition(barrack, pos) {
        let xDifference = barrack.pos.x === 0 ? -0.25 : 0.25;
        let yDifference = barrack.pos.y === 0 ? -1 : 0.5;
        let x = Math.floor((pos.x + xDifference));
        let y = Math.floor((pos.y + yDifference));
        let newPos = {};
        newPos.x = barrack.pos.x === 0 ? x + 0.25 : x - 0.25;
        newPos.y = barrack.pos.y === 0 ? y + 1 : y - 0.5;
        return newPos;
    }

    actionTaken(pos, square) {
        return this.moveUnit(pos, square) || this.attackUnit(pos, square);
    }

    moveUnit(pos, square) {
        let unitMoved = false;
        let unit = square.last();
 
        if (unit.moves && unit.moves.find(e => e.x === pos.x && e.y === pos.y)) {
            unit.pos = pos; //reset unit position;
            square.pop();
            if (square.length > 0 && square.last().type() === 'Treasure'
                && square.last().team !== this.currentPlayer) {
                console.log(pos)
                square.last().pos = pos;
                this.board.grid.get(pos).push(square.pop());
                console.log(this.board.grid);
            }
            this.board.grid.get(pos).push(unit);

            this.actionPoints--;
//            this.view.drawBoard();
            unit.hasMoved = true;
            unitMoved = true;
        }
        return unitMoved;
    }

    attackUnit(pos, square) {
        let unitAttacked = false;
        let unit = square.last();
        if (unit.attacks && unit.attacks.find(e => e.x === pos.x && e.y === pos.y)) {
            let attackedSquare = this.board.grid.get(pos);
            let attackedUnit = attackedSquare.last();
            attackedUnit.defense -= unit.attack;
            if (attackedUnit.defense < 1) {
                attackedSquare.pop();
            }
            this.actionPoints--;
//            this.view.drawBoard();
            unit.hasAttacked = true;
            unitAttacked = true;
        }
        return unitAttacked;
    }
}

export default Game;