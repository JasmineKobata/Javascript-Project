const View = require('./view.js')
const Game = require('./game.js')

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('treasure-game');
    const ctx = canvas.getContext("2d");

    const game = new Game();
    new View(game, ctx);
});