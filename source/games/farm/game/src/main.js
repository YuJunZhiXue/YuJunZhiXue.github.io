import Game from './Game.js';

window.addEventListener('load', () => {
    // Basic error handling for module loading
    try {
        const game = new Game('game-canvas');
        game.start();
        console.log("Farm Game initialized.");
    } catch (e) {
        console.error("Game failed to start:", e);
    }
});
