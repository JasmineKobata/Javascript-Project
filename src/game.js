import Board from "./board";
import HumanPlayer from "./humanPlayer";
import { isUpgradeButton, isUpgradeConfirmation } from "./utils";

class Game {
    constructor() {
        this.board = new Board();
        this.view = null;
        this.state = 'unselected';
        this.player = new HumanPlayer(Board.PLAYER_TEAM);
        this.enemy = new HumanPlayer(Board.ENEMY_TEAM);
        this.currentPlayer = this.player;
        this.actionPoints = 4;
        this.ctx = {}; //{ clickedPos, selectedSquare }
    }

    resetGame(view) {
        this.board = new Board();
        this.view = view;
        this.state = 'unselected';
        this.player = new HumanPlayer(Board.PLAYER_TEAM);
        this.enemy = new HumanPlayer(Board.ENEMY_TEAM);
        this.currentPlayer = this.player;
        this.actionPoints = 4;
        this.ctx = {};
    }

    switchPlayers() {
        this.board.grid.forEach((col) => {
            col.forEach((row) => {
                row.forEach((e) => {
                    if (e.parentType() === 'Unit') {
                        e.hasMoved = false;
                        e.hasAttacked = false;
                        e.hasUpgraded = false;
                    }
                })
            })
        })
        this.actionPoints = 4;
        this.state = 'unselected';
        this.currentPlayer === this.player ? this.currentPlayer = this.enemy : this.currentPlayer = this.player;
    }

    //ctx -> {clickedPos always set, selectedSquare that will be set in unselected stage}
    stateMachine() {
        let square = this.board.grid.get(this.ctx.clickedPos);
        switch (this.state) {
            case 'unselected':
                //if unit upgrade is selected
                if (this.unitUpgradeable(this.ctx.exactPos, square.last())) {
                    this.ctx.selectedSquare = square;
                    this.state = 'upgrade';
                } //if unit is selected
                else if (this.unitSelected(square.last())) {
                    this.ctx.selectedSquare = square;
                    this.state = 'unit';
                } //else if barrack is selected
                else if (this.actionPoints > 1 && this.currentPlayer.units.length < 8
                    && this.barrackSelected(square.first())) {
                    this.ctx.menu = this.view.drawBarrackSelection(square.first().pos);
                    this.ctx.selectedSquare = square;
                    this.state = 'barrack';
                }
                break;
            case 'unit':
                //if action taken
                if (this.actionTaken(this.ctx.clickedPos, this.ctx.selectedSquare)) {
                    this.ctx = {};
                    this.state = 'unselected';
                    // this.view.drawBoard();
                    if (this.board.isWon()) {
                        this.view.drawBoard();
                        this.view.drawWinningScreen();
                    } else {
                        if (this.actionPoints === 0) { this.switchPlayers(); }
                        this.view.drawBoard();
                    }
                } //else if action not taken
                else {
                    this.view.drawBoard();
                    if (this.unitUpgradeable(this.ctx.exactPos, square.last())) {
                        this.state = 'upgrade'
                    }
                    else if (this.unitSelected(square.last())) {}
                    else if (this.actionPoints > 1 && this.currentPlayer.units.length < 8
                        && this.barrackSelected(square.first())) {
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
                    this.ctx = {};
                    this.state = 'unselected';
                    if (this.actionPoints === 0) { this.switchPlayers(); }
                    this.view.drawBoard();
                } //else if unit is not bought
                else {
                    this.view.drawBoard();
                    if (this.unitUpgradeable(this.ctx.exactPos, square.last())) {
                        this.state = 'upgrade'
                    }
                    else if (this.unitSelected(square.last())) {
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
            case 'upgrade':
                //if unit is upgraded
                if (this.unitUpgraded(this.ctx.exactPos, this.ctx.selectedSquare)) {
                    this.state = 'unselected';
                    if (this.actionPoints === 0) { this.switchPlayers(); }
                    this.view.drawBoard();
                }
                else {
                    this.view.drawBoard();
                    //if another unit upgrade is selected
                    if (this.unitUpgradeable(this.ctx.exactPos, square.last())) {
                    } //else if a unit is selected
                    else if (this.unitSelected(square.last())) {
                        this.state = 'unit';
                    } //else if a barrack is selected
                    else if (this.actionPoints > 1 && this.currentPlayer.units.length < 8
                        && this.barrackSelected(square.first())) {
                        this.ctx.menu = this.view.drawBarrackSelection(square.first().pos);
                        this.state = 'barrack';
                    } else {
                        this.state = 'unselected';
                    }
                    this.ctx.selectedSquare = square;
                }
                break;
            default:
                // console.log("ERROR: undefined state");
        }
    }

    unitUpgradeable(pos, unit) {
        let unitUpgradeable = false;
        if (this.actionPoints > 1 && unit && unit.parentType() === 'Unit' &&
            unit.isUpgradable(this.currentPlayer) && isUpgradeButton(unit.pos, pos)) {
                unitUpgradeable = true;
                this.view.drawBoard(unit.pos, pos);
        }
        return unitUpgradeable;
    }

    unitUpgraded(pos, square) {
        let unitUpgraded = false;
        let unit = square.last();
        if (unit && unit.parentType() === 'Unit' &&
            unit.isUpgradable(this.currentPlayer) && isUpgradeConfirmation(unit.pos, pos)) {
                unit.upgrades();
                this.actionPoints -= 2;
                unitUpgraded = true;
        }
        return unitUpgraded;
    }

    unitSelected(unit) {
        let unitSelected = false;
        if (unit && unit.parentType() === 'Unit' && unit.team === this.currentPlayer.team) {
            unit.resetActions(); //reset newly selected unit's action squares
            if (!unit.board) { unit.board = this.board; }
            if (!unit.view) { unit.view = this.view; }

            this.unitCallDrawSelected(unit, this.view);
            unitSelected = true;
        }
        return unitSelected;
    }

    unitCallDrawSelected(unit, view) {
        if (!unit.hasMoved) {
            unit.getMoves().forEach((pos) => {
                view.drawMoveHighlights(pos);
                view.drawGridElems(pos);
            });
        }
        if (!unit.hasAttacked && !unit.hasUpgraded) {
            unit.getAttacks().forEach((pos) => {
                view.drawAttackHighlights(pos);
                view.drawGridElems(pos);
            })
        }
        view.drawOutline(unit.pos);
    }

    barrackSelected(barrack) {
        return barrack && barrack.type() === 'Barrack' && barrack.team === this.currentPlayer.team;
    }

    unitBought(pos, menu, square) {
        let unitBought = false;
        let newPos = this.adjustMenuPosition(square.first(), pos);
        let unit;
        if (unit = menu.find(e => e.pos.x === newPos.x && e.pos.y === newPos.y)) {
            unit.pos = square.first().pos;
            square.push(unit);
            this.currentPlayer.units.push(unit);
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
            if (unit.onHomeTerf()) {
                unit.downgrade();
            }
            square.pop();
            if (square.length > 0 && square.last().type() === 'Treasure'
                && square.last().team !== this.currentPlayer.team) {
                square.last().pos = pos;
                this.board.grid.get(pos).push(square.pop());
            }
            this.board.grid.get(pos).push(unit);

            this.actionPoints--;
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
                this.currentPlayer.team === this.player.team ? this.enemy.removeUnit(attackedUnit) : this.player.removeUnit(attackedUnit);
            }
            this.actionPoints--;
            unit.hasAttacked = true;
            unitAttacked = true;
        }
        return unitAttacked;
    }
}

export default Game;