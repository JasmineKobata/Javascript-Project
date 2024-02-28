import Board from "./board";
import HumanPlayer from "./humanPlayer";
import { isUpgradeButton, isUpgradeConfirmation } from "./utils";

const MAX_AP = 4;
const MAX_UNITS = 8;

class Game {
    constructor() {
        this.view = null;
        this.setGame();
        // this.setConnection();
    }

    resetGame(view) {
        this.view = view;
        this.setGame();
    }

    setGame() {
        this.board = new Board();
        this.state = 'unselected';
        this.player = new HumanPlayer(Board.PLAYER_TEAM, this.board.treasure.player);
        this.enemy = new HumanPlayer(Board.ENEMY_TEAM, this.board.treasure.enemy);
        this.currentPlayer = this.player;
        this.actionPoints = MAX_AP;
        this.ctx = {}; //{ clickedPos, selectedSquare }
    }

    //Next Steps:
    //- check if player treasure gets updated when treasure changes position
    //- if no units exist, buy unit

    setConnection() {
        reply = "";
        conn = new Socket;

        // if (conn.open("http://127.0.0.1:5500/index.html")) {
        //     console.log("HI");
        //     // conn.write("GET /index.html HTTP/1.0\n\n");
        //     // reply = conn.read(999999);
        //     conn.close();
        // }
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
        this.actionPoints = MAX_AP;
        this.state = 'unselected';
        this.currentPlayer === this.player ? this.currentPlayer = this.enemy : this.currentPlayer = this.player;
    }

    callStateMachine() {
        if (this.currentPlayer.type() === 'HumanPlayer')
            this.stateMachine(this.board.grid.get(this.ctx.clickedPos));
        else
            this.stateMachine(chooseMove());
    }

    //ctx -> {clickedPos always set, selectedSquare that will be set in unselected stage}
    stateMachine(square) {
        // let square = this.board.grid.get(this.ctx.clickedPos);
        
        switch (this.state) {
            case 'unselected':
                this.redirectState(square);
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
                    this.redirectState(square);
                }
                this.noMoreMovesDisplay();
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
                    this.redirectState(square);
                }
                this.noMoreMovesDisplay();
                break;
            case 'upgrade':
                //if unit is upgraded
                if (this.unitUpgraded(this.ctx.exactPos, this.ctx.selectedSquare)) {
                    this.state = 'unselected';
                    if (this.actionPoints === 0) { this.switchPlayers(); }
                    this.view.drawBoard();
                }
                else {
                    this.redirectState(square);
                }
                this.noMoreMovesDisplay();
                break;
            default:
                // console.log("ERROR: undefined state");
        }
    }

    redirectState(square) {
        this.view.drawBoard();
        //if unit upgrade is selected
        if (this.unitUpgradeable(this.ctx.exactPos, square.last())) {
            this.state = 'upgrade';
        } //if unit is selected
        else if (this.unitSelected(square.last())) {
            this.state = 'unit';
        } //else if barrack is selected
        else if (this.actionPoints > 1 && this.currentPlayer.units.length < MAX_UNITS
            && this.barrackSelected(square.first())) {
            this.ctx.menu = this.view.drawBarrackSelection(square.first().pos);
            this.state = 'barrack';
        } else {
            this.state = 'unselected';
        }
        this.ctx.selectedSquare = square;
    }

    noMoreMovesDisplay() {
        if (!this.movesAvailable() && this.actionPoints < MAX_AP) {
            const noMoreMoves = this.view.noMoreMoves.querySelector(".noMoreMoves");
            const button = noMoreMoves.querySelector(".movesButton")
        
            noMoreMoves.innerHTML = this.view.updateNoMoreMovesStr();
            noMoreMoves.appendChild(button);
            
            this.view.noMoreMoves.style.visibility = "visible"
        }
    }

    movesAvailable() {
        let bool = false;
        this.currentPlayer.units.forEach(unit => {
            bool ||= !unit.hasMoved;
            if (!unit.hasAttacked) {
                unit.getAttacks();
            }
            bool ||= !unit.hasUpgraded && unit.attacks.length > 0;
            bool ||= this.actionPoints > 1 && unit.isUpgradable(this.currentPlayer);
            bool ||= this.actionPoints > 1 && this.barracksEmpty();
        })
        return bool;
    }

    barracksEmpty() {
        let barracks;
        if (this.currentPlayer === this.player) {
            barracks = this.board.barracks.player;
        } else {
            barracks = this.board.barracks.enemy;
        }

        let res = false;
        barracks.forEach(b => {
            let bool = true;
            const barrackSquare = this.board.grid.get(b.pos)
            barrackSquare.forEach(unit => {
                if (unit.parentType() === 'Unit') bool = false;
            })
            res ||= bool;
        })
        return res;
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
            let treasureIdx = this.getTreasureIdx(square);
            if (treasureIdx !== null) {
                square[treasureIdx].pos = pos;
                this.board.grid.get(pos).push(square[treasureIdx]);
                square.splice(treasureIdx, 1);
            }
            this.board.grid.get(pos).push(unit);

            this.actionPoints--;
            unit.hasMoved = true;
            unitMoved = true;
        }
        return unitMoved;
    }

    getTreasureIdx(square) {
        for (let i=0; i<square.length; i++) {
            if (square[i].team !== this.currentPlayer.team
                && square[i].type() === 'Treasure') {
                return i;
            }
        }
        return null
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