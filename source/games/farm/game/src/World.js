import Tilemap from './Tilemap.js';
import Animal from './Animal.js';
import NPC from './NPC.js';

// Canonical crop table. Each row drives growth (maxStage/baseTile), the economy
// (seedPrice to buy, sellPrice to sell), and which `seasons` the crop may be
// planted/grown in (nothing grows in Winter). Add a new crop by adding a row
// here — no new logic.
export const CROP_DATA = {
    'Wheat Seeds': { maxStage: 3, baseTile: 16, seedPrice: 5, sellPrice: 12, seasons: ['Spring', 'Fall'] },
    'Carrot Seeds': { maxStage: 3, baseTile: 20, seedPrice: 8, sellPrice: 18, seasons: ['Spring'] },
    'Strawberry Seeds': { maxStage: 3, baseTile: 24, seedPrice: 20, sellPrice: 45, seasons: ['Spring'] },
    'Potato Seeds': { maxStage: 3, baseTile: 28, seedPrice: 10, sellPrice: 22, seasons: ['Spring', 'Summer'] },
    'Tomato Seeds': { maxStage: 3, baseTile: 48, seedPrice: 15, sellPrice: 32, seasons: ['Summer'] },
    'Corn Seeds': { maxStage: 3, baseTile: 52, seedPrice: 12, sellPrice: 28, seasons: ['Summer', 'Fall'] },
    'Pumpkin Seeds': { maxStage: 3, baseTile: 80, seedPrice: 25, sellPrice: 60, seasons: ['Fall'] },
    'Cabbage Seeds': { maxStage: 3, baseTile: 112, seedPrice: 18, sellPrice: 40, seasons: ['Spring', 'Fall'] }
};

// Animal husbandry table: type -> daily product + its sell value. Add an animal
// kind by adding a row here (and an asset/sprite), not by branching logic.
export const ANIMAL_DATA = {
    cow: { product: 'Milk', sellPrice: 50 },
    chicken: { product: 'Egg', sellPrice: 20 }
};

// Resolve a sellable resource's value. Crops are named after their seed minus
// the " Seeds" suffix (e.g. 'Wheat Seeds' -> 'Wheat'); animal products
// (Milk/Egg) are looked up in ANIMAL_DATA.
export function getSellPrice(resourceName) {
    const crop = CROP_DATA[`${resourceName} Seeds`];
    if (crop) return crop.sellPrice;
    for (const type in ANIMAL_DATA) {
        if (ANIMAL_DATA[type].product === resourceName) return ANIMAL_DATA[type].sellPrice;
    }
    return 0;
}

