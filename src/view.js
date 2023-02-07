import Board from "./board";
import Barrack from "./pieces/barrack";
import Base from "./pieces/base";
import Treasure from "./pieces/treasure";
import Unit from "./pieces/unit";
import Archer from "./pieces/units/archer";
import Defender from "./pieces/units/defender";
import Infantry from "./pieces/units/infantry";
import { isOnBoard } from "./utils";

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

    clearBoard() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawBoard() {
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

                this.drawGridElems({y: y, x: x});
            }
        }
        this.ctx.font = "40px Copperplate";
        this.game.currentPlayer === Board.ENEMY_TEAM ? this.ctx.fillStyle = "red" : this.ctx.fillStyle = "blue";
        let str = "Action Points: "+this.game.actionPoints.toString();
        this.ctx.strokeStyle = 'dimgrey';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(str, 10, (Board.GRID_HEIGHT+0.5) * View.SQUARE_DIM);
        this.ctx.fillText(str, 10, (Board.GRID_HEIGHT+0.5) * View.SQUARE_DIM);
    }

    drawBarrackSelection(pos) {
        this.ctx.fillStyle = 'lightskyblue';
        console.log(pos);
        let newPosX;
        pos.x === 0 ? newPosX = pos.x + 0.25 : newPosX = pos.x - 2.25;
        let newPosY = pos.y - 1;
        
        this.ctx.fillRect(
            View.SQUARE_DIM * newPosX,
            View.SQUARE_DIM * newPosY,
            View.SQUARE_DIM * 3,
            View.SQUARE_DIM * 1.5);
        this.ctx.strokeStyle = 'cornflowerblue';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            View.SQUARE_DIM * newPosX,
            View.SQUARE_DIM * newPosY,
            View.SQUARE_DIM * 3,
            View.SQUARE_DIM * 1.5);



        new Infantry().draw(this.ctx, newPosX, newPosY + 0.5);
        new Archer().draw(this.ctx, newPosX + 1, newPosY + 0.5);
        new Defender().draw(this.ctx, newPosX + 2, newPosY + 0.5);
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

    drawGridElems(pos) {
        let gridSquare = this.game.board.grid.get(pos);
        for (let i=0; i < gridSquare.length; i++) {
            gridSquare[i].draw(this.ctx, pos.x, pos.y);
        }
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

        let pos = {y, x}
        if (isOnBoard(pos)) {
            this.game.ctx.clickedPos = pos
            this.game.stateMachine();
//            this.game.mouseClicked(pos);
        }
    }
}

function drawDot(unit, ctx, x, y) {
    unit.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * .1,
        0, 2.0 * Math.PI);
    ctx.fill();
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

Barrack.prototype.draw = function(ctx, x, y) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.fillRect(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .10,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .20,
        View.SQUARE_DIM * .80,
        View.SQUARE_DIM * .60);
}

Base.prototype.draw = function(ctx, x, y) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .50,
        View.SQUARE_DIM * .35,
        0, 2.0 * Math.PI);
    ctx.fill();
}

Treasure.prototype.draw = function(ctx, x, y) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "darkred" : ctx.fillStyle = "darkblue";
    ctx.fillRect(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .15,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .30,
        View.SQUARE_DIM * .70,
        View.SQUARE_DIM * .40);
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "gold" : ctx.fillStyle = "silver";
    ctx.fillRect(
        View.SQUARE_DIM * x + View.SQUARE_DIM * .20,
        View.SQUARE_DIM * y + View.SQUARE_DIM * .35,
        View.SQUARE_DIM * .60,
        View.SQUARE_DIM * .30);
}

Unit.prototype.draw = function(ctx, x, y) {
    this.team === Board.ENEMY_TEAM ? ctx.fillStyle = "red" : ctx.fillStyle = "blue";
    this.image.onload = () => {
        ctx.drawImage(
            this.image,
            View.SQUARE_DIM * x,
            View.SQUARE_DIM * y,
            View.SQUARE_DIM, View.SQUARE_DIM);
        ctx.beginPath();
        ctx.stroke();
    //    drawDot(this, ctx, x, y);
        drawStats(this, ctx, x, y);
    };
    this.image.src = this.image.src;
    
}

export default View;