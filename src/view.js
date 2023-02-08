import Board from "./board";
import Game from "./game";
import Barrack from "./pieces/barrack";
import Base from "./pieces/base";
import Treasure from "./pieces/treasure";
import Unit from "./pieces/unit";
import Archer from "./pieces/units/archer";
import Defender from "./pieces/units/defender";
import Infantry from "./pieces/units/infantry";
import { isOnBoard, isButton, willPlayAgain } from "./utils";

class View {
    static SQUARE_DIM = 100;

    constructor(game, ctx) {
        this.game = game;
        this.ctx = ctx;
        this.ratio = null;
        this.drawBoard();
/*        addEventListener("resize", (event) => {
            this.clearBoard();
            this.drawBoard();
        });*/
    }

    resetView(game) {
        this.game = game;
        this.ratio = null;
        this.drawBoard();
    }

    clearBoard() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawBoard(unitPos, clickedPos) {
        this.clearBoard();
        let pixelWidth = Board.GRID_WIDTH * View.SQUARE_DIM;
        let pixelHeight = (Board.GRID_HEIGHT+1) * View.SQUARE_DIM;
        this.ctx.canvas.width = pixelWidth;
        this.ctx.canvas.height = pixelHeight;
        this.ratio = Math.min(
            window.innerHeight / this.ctx.canvas.height,
            window.innerWidth / this.ctx.canvas.width
        )
        this.ctx.scale(this.ratio, this.ratio);

        for (let y=0; y < Board.GRID_HEIGHT; y++) {
            for (let x=0; x < Board.GRID_WIDTH; x++) {
                this.drawGridSquare(x, y, "forestgreen", "darkgreen");

                this.drawGridElems({y: y, x: x}, unitPos, clickedPos);
            }
        }

        this.ctx.font = "40px Copperplate";
        this.game.currentPlayer.team === Board.ENEMY_TEAM ? this.ctx.fillStyle = "red" : this.ctx.fillStyle = "blue";
        let str = "Action Points: " + this.game.actionPoints.toString();
        this.ctx.strokeStyle = 'dimgrey';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(str, 10, (Board.GRID_HEIGHT+0.5) * View.SQUARE_DIM);
        this.ctx.fillText(str, 10, (Board.GRID_HEIGHT+0.5) * View.SQUARE_DIM);

        this.ctx.font = "30px Copperplate";
        str = "Troops: " + this.game.currentPlayer.units.length.toString() + "/8";
        this.ctx.strokeText(str, 10, (Board.GRID_HEIGHT+0.75) * View.SQUARE_DIM);
        this.ctx.fillText(str, 10, (Board.GRID_HEIGHT+0.75) * View.SQUARE_DIM);

        this.drawEndTurnButton();

        this.drawMidline();
    }

    drawMidline() {
        this.ctx.strokeStyle = 'lightskyblue';    
        this.ctx.beginPath();
        this.ctx.moveTo(0, Board.GRID_HEIGHT / 2 * View.SQUARE_DIM);
        this.ctx.lineTo((Board.GRID_HEIGHT-1) * View.SQUARE_DIM, Board.GRID_HEIGHT / 2 * View.SQUARE_DIM);
        this.ctx.stroke();
    }

