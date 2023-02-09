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

    constructor(game, ctx, el) {
        this.game = game;
        this.el = el;
        this.ctx = ctx;
        this.ratio = null;
        this.images = this.renderImg();
        this.drawBoard();
        this.drawMenu({y: Board.GRID_HEIGHT, x: Board.GRID_WIDTH});
        // addEventListener("resize", (event) => {
        //     this.clearBoard();
        //     this.drawBoard();
        // });
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
        this.invisifyButtons();

        this.images.background.onload(unitPos, clickedPos);
    }

    invisifyButtons() {
        const e = [];
        e.push(document.querySelector(".about"));
        e.push(document.querySelector(".rules"));
        e.push(document.querySelector(".abouttitle"));
        e.push(document.querySelector(".rulestitle"));

        e.forEach(e => {if (e) {e.style.visibility = 'hidden'}});
    }

    drawBoardWithoutOnload(unitPos, clickedPos) {
        for (let y=0; y < Board.GRID_HEIGHT; y++) {
            for (let x=0; x < Board.GRID_WIDTH; x++) {
                this.drawGridSquare(x, y, "darkgreen");
                this.drawGridElems({y: y, x: x}, unitPos, clickedPos);
            }
        }
        this.drawMidline();

        this.drawEndTurnButton();

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

    drawMenu(pos) {
        const grid = document.createElement("ul");
        grid.classList.add("grid");

        let width = 100 * this.ratio;
        let height = 50 * this.ratio;
        grid.style.width = width.toString()+"px";
        grid.style.height = height.toString()+"px";
    
        const cell = document.createElement("li");
        cell.style.backgroundColor = "lightskyblue";
        cell.style.border = "1px solid cornflowerblue";
        cell.style.width = grid.style.width;
        cell.style.height = grid.style.height;
        cell.style.position = "absolute";
        cell.style.left = ((pos.x-1.5)*this.ratio*View.SQUARE_DIM).toString()+"px"
        cell.style.top = ((pos.y+0.32)*this.ratio*View.SQUARE_DIM).toString()+"px"
        cell.style.margin = "0px"
        cell.style.listStyle = "none";
        cell.style.cursor = "pointer";
        cell.innerHTML = "Menu"
        cell.style.font = "25px Copperplate"
        cell.style.color = "dimgrey"
        cell.style.textAlign = "center"
        cell.style.lineHeight = (50*this.ratio).toString()+"px";
        cell.classList.add("button");

        grid.appendChild(cell);
        this.el.appendChild(grid);

        this.drawMenuOptions(pos);
        this.drawRules(pos);
        this.drawAbout(pos);
    }

    drawMenuOptions(pos) {
        const menu = document.createElement("ul");
        menu.classList.add("menu");

        let width = 100 * this.ratio;
        let height = 50 * this.ratio;
        menu.style.width = width.toString()+"px";
        menu.style.height = height.toString()+"px";
    
        const rules = document.createElement("li");
        this.drawButton("Rules", rules, {x: pos.x, y: pos.y - 0.5}, menu);
        rules.classList.add("rules");
        const about = document.createElement("li");
        this.drawButton("About", about, pos, menu);
        about.classList.add("about");

        menu.appendChild(rules);
        menu.appendChild(about);
        menu.style.visibility = 'hidden'
        this.el.appendChild(menu);
    }

    drawRules(pos) {
        const title = document.createElement("ul");
        title.classList.add("rulestitle");
        this.drawMenuDisplayBox("How To Play", title, title);

        // let width = 500 * this.ratio;
        // let height = 600 * this.ratio;
        // title.style.width = width.toString()+"px";
        // title.style.height = height.toString()+"px";
    
        const rules = document.createElement("li");
        this.drawMenuInnerDisplayBox("Steal the enemy's treasure & bring it back to your base!<p>BUYING | Select the barracks to buy troops. All units can move up to 2 spaces in any direction. There are 3 types of troops:</p>-Infantry: Defense 2, Attack 1, Range 1<br>-Archer: Defense 1, Attack 1, Range 2<br>-Defender: Defense 3, Attack 1, Range 1<br><p>UPGRADING | When in enemy territory, units can be ugraded as follows:</p>-Infantry: Defense +1, Attack +2<br>-Archer: Defense +1, Attack +1<br>-Defender: Defense +2, Attack +1<br><p>Units cannot attack after upgrading until the next round. Stats return to normal once returning to friendly territory.</p><p>TREASURE | Pick up the treasure by moving a unit onto the square containing it. (You can only pick up enemy treasure.)</p><p>PRICE CHART<br>Moving or Attacking: 1 Action Point<br>Buying or Upgrading: 2 Action Points</p>", rules, title);
        rules.style.font = "12px Copperplate";
        rules.classList.add("rulesbox");

        title.appendChild(rules);
        title.style.visibility = 'hidden'
        this.el.appendChild(title);
    }

    drawAbout(pos) {
        const title = document.createElement("ul");
        title.classList.add("abouttitle");

        this.drawMenuDisplayBox("About", title, title);
    
        const rules = document.createElement("li");
        this.drawMenuInnerDisplayBox("<br><br><br><br><br><p>Game developed by Jasmine Kobata</p><br><p><a href='https://github.com/JasmineKobata/Javascript-Project'>Treasure Wars! GitHub Repo</p><br><p><a href='https://www.appacademy.io/'>App Academy</a> Javascript Project</p>", rules, title);
        rules.style.font = "15px Copperplate";
        rules.classList.add("aboutbox");

        title.appendChild(rules);
        title.style.visibility = 'hidden'
        this.el.appendChild(title);
    }

    drawMenuDisplayBox(str, box, title) {
        let width = 450 * this.ratio;
        let height = 600 * this.ratio;
        box.style.width = width.toString()+"px";
        box.style.height = height.toString()+"px";
        box.style.backgroundColor = "lightskyblue";
        box.style.border = "1px solid cornflowerblue";
        box.style.position = "absolute";
        box.style.left = (this.ratio*(View.SQUARE_DIM + 10)).toString()+"px"
        box.style.top = (this.ratio*(View.SQUARE_DIM+10)).toString()+"px"
        box.style.margin = "0px"
        box.style.listStyle = "none";
        box.style.cursor = "pointer";
        box.innerHTML = str;
        box.style.font = "25px Copperplate"
        box.style.color = "dimgrey"
        box.style.textAlign = "center"
        box.style.lineHeight = (50*this.ratio).toString()+"px";
    }

    drawMenuInnerDisplayBox(str, box, title) {
        let width = 375 * this.ratio;
        let height = 475 * this.ratio;
        box.style.width = width.toString()+"px";
        box.style.height = height.toString()+"px";
        box.style.backgroundColor = "cornflowerblue";
        box.style.border = "1px solid cornflowerblue";
        box.style.position = "absolute";
        box.style.left = (this.ratio*(View.SQUARE_DIM/2 + 10)).toString()+"px"
        box.style.top = (this.ratio*(View.SQUARE_DIM/2+10)).toString()+"px"
        box.style.margin = "0px"
        box.style.listStyle = "none";
        box.style.cursor = "pointer";
        box.innerHTML = str;
        box.style.font = "25px Copperplate"
        box.style.color = "white"
        box.style.textAlign = "center"
    }

    drawButton(str, cell, pos, container) {
        cell.style.backgroundColor = "lightskyblue";
        cell.style.border = "1px solid cornflowerblue";
        cell.style.width = container.style.width;
        cell.style.height = container.style.height;
        cell.style.position = "absolute";
        cell.style.left = ((pos.x-1.5)*this.ratio*View.SQUARE_DIM).toString()+"px"
        cell.style.top = ((pos.y+0.32)*this.ratio*View.SQUARE_DIM).toString()+"px"
        cell.style.margin = "0px"
        cell.style.listStyle = "none";
        cell.style.cursor = "pointer";
        cell.innerHTML = str
        cell.style.font = "20px Copperplate"
        cell.style.color = "dimgrey"
        cell.style.textAlign = "center"
        cell.style.lineHeight = (50*this.ratio).toString()+"px";
    }

    drawWinningScreen() {
        let img = new Image();
        img.src = './resources/wood.png';
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
            this.images.barrack.onload(newPos);

        this.ctx.font = "30px Copperplate";
        this.ctx.fillStyle = "white";
        this.ctx.lineWidth = 3;
        this.ctx.fillText("Buy New Troop?",
            View.SQUARE_DIM * (newPos.x + 0.35),
            View.SQUARE_DIM * (newPos.y + 0.35));
    
        let inf = new Infantry(this.game.currentPlayer.team, {y: newPos.y+0.5, x: newPos.x});
        let arch = new Archer(this.game.currentPlayer.team, {y: newPos.y+0.5, x: newPos.x+1});
        let def = new Defender(this.game.currentPlayer.team, {y: newPos.y+0.5, x: newPos.x+2});
        inf.board = this.game.board;
        arch.board = this.game.board;
        def.board = this.game.board;
        inf.view = this.game.view;
        arch.view = this.game.view;
        def.view = this.game.view;
        troopSelection.push(inf);
        troopSelection.push(arch);
        troopSelection.push(def);
        troopSelection.forEach( (unit) => {
            unit.draw(this.ctx, this.game.currentPlayer);
        });
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
        this.drawGridSquare(pos.x, pos.y, 'seagreen', "mediumseagreen");
    }

    drawAttackHighlights(pos) {
        this.drawGridSquare(pos.x, pos.y, "cornflowerblue", "lightskyblue")
    }

    drawGridElems(pos, unitPos, clickedPos) {
        let gridSquare = this.game.board.grid.get(pos);
        for (let i=0; i < gridSquare.length; i++) {
            gridSquare[i].draw(this.ctx, this.game.currentPlayer, unitPos, clickedPos);
        }
        this.ctx.beginPath();
    }

    drawGridSquare(x, y, outlineColor, fillColor) {
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.globalAlpha = 0.60;
            this.ctx.fillRect(
                View.SQUARE_DIM * x,
                View.SQUARE_DIM * y,
                View.SQUARE_DIM,
                View.SQUARE_DIM
            )
        }
        this.ctx.strokeStyle = outlineColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            View.SQUARE_DIM * x,
            View.SQUARE_DIM * y,
            View.SQUARE_DIM,
            View.SQUARE_DIM
        )
        this.ctx.globalAlpha = 1;
    }

    renderImg() {
        let pixelWidth = Board.GRID_WIDTH * View.SQUARE_DIM;
        let pixelHeight = (Board.GRID_HEIGHT+1) * View.SQUARE_DIM;
        this.ctx.canvas.width = pixelWidth;
        this.ctx.canvas.height = pixelHeight;
        this.ratio = Math.min(
            window.innerHeight / this.ctx.canvas.height,
            window.innerWidth / this.ctx.canvas.width
        )
        this.ctx.scale(this.ratio, this.ratio);
        let images = {};
        images.background = new Image();
        images.background.src = "./resources/grass2.png";
        images.background.onload = (unitPos, clickedPos) => {
            this.ctx.drawImage(
                images.background, 0, 0,
               pixelWidth, pixelHeight,
               0, 0,
               pixelWidth, pixelHeight);
            this.ctx.beginPath();
            this.ctx.stroke();
            this.drawBoardWithoutOnload(unitPos, clickedPos);
        }

        images.barrack = new Image();
        images.barrack.src = "./resources/wood.png";
        images.barrack.onload = (pos) => {
            this.ctx.drawImage(
                images.barrack,
                View.SQUARE_DIM * pos.x,
                View.SQUARE_DIM * pos.y,
                View.SQUARE_DIM * 3, View.SQUARE_DIM * 1.5);
            this.ctx.beginPath();
            this.ctx.stroke();
        };

        return images;
    }

    bindEvents(ctx) {
        const button = document.querySelector(".button");
        button.addEventListener("click", this.handleButton.bind(this));
        const about = document.querySelector(".about");
        if (about) {about.addEventListener("click", this.handleAbout.bind(this));}
        const rules = document.querySelector(".rules");
        if (rules) {rules.addEventListener("click", this.handleRules.bind(this));}
        ctx.canvas.addEventListener('click', this.handleClick.bind(this));
    }

    handleAbout(event) {
        const e = document.querySelector(".abouttitle");
        this.invisifyButtons();
        e.style.visibility = 'visible';
    }

    handleRules(event) {
        const e = document.querySelector(".rulestitle");
        this.invisifyButtons();
        e.style.visibility = 'visible';
    }

    handleButton(event) {
        const e1 = document.querySelector(".about")
        const e2 = document.querySelector(".rules")

        e1.style.visibility = 'visible';
        e2.style.visibility = 'visible';
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
            this.drawBoard();
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
        View.SQUARE_DIM * this.pos.y + View.SQUARE_DIM * .70,
        View.SQUARE_DIM * .80,
        View.SQUARE_DIM * .20);

    this.image.onload = () => {
        ctx.drawImage(
            this.image,
            View.SQUARE_DIM * this.pos.x,
            View.SQUARE_DIM * this.pos.y,
            View.SQUARE_DIM, View.SQUARE_DIM);
        ctx.beginPath();
        ctx.stroke();
    };
    this.image.onload();
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
    this.image.onload = () => {
        ctx.drawImage(
            this.image,
            View.SQUARE_DIM * this.pos.x,
            View.SQUARE_DIM * this.pos.y,
            View.SQUARE_DIM, View.SQUARE_DIM);
        ctx.beginPath();
        ctx.stroke();
    };
    this.image.onload();
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

Unit.prototype.draw = function(ctx, currentPlayer, unitPos, clickedPos) {
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
        if (this.isUpgradable(currentPlayer)) {
            drawUpgradeButton(this, ctx, this.pos.x, this.pos.y);
            if (unitPos && clickedPos) {
                drawUpgradeConfirmation(ctx, unitPos);
            }
        }
    };
    this.image.onload();
    // this.image.src = this.image.src;
}

export default View;