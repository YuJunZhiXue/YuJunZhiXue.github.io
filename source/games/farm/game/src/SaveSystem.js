// Orchestrates localStorage persistence. Each subsystem owns its own
// serialize()/deserialize() — SaveSystem just gathers those snapshots into one
// blob and distributes them back on load, so adding saveable state means
// extending a module's serialize(), not editing branches here.
import Interior from './Interior.js';

const SAVE_KEY = 'farmgame.save.v1';
const SAVE_VERSION = 1;

export default class SaveSystem {
    static hasSave() {
        try {
            return localStorage.getItem(SAVE_KEY) !== null;
        } catch {
            return false;
        }
    }

    static save(game) {
        const data = {
            version: SAVE_VERSION,
            savedAt: Date.now(),
            time: game.timeSystem.serialize(),
            inventory: game.inventory.serialize(),
            shop: game.shop.serialize(),
            world: game.world ? game.world.serialize() : null,
            player: {
                x: game.player.x,
                y: game.player.y,
                direction: game.player.direction,
                energy: game.player.energy
            },
            scene: game.scene,
            returnPos: game.returnPos,
            interiorLabel: game.interior ? game.interior.label : null,
            quests: game.questLog ? game.questLog.serialize() : null
        };
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    static load(game) {
        let raw;
        try {
            raw = localStorage.getItem(SAVE_KEY);
        } catch {
            return false;
        }
        if (!raw) return false;

        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            console.error('Corrupt save, ignoring:', e);
            return false;
        }
        if (!data || data.version !== SAVE_VERSION) {
            console.warn('Save version mismatch, ignoring.');
            return false;
        }

        game.timeSystem.deserialize(data.time);
        game.inventory.deserialize(data.inventory);
        game.shop.deserialize(data.shop);
        if (game.questLog) game.questLog.deserialize(data.quests);
        if (data.world && game.world) game.world.deserialize(data.world);
        if (data.player) {
            game.player.x = data.player.x;
            game.player.y = data.player.y;
            game.player.direction = data.player.direction;
            if (typeof data.player.energy === 'number') game.player.energy = data.player.energy;
        }
        // Restore which scene the player was in (and the room, if indoors).
        game.scene = data.scene === 'interior' ? 'interior' : 'farm';
        game.returnPos = data.returnPos || null;
        if (game.scene === 'interior') {
            if (!game.interior) game.interior = new Interior();
            game.interior.setRoom(data.interiorLabel || '');
        }
        // Re-sync season visuals (tileset + tree sprites) to the loaded date.
        if (game.world) game.world.updateSeason(game.timeSystem.getSeason());
        return true;
    }

    static clear() {
        try {
            localStorage.removeItem(SAVE_KEY);
        } catch {
            /* ignore */
        }
    }
}