    drawEndTurnButton() {
        this.ctx.fillStyle = 'lightskyblue';        
        this.ctx.fillRect(
            View.SQUARE_DIM * 4,
            (Board.GRID_HEIGHT+0.25) * View.SQUARE_DIM,
            View.SQUARE_DIM * 1,
            View.SQUARE_DIM * 0.5);
        this.ctx.strokeStyle = 'cornflowerblue';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            View.SQUARE_DIM * 4,
            (Board.GRID_HEIGHT+0.25) * View.SQUARE_DIM,
            View.SQUARE_DIM * 1,
            View.SQUARE_DIM * 0.5);
        this.ctx.font = "25px Copperplate";
        this.ctx.fillStyle = "dimgrey";
        this.ctx.lineWidth = 2;
        this.ctx.fillText("End", 4.25 * View.SQUARE_DIM, (Board.GRID_HEIGHT+0.45) * View.SQUARE_DIM);
        this.ctx.fillText("Turn", 4.15 * View.SQUARE_DIM, (Board.GRID_HEIGHT+0.65) * View.SQUARE_DIM);
    }

    drawWinningScreen() {
        console.log("DRAW WIN SCREEN")
        let img = new Image();
        img.onload = () => {
            this.ctx.drawImage(
                img,
                View.SQUARE_DIM * Math.floor((Board.GRID_WIDTH-2) / 2),
                View.SQUARE_DIM * (Math.floor((Board.GRID_HEIGHT-2) / 2)+0.25),
                View.SQUARE_DIM * 3, View.SQUARE_DIM * 1.5);
            this.ctx.beginPath();
            this.ctx.stroke();

            this.ctx.font = "30px Copperplate";
            this.ctx.lineWidth = 3;
            let str = "";
            if (this.game.currentPlayer.team === Board.PLAYER_TEAM) {
                this.ctx.fillStyle = "blue";
                this.ctx.strokeStyle = "darkblue";
                str += "Blue";
            } else {
                this.ctx.fillStyle = "red";
                this.ctx.strokeStyle = "maroon";
                str += "Red";
            }
            str += " Victory!"
            this.ctx.strokeText(str,
                View.SQUARE_DIM * (Board.GRID_WIDTH / 2 - 1),
                View.SQUARE_DIM * (Board.GRID_HEIGHT / 2 - 0.25));
            this.ctx.fillText(str,
                View.SQUARE_DIM * (Board.GRID_WIDTH / 2 - 1),
                View.SQUARE_DIM * (Board.GRID_HEIGHT / 2 - 0.25));
            
            this.drawPlayAgainButton();
        };
        img.src = './resources/wood.png';
    }

    drawPlayAgainButton() {
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = 'cornflowerblue';  
        this.ctx.strokeStyle = '#543000';      
        this.ctx.fillRect(
            View.SQUARE_DIM * (Board.GRID_WIDTH / 2 - 0.75),
            View.SQUARE_DIM * (Math.floor((Board.GRID_HEIGHT) / 2)),
            View.SQUARE_DIM * 1.5,
            View.SQUARE_DIM * 0.5);
        this.ctx.strokeRect(
            View.SQUARE_DIM * (Board.GRID_WIDTH / 2 - 0.75),
            View.SQUARE_DIM * (Math.floor((Board.GRID_HEIGHT) / 2)),
            View.SQUARE_DIM * 1.5,
            View.SQUARE_DIM * 0.5);
        this.ctx.strokeStyle = 'blue';
        this.ctx.font = "24px Copperplate";
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "grey"
        this.ctx.strokeText("Play Again?",
            View.SQUARE_DIM * (Board.GRID_WIDTH / 2 - 0.70),
            View.SQUARE_DIM * (Board.GRID_HEIGHT / 2 + 0.3));
        this.ctx.fillText("Play Again?",
            View.SQUARE_DIM * (Board.GRID_WIDTH / 2 - 0.70),
            View.SQUARE_DIM * (Board.GRID_HEIGHT / 2 + 0.3));
    }

    drawUpgradeConfirmation(pos) {
        this.ctx.fillStyle = 'lightskyblue';        
        this.ctx.fillRect(
            View.SQUARE_DIM * pos.x,
            View.SQUARE_DIM * pos.y,
            View.SQUARE_DIM * 1,
            View.SQUARE_DIM * 0.35);
        this.ctx.strokeStyle = 'cornflowerblue';
        this.ctx.strokeRect(
            View.SQUARE_DIM * pos.x,
            View.SQUARE_DIM * pos.y,
            View.SQUARE_DIM * 1,
            View.SQUARE_DIM * 0.35);
        this.ctx.lineWidth = 1;
        this.ctx.font = "20px Copperplate";
        this.ctx.fillStyle = "dimgrey";
        this.ctx.fillText("Upgrade?",
            View.SQUARE_DIM * pos.x,
            View.SQUARE_DIM * (pos.y + 0.25));
    }

    drawBarrackSelection(pos) {
         let newPos = this.adjustMenuPosition(pos);
        this.team === Board.ENEMY_TEAM ? this.ctx.fillStyle = "red" : this.ctx.fillStyle = "blue";
        let troopSelection = [];
        let img = new Image();
        img.onload = () => {
            this.ctx.drawImage(
                img,
                View.SQUARE_DIM * newPos.x,
                View.SQUARE_DIM * newPos.y,
                View.SQUARE_DIM * 3, View.SQUARE_DIM * 1.5);
            this.ctx.beginPath();
            this.ctx.stroke();

            this.ctx.font = "30px Copperplate";
            this.ctx.fillStyle = "white";
            this.ctx.lineWidth = 3;
            this.ctx.fillText("Buy New Troop?",
                View.SQUARE_DIM * (newPos.x + 0.35),
                View.SQUARE_DIM * (newPos.y + 0.35));
    
            troopSelection.push(new Infantry(this.game.currentPlayer.team, {y: newPos.y+0.5, x: newPos.x}));
            troopSelection.push(new Archer(this.game.currentPlayer.team, {y: newPos.y+0.5, x: newPos.x+1}));
            troopSelection.push(new Defender(this.game.currentPlayer.team, {y: newPos.y+0.5, x: newPos.x+2}));
            troopSelection.forEach( (unit) => {
                unit.draw(this.ctx);
            });
        };
        img.src = './resources/wood.png';
        return troopSelection;
    }

    adjustMenuPosition(pos) {
        let newPos = {};
        pos.x === 0 ? newPos.x = pos.x + 0.25 : newPos.x = pos.x - 2.25;
        pos.y === 0 ? newPos.y = pos.y + 0.5 : newPos.y = pos.y - 1;
        return newPos;
    }

    drawOutline(pos) {
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(
            View.SQUARE_DIM * pos.x,
            View.SQUARE_DIM * pos.y,
            View.SQUARE_DIM,
            View.SQUARE_DIM
        )
    }

    drawMoveHighlights(pos) {
        this.drawGridSquare(pos.x, pos.y, "mediumseagreen", 'seagreen');
    }

    drawAttackHighlights(pos) {
        this.drawGridSquare(pos.x, pos.y, "lightskyblue", "cornflowerblue")
    }

    drawGridElems(pos, unitPos, clickedPos) {
        let gridSquare = this.game.board.grid.get(pos);
        for (let i=0; i < gridSquare.length; i++) {
            gridSquare[i].draw(this.ctx, unitPos, clickedPos);
        }
        this.ctx.beginPath();
    }

    drawGridSquare(x, y, fillColor, outlineColor) {
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(
            View.SQUARE_DIM * x,
            View.SQUARE_DIM * y,
            View.SQUARE_DIM,
            View.SQUARE_DIM);
        this.ctx.strokeStyle = outlineColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            View.SQUARE_DIM * x,
            View.SQUARE_DIM * y,
            View.SQUARE_DIM,
            View.SQUARE_DIM
        )
    }

    bindEvents(ctx) {
        ctx.canvas.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        let x = Math.floor(event.offsetX / (View.SQUARE_DIM * this.ratio))
        let y = Math.floor(event.offsetY / (View.SQUARE_DIM * this.ratio))
        let xExact = event.offsetX / (View.SQUARE_DIM * this.ratio);
        let yExact = event.offsetY / (View.SQUARE_DIM * this.ratio);
        let pos = {y, x};
        let posExact = {y: yExact, x: xExact};

        if (this.game.board.isWon()) {
        //    this.drawWinningScreen();
            if (willPlayAgain(posExact)) {
                this.game.resetGame(this);
                this.drawBoard();
            }
        } else {
            if (isOnBoard(pos)) {
                this.game.ctx.clickedPos = pos
                this.game.ctx.exactPos = posExact;
                this.game.stateMachine();
            } else if (isButton(posExact)) {
                this.game.switchPlayers();
                this.drawBoard();
            }
        }
    }
}

