import View from './view.js';
import Game from './game.js';

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('treasure-game');
    const ctx = canvas.getContext("2d");

    const game = new Game();
    const view = new View(game, ctx);

    view.bindEvents(ctx);
});