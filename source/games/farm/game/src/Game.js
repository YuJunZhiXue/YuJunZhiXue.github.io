import TimeSystem from './TimeSystem.js';
import Input from './Input.js';
import World from './World.js';
import Inventory from './Inventory.js';
import Shop from './Shop.js';
import TilesetManager from './TilesetManager.js';
import Tilemap from './Tilemap.js';
import EventEmitter from './EventEmitter.js';
import SaveSystem from './SaveSystem.js';
import Interior from './Interior.js';
import QuestLog from './QuestLog.js';
import { toolAreaSide } from './Tools.js';

// Energy drained per swing of each working tool (flat, regardless of tier — an
// upgraded tool affects more tiles for the same cost).
const ENERGY_COST = { 'Hoe': 3, 'Watering Can': 2, 'Scythe': 2 };

export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 320;
        this.height = 240;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.step = 1 / 60;

        this.events = new EventEmitter();
        this.timeSystem = new TimeSystem(this.events);
        this.input = new Input(this.canvas);
        this.tilesetManager = new TilesetManager();

        this.assets = {
            player: new Image(),
            house: new Image(),
            details: new Image(),
            babyChicken: new Image(),
            chicken: new Image(),
            cow: new Image(),
            chest: new Image()
        };
        this.assetsLoaded = 0;
        this.totalAssets = 13; // 7 images + 6 tilesets

        this.world = null;
        // Scene: 'farm' (the overworld) or 'interior' (inside a building).
        this.scene = 'farm';
        this.interior = null;
        this.returnPos = null;
        this.player = {
            // Spawn on open grass below the buildings (clear of collision footprints).
            x: 160, y: 208, speed: 60, frame: 0, direction: 0,
            animTimer: 0, isWalking: false, flipX: false,
            energy: 100, maxEnergy: 100
        };

        this.helpOpen = false;            // the "?" controls overlay

        // Pointer / click-to-move state.
        this.pointerActive = false;       // true when the mouse is the active input
        this.moveTarget = null;           // world/room point the player is walking to
        this.lastMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.hoverTileX = 0;
        this.hoverTileY = 0;
        this.facingTileX = 0;
        this.facingTileY = 0;
        
        this.loop = this.loop.bind(this);
        this.camera = { x: 0, y: 0, width: this.width, height: this.height };
        this.inventory = new Inventory();
        this.shop = new Shop(this.inventory, 100, this.events);
        this.questLog = new QuestLog(this.events);
        this.dialogueOpen = false;
        this.dialogueNpc = null;

        // A harvested crop flows into the inventory via the event bus rather than
        // being handled inline in the action dispatch.
        this.events.on('crop:harvested', (crop) => {
            const cropName = crop.name.replace(' Seeds', '');
            this.inventory.addItem({ name: cropName, type: 'resource', icon: cropName.charAt(0), count: 1 });
        });
    }

    start() {
        const checkLoad = () => {
            this.assetsLoaded++;
            if (this.assetsLoaded >= this.totalAssets) this.initWorld();
        };
        const onLoad = () => checkLoad();

        this.assets.player.onload = onLoad;
        this.assets.player.src = 'assets/16x16/Sprites/$farmer.png';
        this.assets.house.onload = onLoad;
        this.assets.house.src = 'assets/16x16/Tilesets_Modular/vectoraith_tileset_farmingsims_buildings.png';
        this.assets.details.onload = onLoad;
        this.assets.details.src = 'assets/16x16/Tilesets_Compact/vectoraith_tileset_farmingsims_details.png';
        
        this.assets.babyChicken.onload = onLoad;
        this.assets.babyChicken.src = 'assets/16x16/Sprites/$chicken_chick.png';
        this.assets.chicken.onload = onLoad;
        this.assets.chicken.src = 'assets/16x16/Sprites/$chicken_hen.png';
        this.assets.cow.onload = onLoad;
        this.assets.cow.src = 'assets/16x16/Sprites/$cow_brown.png';
        this.assets.chest.onload = onLoad;
        this.assets.chest.src = 'assets/Objects/chest.png';

        this.tilesetManager.loadTileset('spring', 'assets/16x16/Tilesets_Modular/vectoraith_tileset_farmingsims_terrain_spring_expanded.png', { 
            tileSize: 16, offsetX: 0, offsetY: 0 
        }).then(onLoad).catch(onLoad);

        this.tilesetManager.loadTileset('summer', 'assets/16x16/Tilesets_Modular/vectoraith_tileset_farmingsims_terrain_summer_expanded.png', { 
            tileSize: 16, offsetX: 0, offsetY: 0 
        }).then(onLoad).catch(onLoad);

        this.tilesetManager.loadTileset('fall', 'assets/16x16/Tilesets_Modular/vectoraith_tileset_farmingsims_terrain_fall_expanded.png', { 
            tileSize: 16, offsetX: 0, offsetY: 0 
        }).then(onLoad).catch(onLoad);

        this.tilesetManager.loadTileset('winter', 'assets/16x16/Tilesets_Modular/vectoraith_tileset_farmingsims_terrain_winter_expanded.png', { 
            tileSize: 16, offsetX: 0, offsetY: 0 
        }).then(onLoad).catch(onLoad);

        this.tilesetManager.loadTileset('crops', 'assets/16x16/Tilesets_Compact/vectoraith_tileset_farmingsims_crops.png', { 
            tileSize: 16, offsetX: 0, offsetY: 0 
        }).then(onLoad).catch(onLoad);

        this.tilesetManager.loadTileset('fence', 'assets/Objects/Fence_copiar.png', { 
            tileSize: 16, offsetX: 0, offsetY: 0 
        }).then(onLoad).catch(onLoad);

        setTimeout(() => { if (!this.world) this.initWorld(); }, 5000);
    }

    initWorld() {
        if (this.world) return;
        this.world = new World(this.tilesetManager, this.assets, this.events);
        this.world.updateSeason(this.timeSystem.getSeason());

        // Resume a previous session if one exists, then autosave each new day.
        if (SaveSystem.hasSave() && SaveSystem.load(this)) {
            this.showStatus('Save loaded');
        }
        this.events.on('day:changed', () => SaveSystem.save(this));

        this.startGameLoop();
    }

    startGameLoop() {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    loop(timestamp) {
        let deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (deltaTime > 0.25) deltaTime = 0.25;
        this.accumulatedTime += deltaTime;
        while (this.accumulatedTime >= this.step) {
            this.update(this.step);
            this.accumulatedTime -= this.step;
        }
        this.draw();
        requestAnimationFrame(this.loop);
    }

    update(dt) {
        // Global hotkeys (help / new game) work in any scene or state.
        this.handleGlobalKeys();

        // Shop toggle (edge-triggered on B). While the shop is open it's modal:
        // time, movement, and farming all pause until it closes.
        const shopKey = this.input.keys['b'] || this.input.keys['B'];
        if (this.scene === 'farm' && shopKey && !this.lastShopKey) this.shop.toggle();
        this.lastShopKey = shopKey;
        if (this.shop.isOpen) {
            this.player.isWalking = false;
            this.player.frame = 1;
            this.lastActionState = this.input.action;
            this.updateUI();
            return;
        }

        // Dialogue is modal too — interaction happens via the DOM buttons.
        if (this.dialogueOpen) {
            if (this.input.keys['Escape']) { this.input.keys['Escape'] = false; this.closeDialogue(); }
            this.player.isWalking = false;
            this.player.frame = 1;
            this.lastActionState = this.input.action;
            this.updateUI();
            return;
        }

        // Time advance emits 'day:changed'/'season:changed'; World reacts to those
        // (advance crops, swap season tileset) and Game autosaves — no polling here.
        this.timeSystem.update(dt);

        // Manual save (K) / load (L), edge-triggered.
        const saveKey = this.input.keys['k'] || this.input.keys['K'];
        if (saveKey && !this.lastSaveKey) {
            this.showStatus(SaveSystem.save(this) ? 'Game saved' : 'Save failed');
        }
        this.lastSaveKey = saveKey;
        const loadKey = this.input.keys['l'] || this.input.keys['L'];
        if (loadKey && !this.lastLoadKey) {
            this.showStatus(SaveSystem.load(this) ? 'Game loaded' : 'No save found');
        }
        this.lastLoadKey = loadKey;

        const map = this.scene === 'interior' ? this.interior : this.world;
        if (!map) { this.updateUI(); return; }

        // Animal simulation only runs outdoors.
        if (this.scene === 'farm') this.world.update(dt);

        // Mouse: hover tile, click-to-move target, and click-to-use-tool.
        this.updatePointer();

        // Movement direction comes from the keyboard, or (if idle) from a
        // click-to-move target. Keyboard input always wins and cancels the target.
        let dir = this.input.getDirection();
        if (dir.x !== 0 || dir.y !== 0) {
            this.moveTarget = null;
            this.pointerActive = false;
        } else if (this.moveTarget) {
            const dx = this.moveTarget.x - (this.player.x + 8);
            const dy = this.moveTarget.y - (this.player.y + 8);
            const d = Math.hypot(dx, dy);
            if (d < 4) { this.moveTarget = null; dir = { x: 0, y: 0 }; }
            else dir = { x: dx / d, y: dy / d };
        }

        const preX = this.player.x;
        const preY = this.player.y;
        if (dir.x !== 0 || dir.y !== 0) {
            this.player.isWalking = true;
            // Face along the dominant axis (works for both unit and integer dirs).
            if (Math.abs(dir.x) > Math.abs(dir.y)) this.player.direction = dir.x > 0 ? 2 : 1;
            else this.player.direction = dir.y > 0 ? 0 : 3;

            // Axis-separated movement so we slide along walls instead of sticking.
            const dist = this.player.speed * dt;
            const nx = this.player.x + dir.x * dist;
            const bx = this.playerBox(nx, this.player.y);
            if (!map.isBlocked(bx.x, bx.y, bx.w, bx.h)) this.player.x = nx;
            const ny = this.player.y + dir.y * dist;
            const by = this.playerBox(this.player.x, ny);
            if (!map.isBlocked(by.x, by.y, by.w, by.h)) this.player.y = ny;

            this.player.animTimer += dt;
            if (this.player.animTimer > 0.15) {
                this.player.frame = (this.player.frame + 1) % 3;
                this.player.animTimer = 0;
            }
        } else {
            this.player.isWalking = false;
            this.player.frame = 1;
        }
        // Give up a click-to-move if we're wedged against something.
        if (this.moveTarget && this.player.x === preX && this.player.y === preY) this.moveTarget = null;

        if (this.scene === 'interior') {
            const fb = this.playerBox();
            if (this.interior.isExit(fb.x, fb.y, fb.w, fb.h)) {
                this.exitInterior();
            } else {
                // Face the bed and press E to be prompted to sleep.
                const interactKey = this.input.keys['e'] || this.input.keys['E'];
                if (interactKey && !this.lastInteractKey && this.isBedTargeted()) this.promptSleep();
                this.lastInteractKey = interactKey;
            }
            this.lastActionState = this.input.action;
            this.updateUI();
            return;
        }

        // --- Farm scene ---
        this.player.x = Math.max(0, Math.min(this.world.width * 16 - 16, this.player.x));
        this.player.y = Math.max(0, Math.min(this.world.height * 16 - 16, this.player.y));

        this.camera.x = this.player.x - this.width / 2 + 8;
        this.camera.y = this.player.y - this.height / 2 + 8;
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.world.width * 16 - this.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.world.height * this.world.tileSize - this.height));

        // The tile the player faces (used by the keyboard action). The drawn
        // highlight follows the mouse in pointer mode, else the facing tile.
        const cx = this.player.x + 8;
        const cy = this.player.y + 8;
        let tx = cx;
        let ty = cy;
        const reach = 20;
        if (this.player.direction === 0) ty += reach;
        else if (this.player.direction === 1) tx -= reach;
        else if (this.player.direction === 2) tx += reach;
        else ty -= reach;
        this.facingTileX = Math.floor(tx / 16);
        this.facingTileY = Math.floor(ty / 16);
        if (this.pointerActive) {
            this.targetTileX = this.hoverTileX;
            this.targetTileY = this.hoverTileY;
        } else {
            this.targetTileX = this.facingTileX;
            this.targetTileY = this.facingTileY;
        }

        for (let i = 1; i <= 9; i++) {
            if (this.input.keys[i.toString()]) this.inventory.selectSlot(i - 1);
        }

        // Keyboard action (Space/Enter): interact/use tool on the faced tile.
        if (this.input.action && !this.lastActionState) {
            this.act(this.facingTileX, this.facingTileY);
        }
        this.lastActionState = this.input.action;

        // Step onto a building's entry mat to go inside.
        const fb = this.playerBox();
        const building = this.world.getEntryAt(fb.x, fb.y, fb.w, fb.h);
        if (building) this.enterInterior(building);

        this.updateRain(dt);
        this.updateUI();
    }

    // Mouse handling: track the hovered tile/world point and resolve a left
    // click into either a tool use (tile in reach) or a click-to-move target.
    updatePointer() {
        const m = this.input.mouse;
        if (m.x !== this.lastMouseX || m.y !== this.lastMouseY) this.pointerActive = true;
        this.lastMouseX = m.x;
        this.lastMouseY = m.y;

        let worldX;
        let worldY;
        if (this.scene === 'farm') {
            worldX = m.x + this.camera.x;
            worldY = m.y + this.camera.y;
            this.hoverTileX = Math.floor(worldX / 16);
            this.hoverTileY = Math.floor(worldY / 16);
        } else {
            // Interior is drawn centered; undo that offset to get room coords.
            const ox = Math.floor((this.width - this.interior.width) / 2);
            const oy = Math.floor((this.height - this.interior.height) / 2);
            worldX = m.x - ox;
            worldY = m.y - oy;
        }

        const clicked = this.input.mouseDown && !this.lastMouseDown;
        this.lastMouseDown = this.input.mouseDown;
        if (!clicked) return;
        this.pointerActive = true;

        if (this.scene === 'interior') {
            // Indoors, clicks just walk (sleep is E while facing the bed).
            this.moveTarget = { x: worldX, y: worldY };
        } else if (this.withinReach(this.hoverTileX, this.hoverTileY)) {
            this.faceTile(this.hoverTileX, this.hoverTileY);
            this.act(this.hoverTileX, this.hoverTileY);
            this.moveTarget = null;
        } else {
            // Out of reach: walk toward the click.
            this.moveTarget = { x: worldX, y: worldY };
        }
    }

    // Whether a tile is close enough to the player to act on (~1.75 tiles).
    withinReach(tileX, tileY) {
        const dx = (tileX * 16 + 8) - (this.player.x + 8);
        const dy = (tileY * 16 + 8) - (this.player.y + 8);
        return Math.hypot(dx, dy) <= 28;
    }

    faceTile(tileX, tileY) {
        const dx = (tileX * 16 + 8) - (this.player.x + 8);
        const dy = (tileY * 16 + 8) - (this.player.y + 8);
        if (Math.abs(dx) > Math.abs(dy)) this.player.direction = dx > 0 ? 2 : 1;
        else this.player.direction = dy > 0 ? 0 : 3;
    }

    // Resolve an action on a tile: interact with an animal there if present,
    // otherwise use the selected tool. Shared by keyboard (Space) and mouse.
    act(tileX, tileY) {
        const px = tileX * 16 + 8;
        const py = tileY * 16 + 8;
        const npc = this.world.getNpcNear(px, py, 18);
        if (npc) {
            this.openDialogue(npc);
            return;
        }
        const animal = this.world.getAnimalNear(px, py, 16);
        if (animal) {
            this.interactWithAnimal(animal);
            return;
        }
        this.useSelectedTool(tileX, tileY);
    }

    interactWithAnimal(animal) {
        const result = animal.interact();
        if (result.collected) {
            const name = result.collected;
            this.inventory.addItem({ name, type: 'resource', icon: name.charAt(0), count: 1 });
            this.showStatus(`Collected ${name}`);
        } else if (result.petted) {
            this.showStatus(`Petted the ${animal.type}`);
        }
    }

    // --- NPC dialogue + quests ---

    openDialogue(npc) {
        this.dialogueNpc = npc;
        this.dialogueOpen = true;
        if (!this.dialogueRoot) this.buildDialogue();
        this.dialogueRoot.style.display = 'flex';
        this.renderDialogue();
    }

    closeDialogue() {
        this.dialogueOpen = false;
        if (this.dialogueRoot) this.dialogueRoot.style.display = 'none';
    }

    buildDialogue() {
        this.dialogueRoot = document.createElement('div');
        this.dialogueRoot.id = 'dialogue-overlay';
        const panel = document.createElement('div');
        panel.id = 'dialogue-panel';
        this.dialogueNameEl = document.createElement('div');
        this.dialogueNameEl.className = 'dialogue-name';
        this.dialogueTextEl = document.createElement('div');
        this.dialogueTextEl.className = 'dialogue-text';
        this.dialogueButtonsEl = document.createElement('div');
        this.dialogueButtonsEl.className = 'dialogue-buttons';
        panel.append(this.dialogueNameEl, this.dialogueTextEl, this.dialogueButtonsEl);
        this.dialogueRoot.appendChild(panel);
        (document.getElementById('ui-layer') || document.body).appendChild(this.dialogueRoot);
    }

    renderDialogue() {
        const npc = this.dialogueNpc;
        this.dialogueNameEl.textContent = npc ? npc.name : '';
        this.dialogueButtonsEl.innerHTML = '';

        const q = this.questLog.current();
        const mine = q && npc && q.npc === npc.name && !this.questLog.allDone();
        if (!mine) {
            this.dialogueTextEl.textContent = this.questLog.allDone()
                ? 'Thanks again for all your help!'
                : "Lovely day on the farm, isn't it?";
            this.addDialogueButton('Close', () => this.closeDialogue());
            return;
        }

        if (!this.questLog.accepted) {
            this.dialogueTextEl.textContent = q.offer;
            this.addDialogueButton('Accept', () => { this.questLog.accept(); this.renderDialogue(); });
            this.addDialogueButton('Decline', () => this.closeDialogue());
        } else if (this.questLog.isComplete()) {
            this.dialogueTextEl.textContent = `${q.thanks} (+$${q.reward})`;
            this.addDialogueButton('Claim reward', () => {
                const reward = this.questLog.claim();
                this.shop.money += reward;
                this.showStatus(`Quest complete! +$${reward}`);
                this.renderDialogue();
            });
        } else {
            this.dialogueTextEl.textContent =
                `${this.questDescription(q)} — ${this.questLog.progress}/${q.count}. Come back when it's done!`;
            this.addDialogueButton('Close', () => this.closeDialogue());
        }
    }

    addDialogueButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'dialogue-btn';
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        this.dialogueButtonsEl.appendChild(btn);
    }

    questDescription(q) {
        const what = q.target ? q.target.replace(' Seeds', '') : null;
        if (q.event === 'harvest') return `Harvest ${q.count} ${what || 'crops'}`;
        if (q.event === 'sell') return `Sell ${q.count} ${what || 'items'}`;
        return q.id;
    }

    // Whether to draw a quest marker over this NPC (offer available or claimable).
    npcHasMarker(npc) {
        if (this.questLog.allDone()) return false;
        const q = this.questLog.current();
        if (!q || q.npc !== npc.name) return false;
        return !this.questLog.accepted || this.questLog.isComplete();
    }

    // Apply the selected inventory item's action to a tile (shared by keyboard
    // and mouse). Hoe tills, Watering Can waters, Scythe harvests (all over a
    // tier-sized area and costing energy); a seed plants; empty hand harvests.
    useSelectedTool(tileX, tileY) {
        const item = this.inventory.getSelectedItem();

        if (item && ENERGY_COST[item.name] !== undefined) {
            this.useWorkingTool(item, tileX, tileY);
        } else if (item && item.type === 'seed' && item.count > 0) {
            if (!this.world.isInSeason(item.name)) {
                this.showStatus(`Can't plant ${item.name.replace(' Seeds', '')} in ${this.timeSystem.getSeason()}`);
            } else if (this.world.plant(tileX, tileY, item.name)) {
                item.count--;
                if (item.count <= 0) this.inventory.slots[this.inventory.selectedSlot] = null;
            }
        } else {
            // Empty hand / other items can still harvest (and clear dead crops).
            // Harvest emits 'crop:harvested'; the listener adds it to the inventory.
            this.world.harvest(tileX, tileY);
        }
    }

    // Hoe / Watering Can / Scythe: act over a (2r+1)² area sized by the tool's
    // tier, costing energy once per swing (only if it actually did something).
    useWorkingTool(item, tileX, tileY) {
        const cost = ENERGY_COST[item.name];
        if (this.player.energy < cost) {
            this.showStatus('Too tired — sleep to restore energy');
            return;
        }
        const r = Math.floor(toolAreaSide(item.tier || 0) / 2);
        let didSomething = false;
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const tx = tileX + dx;
                const ty = tileY + dy;
                if (item.name === 'Hoe') {
                    if (this.world.till(tx, ty)) didSomething = true;
                } else if (item.name === 'Watering Can') {
                    if (this.world.water(tx, ty)) didSomething = true;
                } else if (item.name === 'Scythe') {
                    if (this.world.harvest(tx, ty)) didSomething = true;
                }
            }
        }
        if (didSomething) this.player.energy = Math.max(0, this.player.energy - cost);
    }

    // True when the player is on the bed or facing it from an adjacent tile.
    isBedTargeted() {
        if (this.scene !== 'interior' || !this.interior || !this.interior.bed) return false;
        const fb = this.playerBox();
        if (this.interior.isBed(fb.x, fb.y, fb.w, fb.h)) return true;
        // Point one tile ahead of the player in their facing direction.
        const reach = 16;
        let px = this.player.x + 8;
        let py = this.player.y + 8;
        if (this.player.direction === 0) py += reach;
        else if (this.player.direction === 1) px -= reach;
        else if (this.player.direction === 2) px += reach;
        else py -= reach;
        return this.interior.isBed(px - 4, py - 4, 8, 8);
    }

    // Ask before sleeping, then sleep on confirm.
    promptSleep() {
        const ok = (typeof window === 'undefined' || !window.confirm)
            ? true
            : window.confirm('Sleep until morning?');
        if (ok) this.sleep();
    }

    // Sleep in a bed: restore energy and skip to next morning.
    sleep() {
        this.player.energy = this.player.maxEnergy;
        this.timeSystem.sleepUntilMorning();
        this.showStatus('You slept until morning. Energy restored.');
    }

    // Player collision box — the feet, roughly centered on the 16px sprite.
    playerBox(x = this.player.x, y = this.player.y) {
        return { x: x + 2, y: y + 6, w: 12, h: 10 };
    }

    enterInterior(building) {
        if (!this.interior) this.interior = new Interior();
        this.interior.setRoom(building.interior);
        // Where to drop the player back on the farm: just below the entry mat.
        this.returnPos = { x: building.entry.x, y: building.entry.y + 24, direction: 0 };
        this.scene = 'interior';
        const sp = this.interior.spawn;
        this.player.x = sp.x;
        this.player.y = sp.y;
        this.player.direction = sp.direction;
        this.player.isWalking = false;
        this.player.frame = 1;
        this.showStatus(`Entered ${building.interior}`);
    }

    exitInterior() {
        this.scene = 'farm';
        if (this.returnPos) {
            this.player.x = this.returnPos.x;
            this.player.y = this.returnPos.y;
            this.player.direction = this.returnPos.direction;
        }
        this.player.isWalking = false;
        this.player.frame = 1;
        this.showStatus('Left building');
    }

    // Help ("?") and New Game ("N"). "?" is consumed on press (its keyup can
    // report a different key after Shift releases), so we clear it after reading.
    handleGlobalKeys() {
        if (this.input.keys['?']) {
            this.input.keys['?'] = false;
            this.toggleHelp();
        }
        if (this.helpOpen && this.input.keys['Escape']) {
            this.input.keys['Escape'] = false;
            this.toggleHelp();
        }
        const newGameKey = this.input.keys['n'] || this.input.keys['N'];
        if (newGameKey && !this.lastNewGameKey) this.newGame();
        this.lastNewGameKey = newGameKey;
    }

    toggleHelp() {
        this.helpOpen = !this.helpOpen;
        const el = document.getElementById('help-overlay');
        if (el) el.style.display = this.helpOpen ? 'flex' : 'none';
    }

    // Erase the save and reload into a fresh game (after confirmation).
    newGame() {
        const ok = typeof window === 'undefined' || !window.confirm
            ? true
            : window.confirm('Start a new game? This erases your current save.');
        if (!ok) return;
        SaveSystem.clear();
        if (typeof location !== 'undefined' && location.reload) location.reload();
    }

    initRain() {
        this.raindrops = [];
        for (let i = 0; i < 50; i++) {
            this.raindrops.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speed: 200 + Math.random() * 120,
                len: 4 + Math.random() * 4
            });
        }
    }

    // Advance falling raindrops (screen-space, purely visual) while it's raining.
    updateRain(dt) {
        if (this.timeSystem.weather !== 'rain') return;
        if (!this.raindrops) this.initRain();
        for (const d of this.raindrops) {
            d.y += d.speed * dt;
            d.x += 20 * dt; // slight wind slant
            if (d.y > this.height) { d.y = -d.len; d.x = Math.random() * this.width; }
            if (d.x > this.width) d.x -= this.width;
        }
    }

    // Briefly flash a status message (save/load feedback) in the corner.
    showStatus(msg) {
        const el = document.getElementById('save-status');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('visible');
        clearTimeout(this._statusTimer);
        this._statusTimer = setTimeout(() => el.classList.remove('visible'), 1800);
    }

    updateUI() {
        const uiTime = document.getElementById('time-display');
        if (uiTime) {
            const rain = this.timeSystem.weather === 'rain' ? ' ☔' : '';
            uiTime.textContent = this.timeSystem.getFormattedTime() + rain;
        }
        const moneyEl = document.getElementById('money-display');
        if (moneyEl) moneyEl.textContent = `$${this.shop.money}`;
        const energyFill = document.getElementById('energy-fill');
        if (energyFill) {
            const pct = Math.max(0, Math.min(1, this.player.energy / this.player.maxEnergy));
            energyFill.style.width = `${pct * 100}%`;
            energyFill.style.background = pct < 0.25 ? '#e05a5a' : '#5ad05a';
        }
        this.shop.season = this.timeSystem.getSeason();
        this.shop.render();
        const questEl = document.getElementById('quest-display');
        if (questEl) {
            const q = this.questLog.current();
            if (q && this.questLog.accepted && !this.questLog.allDone()) {
                questEl.style.display = 'block';
                const done = this.questLog.isComplete() ? ' ✓' : '';
                questEl.textContent = `${this.questDescription(q)}: ${this.questLog.progress}/${q.count}${done}`;
            } else {
                questEl.style.display = 'none';
            }
        }
        const invBar = document.getElementById('inventory-bar');
        if (invBar) {
            invBar.innerHTML = ''; 
            for (let i = 0; i < this.inventory.maxSlots; i++) {
                const slot = document.createElement('div');
                slot.className = 'inv-slot';
                if (i === this.inventory.selectedSlot) slot.classList.add('selected');
                const item = this.inventory.slots[i];
                if (item) {
                    const icon = document.createElement('span');
                    icon.textContent = item.icon;
                    slot.appendChild(icon);
                    if (item.count) {
                        const count = document.createElement('div');
                        count.className = 'inv-count';
                        count.textContent = item.count;
                        slot.appendChild(count);
                    }
                }
                invBar.appendChild(slot);
            }
        }
    }

    // Draw the player sprite at its current position (caller sets the transform).
    drawPlayer() {
        if (this.assets.player.complete && this.assets.player.naturalWidth > 0) {
            const sw = 16;
            const sh = 32;
            const sx = this.player.frame * sw;
            const sy = this.player.direction * sh;
            const dx = Math.round(this.player.x);
            const dy = Math.round(this.player.y) - 16;
            this.ctx.drawImage(this.assets.player, sx, sy, sw, sh, dx, dy, sw, sh);
        } else {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.player.x, this.player.y, 16, 16);
        }
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.scene === 'interior' && this.interior) {
            // Center the (smaller-than-screen) room on the canvas. No day/night tint indoors.
            const ox = Math.floor((this.width - this.interior.width) / 2);
            const oy = Math.floor((this.height - this.interior.height) / 2);
            this.ctx.save();
            this.ctx.translate(ox, oy);
            this.interior.draw(this.ctx);
            this.drawPlayer();
            this.ctx.restore();
            return;
        }

        this.ctx.save();
        this.ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));
        if (this.world && typeof this.world.draw === 'function') {
            this.world.draw(this.ctx, this.camera);
            if (this.targetTileX !== undefined) {
                // Green when the highlighted tile is in reach (a click acts on it),
                // faint white otherwise (a click there walks toward it).
                const inReach = this.withinReach(this.targetTileX, this.targetTileY);
                this.ctx.strokeStyle = inReach ? 'rgba(120, 255, 120, 0.7)' : 'rgba(255, 255, 255, 0.3)';
                this.ctx.strokeRect(this.targetTileX * 16, this.targetTileY * 16, 16, 16);
            }
            // Quest marker over NPCs with an offer/claim available.
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 11px monospace';
            this.ctx.textAlign = 'center';
            for (const npc of this.world.npcs) {
                if (this.npcHasMarker(npc)) this.ctx.fillText('!', npc.x + npc.width / 2, npc.y - 4);
            }
            this.ctx.textAlign = 'left';
        }
        this.drawPlayer();
        this.ctx.restore();
        const tint = this.timeSystem.getLightTint();
        if (tint.a > 0) {
            this.ctx.fillStyle = `rgba(${Math.round(tint.r)}, ${Math.round(tint.g)}, ${Math.round(tint.b)}, ${tint.a})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
        if (this.timeSystem.weather === 'rain') this.drawRain();
    }

    drawRain() {
        if (!this.raindrops) this.initRain();
        // Overcast darkening, then streaks.
        this.ctx.fillStyle = 'rgba(60, 70, 90, 0.15)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (const d of this.raindrops) {
            this.ctx.moveTo(d.x, d.y);
            this.ctx.lineTo(d.x - 2, d.y + d.len);
        }
        this.ctx.stroke();
    }
}