function drawUpgradeButton(unit, ctx, x, y) {
    unit.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .15,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .15,
        View.SQUARE_DIM * .1,
        0, 2.0 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "30px Copperplate";
    ctx.fillText("+", View.SQUARE_DIM * x + View.SQUARE_DIM * 0.06,
    View.SQUARE_DIM * y + View.SQUARE_DIM * .22);
}

function drawStats(unit, ctx, x, y) {
    unit.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.font = "35px Copperplate";
    ctx.strokeStyle = 'dimgrey';
    ctx.lineWidth = 3;
    ctx.strokeText(
        "A"+unit.attack.toString(),
        View.SQUARE_DIM * x + View.SQUARE_DIM * .3,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .50);
    ctx.strokeText(
        "D"+unit.defense.toString(),
        View.SQUARE_DIM * x + View.SQUARE_DIM * .3,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .75);
    ctx.fillText(
        "A"+unit.attack.toString(),
        View.SQUARE_DIM * x + View.SQUARE_DIM * .3,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .50);
    ctx.fillText(
        "D"+unit.defense.toString(),
        View.SQUARE_DIM * x + View.SQUARE_DIM * .3,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .75);
}

Barrack.prototype.draw = function(ctx) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.fillRect(
        View.SQUARE_DIM * this.pos.x + View.SQUARE_DIM * .10,
        View.SQUARE_DIM * this.pos.y + View.SQUARE_DIM * .20,
        View.SQUARE_DIM * .80,
        View.SQUARE_DIM * .60);
}

