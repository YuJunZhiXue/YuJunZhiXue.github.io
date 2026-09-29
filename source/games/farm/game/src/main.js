import Game from './Game.js';

function boot() {
    // Basic error handling for module loading
    try {
        const game = new Game('game-canvas');
        game.start();
        console.log("Farm Game initialized.");
    } catch (e) {
        console.error("Game failed to start:", e);
    }
}

// Start as soon as the DOM is ready; do not wait for window 'load'
// (which can be delayed indefinitely by third-party scripts).
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