// Axis-aligned box overlap (all args in pixels).
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export default class World {
    constructor(tilesetManager, assets, events = null) {
        this.tilesetManager = tilesetManager;
        this.assets = assets;
        this.events = events;
        this.tileSize = 16;
        this.width = 40;
        this.height = 30;

        // Current season (kept in sync via updateSeason); gates planting/withering.
        this.currentSeason = 'Spring';

        // React to time passing instead of being polled by Game.
        if (events) {
            events.on('day:changed', () => {
                this.advanceCrops();
                for (const a of this.animals) a.onNewDay();
            });
            events.on('season:changed', ({ season }) => this.updateSeason(season));
            events.on('weather:changed', ({ weather }) => {
                if (weather === 'rain') this.waterAllSoil();
            });
        }

        // Verified indices into the 16-col terrain tileset (e.g. terrain_spring_expanded.png):
        //   GRASS 16  - plain flat grass fill tile
        //   SOIL  32  - top-left of the 3x3 farmland autotile block (center = 49)
        //   WATER 145 - clean still-water tile (pond interior)
        this.TILES = {
            GRASS: 16,
            SOIL: 32,
            WATER: 145,
        };

        this.crops = new Map(); 
        this.fences = [];
        this.wateredPlots = new Set();
        this.staticObjects = [];
        this.animals = [];
        this.npcs = [];

        this.tilemap = this.generateMap();
        this.initStaticObjects();
        this.initAnimals();
        this.initNPCs();
        this.buildCollision();
        this.unstickAnimals();
    }

    initNPCs() {
        // A single quest-giving villager on the open grass below the buildings.
        this.npcs.push(new NPC('Mira', 200, 220));
    }

    // Nearest NPC whose center is within `radius` px of the point, or null.
    getNpcNear(px, py, radius) {
        for (const n of this.npcs) {
            const cx = n.x + n.width / 2;
            const cy = n.y + n.height / 2;
            if (Math.hypot(cx - px, cy - py) <= radius) return n;
        }
        return null;
    }

    // Move any animal that's sitting inside a solid (e.g. an old save that
    // captured it on a rooftop) back to a known-open patch of grass.
    unstickAnimals() {
        const SAFE = { x: 160, y: 208 };
        for (const a of this.animals) {
            if (a.blockedAt(a.x, a.y, this)) {
                a.x = SAFE.x;
                a.y = SAFE.y;
            }
        }
    }

    // Precompute the set of solid tiles (water + fences). The gate is a gap in
    // the fence (no tile there), so it's naturally walkable. Water and fences
    // never move at runtime, so this is built once at construction.
    buildCollision() {
        this.solidTiles = new Set();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.getTileAt(x, y) === this.TILES.WATER) this.solidTiles.add(`${x},${y}`);
            }
        }
        for (const f of this.fences) this.solidTiles.add(`${f.x},${f.y}`);
    }

    // True if the world-space box (px) hits a solid tile or a building footprint.
    isBlocked(x, y, w, h) {
        const t = this.tileSize;
        const x0 = Math.floor(x / t);
        const x1 = Math.floor((x + w - 1) / t);
        const y0 = Math.floor(y / t);
        const y1 = Math.floor((y + h - 1) / t);
        for (let ty = y0; ty <= y1; ty++) {
            for (let tx = x0; tx <= x1; tx++) {
                if (this.solidTiles && this.solidTiles.has(`${tx},${ty}`)) return true;
            }
        }
        for (const o of this.staticObjects) {
            const c = o.collision;
            if (c && rectsOverlap(x, y, w, h, c.x, c.y, c.w, c.h)) return true;
        }
        return false;
    }

    // Returns the building whose entry mat the box overlaps (if any).
    getEntryAt(x, y, w, h) {
        for (const o of this.staticObjects) {
            if (o.entry && o.interior && rectsOverlap(x, y, w, h, o.entry.x, o.entry.y, o.entry.w, o.entry.h)) {
                return o;
            }
        }
        return null;
    }

    initStaticObjects() {
        // House — solid lower footprint, with an entry mat on the grass below it.
        if (this.assets.house) {
            this.staticObjects.push({
                x: 4 * 16, y: 2 * 16,
                image: this.assets.house,
                sw: 128, sh: 128,
                sx: 0, sy: 0,
                dw: 128, dh: 128,
                collision: { x: 64, y: 32, w: 128, h: 128 },
                entry: { x: 120, y: 160, w: 16, h: 16 },
                interior: 'house'
            });

            // Barn
            this.staticObjects.push({
                x: 14 * 16, y: 2 * 16,
                image: this.assets.house,
                sw: 128, sh: 128,
                sx: 128, sy: 0,
                dw: 128, dh: 128,
                collision: { x: 224, y: 32, w: 128, h: 128 },
                entry: { x: 280, y: 160, w: 16, h: 16 },
                interior: 'barn'
            });
        }

        if (this.assets.chest) {
            this.staticObjects.push({
                x: 12 * 16, y: 10 * 16,
                image: this.assets.chest,
                sw: 32, sh: 32, sx: 0, sy: 0,
                dw: 32, dh: 32,
                collision: { x: 192, y: 160, w: 32, h: 32 }
            });
        }

        this.initBorderTrees();
    }

    initBorderTrees() {
        if (!this.assets.details) return;

        // Top Border Trees (overlapping the top slightly)
        for (let x = -16; x < this.width * 16; x += 48) {
            this.staticObjects.push({
                type: 'tree',
                x: x, y: -48,
                image: this.assets.details,
                sw: 64, sh: 96,
                sx: 64, sy: 32,
                dw: 64, dh: 96
            });
        }

        // Bottom Border Trees
        for (let x = -16; x < this.width * 16; x += 48) {
            this.staticObjects.push({
                type: 'tree',
                x: x, y: 25 * 16,
                image: this.assets.details,
                sw: 64, sh: 96,
                sx: 64, sy: 32,
                dw: 64, dh: 96
            });
        }

        // Left Border Trees
        for (let y = 16; y < 24 * 16; y += 64) {
            this.staticObjects.push({
                type: 'tree',
                x: -32, y: y,
                image: this.assets.details,
                sw: 64, sh: 96,
                sx: 64, sy: 32,
                dw: 64, dh: 96
            });
        }

        // Right Border Trees
        for (let y = 16; y < 24 * 16; y += 64) {
            this.staticObjects.push({
                type: 'tree',
                x: 37 * 16, y: y,
                image: this.assets.details,
                sw: 64, sh: 96,
                sx: 64, sy: 32,
                dw: 64, dh: 96
            });
        }
    }

    updateSeason(seasonName) {
        this.currentSeason = seasonName;
        if (this.tilemap) {
            this.tilemap.tilesetName = seasonName.toLowerCase();
        }
        // Crops that can't grow in the new season wither (e.g. everything in Winter).
        for (const [, crop] of this.crops) {
            const data = CROP_DATA[crop.type];
            if (data && data.seasons && !data.seasons.includes(seasonName)) crop.withered = true;
        }
        const seasonOffsets = {
            'Spring': 64,
            'Summer': 0,
            'Fall': 128,
            'Winter': 192
        };
        const offset = seasonOffsets[seasonName] !== undefined ? seasonOffsets[seasonName] : 64;
        for (const obj of this.staticObjects) {
            if (obj.type === 'tree') {
                obj.sx = offset;
            }
        }
    }

    initAnimals() {
        const spawn = (type, x, y, image) => {
            const animal = new Animal(type, x, y, image);
            if (ANIMAL_DATA[type]) animal.productType = ANIMAL_DATA[type].product;
            this.animals.push(animal);
        };
        // Spawn on open grass below the buildings (clear of collision footprints).
        if (this.assets.cow) spawn('cow', 300, 210, this.assets.cow);
        if (this.assets.chicken) spawn('chicken', 120, 210, this.assets.chicken);
    }

    // Nearest animal whose center is within `radius` px of the point, or null.
    getAnimalNear(px, py, radius) {
        for (const a of this.animals) {
            const acx = a.x + a.width / 2;
            const acy = a.y + a.height / 2;
            if (Math.hypot(acx - px, acy - py) <= radius) return a;
        }
        return null;
    }

    // Column count of the active terrain tileset, used to compute autotile
    // neighbour offsets. Falls back to 16 if the tileset isn't loaded yet.
    getTerrainColumns() {
        const ts = this.tilemap && this.tilesetManager.tilesets[this.tilemap.tilesetName];
        return (ts && ts.columns) ? ts.columns : 16;
    }

    getSoilAutoTileIndex(bitmask) {
        const S = this.TILES.SOIL;
        const cols = this.getTerrainColumns();
        const TL = S; const TM = S + 1; const TR = S + 2;           
        const ML = S + cols; const MM = S + cols + 1; const MR = S + cols + 2;    
        const BL = S + cols * 2; const BM = S + cols * 2 + 1; const BR = S + cols * 2 + 2;
        const map = {
            0: MM, 1: BM, 2: ML, 3: BL, 4: TM, 5: MM, 6: TL, 7: ML,
            8: MR, 9: BR, 10: MM, 11: BM, 12: TR, 13: MR, 14: TM, 15: MM
        };
        return map[bitmask] || MM;
    }

    isSoilTile(tileId) {
        return tileId >= this.TILES.SOIL && tileId <= this.TILES.SOIL + 48;
    }

    updateAutoTiling() {
        if (!this.tilemap) return;
        const updates = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const currentTile = this.getTileAt(x, y);
                if (this.isSoilTile(currentTile)) {
                    let bitmask = 0;
                    if (y > 0 && this.isSoilTile(this.getTileAt(x, y - 1))) bitmask += 1;
                    if (x < this.width - 1 && this.isSoilTile(this.getTileAt(x + 1, y))) bitmask += 2;
                    if (y < this.height - 1 && this.isSoilTile(this.getTileAt(x, y + 1))) bitmask += 4;
                    if (x > 0 && this.isSoilTile(this.getTileAt(x - 1, y))) bitmask += 8;
                    updates.push({x, y, newTile: this.getSoilAutoTileIndex(bitmask)});
                }
            }
        }
        for (const update of updates) {
            this.setTileAt(update.x, update.y, update.newTile);
        }
    }

    generateMap() {
        const tilemap = Tilemap.create(this.width, this.height, this.tileSize, 'spring', this.tilesetManager);
        this.tilemap = tilemap; 
        const fill = (x1, y1, w, h, tile) => {
            for (let y = y1; y < y1 + h; y++) {
                for (let x = x1; x < x1 + w; x++) tilemap.setTile(x, y, tile);
            }
        };
        // Fill grass
        fill(0, 0, this.width, this.height, this.TILES.GRASS);
        
        // Fenced-in field of soil
        fill(23, 5, 10, 10, this.TILES.SOIL);
        this.buildFenceRect(22, 4, 12, 12);
        
        // Pond
        fill(3, 19, 8, 7, this.TILES.WATER);
        
        this.updateAutoTiling();
        return tilemap;
    }

    buildFenceRect(x1, y1, w, h) {
        // Leave a one-tile opening (the gate) in the bottom edge, centered.
        const gateX = x1 + Math.floor(w / 2);
        for (let x = x1; x < x1 + w; x++) {
            for (let y = y1; y < y1 + h; y++) {
                const isLeft = (x === x1);
                const isRight = (x === x1 + w - 1);
                const isTop = (y === y1);
                const isBot = (y === y1 + h - 1);

                if (!(isLeft || isRight || isTop || isBot)) continue;
                // Skip the gate cell entirely so there's a visible, walkable gap.
                if (isBot && x === gateX) continue;

                let tileId = 1;
                if (isTop && isLeft) tileId = 0;
                else if (isTop && isRight) tileId = 2;
                else if (isBot && isLeft) tileId = 6;
                else if (isBot && isRight) tileId = 8;
                else if (isLeft) tileId = 3;
                else if (isRight) tileId = 5;
                else if (isTop) tileId = 1;
                else if (isBot) tileId = 7;
                this.fences.push({ x, y, tileId });
            }
        }
    }

    update(dt) {
        for (const animal of this.animals) {
            animal.update(dt, this.width * 16, this.height * 16, this);
        }
        for (const npc of this.npcs) {
            npc.update(dt, this.width * 16, this.height * 16, this);
        }
    }

    draw(ctx, camera) {
        if (this.tilemap) this.tilemap.draw(ctx, camera);
        
        // Draw Fences
        for (const fence of this.fences) {
            this.tilesetManager.drawTile(ctx, 'fence', fence.tileId, fence.x * 16, fence.y * 16);
        }

        // Draw Watered soil indicator
        ctx.fillStyle = 'rgba(0, 50, 150, 0.3)';
        for (const pos of this.wateredPlots) {
            const [x, y] = pos.split(',').map(Number);
            ctx.fillRect(x * 16, y * 16, 16, 16);
        }

        // Draw Crops (withered ones get a dead-brown overlay).
        for (const [pos, crop] of this.crops) {
            const [x, y] = pos.split(',').map(Number);
            const cropInfo = CROP_DATA[crop.type];
            const tileId = cropInfo ? cropInfo.baseTile + crop.stage : crop.stage;
            this.tilesetManager.drawTile(ctx, 'crops', tileId, x * 16, y * 16);
            if (crop.withered) {
                ctx.fillStyle = 'rgba(70, 45, 20, 0.55)';
                ctx.fillRect(x * 16, y * 16, 16, 16);
            }
        }
        for (const obj of this.staticObjects) {
            if (obj.image && obj.image.complete && obj.image.naturalWidth > 0) {
                ctx.drawImage(obj.image, obj.sx, obj.sy, obj.sw, obj.sh, obj.x, obj.y, obj.dw, obj.dh);
            }
        }
        for (const animal of this.animals) animal.draw(ctx);
        for (const npc of this.npcs) npc.draw(ctx);
    }

    getTileAt(x, y) { return this.tilemap ? this.tilemap.getTile(x, y) : null; }
    setTileAt(x, y, tile) { if (this.tilemap) this.tilemap.setTile(x, y, tile); }

    till(x, y) {
        if (this.getTileAt(x, y) === this.TILES.GRASS) {
            this.setTileAt(x, y, this.TILES.SOIL);
            this.updateAutoTiling();
            return true;
        }
        return false;
    }

    water(x, y) {
        if (this.isSoilTile(this.getTileAt(x, y))) {
            this.wateredPlots.add(`${x},${y}`);
            return true;
        }
        return false;
    }

    // Rain waters every tilled tile for the day (skips the watering chore).
    waterAllSoil() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.isSoilTile(this.getTileAt(x, y))) this.wateredPlots.add(`${x},${y}`);
            }
        }
    }

    // Whether a seed can be planted in the current season.
    isInSeason(seedType) {
        const data = CROP_DATA[seedType];
        return !data || !data.seasons || data.seasons.includes(this.currentSeason);
    }

    plant(x, y, seedType) {
        const key = `${x},${y}`;
        // Tilled tiles get autotiled away from the raw SOIL id, so match the whole
        // soil range (same check water/till-aware code uses) rather than === SOIL.
        if (this.isSoilTile(this.getTileAt(x, y)) && !this.crops.has(key) && this.isInSeason(seedType)) {
            const cropInfo = CROP_DATA[seedType];
            const maxStage = cropInfo ? cropInfo.maxStage : 3;
            this.crops.set(key, { type: seedType, stage: 0, maxStage: maxStage });
            return true;
        }
        return false;
    }

    advanceCrops() {
        for (const [pos, crop] of this.crops) {
            if (crop.withered) continue;
            if (this.wateredPlots.has(pos)) {
                if (crop.stage < crop.maxStage) crop.stage++;
            }
        }
        this.wateredPlots.clear();
    }

    harvest(x, y) {
        const key = `${x},${y}`;
        const crop = this.crops.get(key);
        if (!crop) return null;
        // "Harvesting" a withered crop just clears the dead plant (no product).
        if (crop.withered) {
            this.crops.delete(key);
            return null;
        }
        if (crop.stage === crop.maxStage) {
            this.crops.delete(key);
            const result = { name: crop.type };
            if (this.events) this.events.emit('crop:harvested', result);
            return result;
        }
        return null;
    }

    serialize() {
        return {
            tilemap: this.tilemap
                ? { tilesetName: this.tilemap.tilesetName, layers: this.tilemap.layers }
                : null,
            crops: Array.from(this.crops.entries()),
            wateredPlots: Array.from(this.wateredPlots),
            animals: this.animals.map((a) => a.serialize()),
            npcs: this.npcs.map((n) => n.serialize())
        };
    }

    deserialize(d) {
        if (!d) return;
        if (d.tilemap && this.tilemap) {
            if (Array.isArray(d.tilemap.layers)) this.tilemap.layers = d.tilemap.layers;
            if (d.tilemap.tilesetName) this.tilemap.tilesetName = d.tilemap.tilesetName;
        }
        if (Array.isArray(d.crops)) this.crops = new Map(d.crops);
        if (Array.isArray(d.wateredPlots)) this.wateredPlots = new Set(d.wateredPlots);
        if (Array.isArray(d.animals)) {
            // Animals are recreated in order at construction; restore by index.
            for (let i = 0; i < Math.min(d.animals.length, this.animals.length); i++) {
                this.animals[i].deserialize(d.animals[i]);
            }
            // A pre-fix save may place an animal inside a now-solid footprint.
            this.unstickAnimals();
        }
        if (Array.isArray(d.npcs)) {
            for (let i = 0; i < Math.min(d.npcs.length, this.npcs.length); i++) {
                this.npcs[i].deserialize(d.npcs[i]);
            }
        }
    }
}