Base.prototype.draw = function(ctx) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(
        View.SQUARE_DIM * this.pos.x + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * this.pos.y + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * .35,
        0, 2.0 * Math.PI);
    ctx.fill();
}

Treasure.prototype.draw = function(ctx) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "darkred" : ctx.fillStyle = "darkblue";
    ctx.fillRect(
        View.SQUARE_DIM * this.pos.x + View.SQUARE_DIM * .15,
        View.SQUARE_DIM * this.pos.y + View.SQUARE_DIM * .30,
        View.SQUARE_DIM * .70,
        View.SQUARE_DIM * .40);
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "gold" : ctx.fillStyle = "silver";
    ctx.fillRect(
        View.SQUARE_DIM * this.pos.x + View.SQUARE_DIM * .20,
        View.SQUARE_DIM * this.pos.y + View.SQUARE_DIM * .35,
        View.SQUARE_DIM * .60,
        View.SQUARE_DIM * .30);
}

export function drawUpgradeConfirmation(ctx, pos) {
    ctx.fillStyle = 'lightskyblue';        
    ctx.fillRect(
        View.SQUARE_DIM * pos.x,
        View.SQUARE_DIM * pos.y,
        View.SQUARE_DIM * 1,
        View.SQUARE_DIM * 0.35);
    ctx.strokeStyle = 'cornflowerblue';
    ctx.strokeRect(
        View.SQUARE_DIM * pos.x,
        View.SQUARE_DIM * pos.y,
        View.SQUARE_DIM * 1,
        View.SQUARE_DIM * 0.35);
    ctx.lineWidth = 1;
    ctx.font = "20px Copperplate";
    ctx.fillStyle = "dimgrey";
    ctx.fillText("Upgrade?",
        View.SQUARE_DIM * pos.x,
        View.SQUARE_DIM * (pos.y + 0.25));
}

Unit.prototype.draw = function(ctx, unitPos, clickedPos) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    this.image.onload = () => {
        ctx.drawImage(
            this.image,
            View.SQUARE_DIM * this.pos.x,
            View.SQUARE_DIM * this.pos.y,
            View.SQUARE_DIM, View.SQUARE_DIM);
        ctx.beginPath();
        ctx.stroke();
        drawStats(this, ctx, this.pos.x, this.pos.y);
        if (this.isUpgradable()) {
            drawUpgradeButton(this, ctx, this.pos.x, this.pos.y);
            if (unitPos && clickedPos) {
                drawUpgradeConfirmation(ctx, unitPos);
            }
        }
    };
    this.image.src = this.image.src;
}

export default View;