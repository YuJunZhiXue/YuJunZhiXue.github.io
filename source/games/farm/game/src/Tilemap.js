export default class Tilemap {
    constructor(data, tilesetManager) {
        this.width = data.width;
        this.height = data.height;
        this.tileSize = data.tileSize;
        this.tilesetName = data.tileset; // The tileset used by this map
        this.layers = data.layers || [];
        this.tilesetManager = tilesetManager;
    }

    static fromJSON(json, tilesetManager) {
        return new Tilemap(json, tilesetManager);
    }

    // Create a new map with a single default layer
    static create(width, height, tileSize, tilesetName, tilesetManager) {
        const data = {
            width,
            height,
            tileSize,
            tileset: tilesetName,
            layers: [{
                name: "terrain",
                data: new Array(width * height).fill(0) // Fill with default tile 0
            }]
        };
        return new Tilemap(data, tilesetManager);
    }

    // Get tile ID at (x, y) on a specific layer (default 0)
    getTile(x, y, layerIndex = 0) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
        
        const layer = this.layers[layerIndex];
        if (!layer) return null;

        return layer.data[y * this.width + x];
    }

    // Set tile ID at (x, y) on a specific layer
    setTile(x, y, tileId, layerIndex = 0) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

        // Ensure layer exists
        if (!this.layers[layerIndex]) {
            this.layers[layerIndex] = {
                name: `layer_${layerIndex}`,
                data: new Array(this.width * this.height).fill(0)
            };
        }

        this.layers[layerIndex].data[y * this.width + x] = tileId;
    }

    isWalkable(x, y) {
        // Simple check: iterate all layers, if any tile at (x,y) is marked not walkable, then it's blocked.
        for (const layer of this.layers) {
            const tileId = this.getTile(x, y, this.layers.indexOf(layer));
            if (tileId !== null) {
                const info = this.tilesetManager.getTileInfo(this.tilesetName, tileId);
                if (info && info.walkable === false) {
                    return false;
                }
            }
        }
        return true;
    }

    draw(ctx, camera) {
        // Simple culling/viewport calculation
        const startCol = Math.max(0, Math.floor(camera.x / this.tileSize));
        const endCol = Math.min(this.width, Math.ceil((camera.x + camera.width) / this.tileSize));
        const startRow = Math.max(0, Math.floor(camera.y / this.tileSize));
        const endRow = Math.min(this.height, Math.ceil((camera.y + camera.height) / this.tileSize));

        for (const layer of this.layers) {
             for (let y = startRow; y < endRow; y++) {
                for (let x = startCol; x < endCol; x++) {
                    const tileId = layer.data[y * this.width + x];
                    // tileId 0 is treated as empty (transparent) and skipped
                    if (tileId) {
                         this.tilesetManager.drawTile(
                             ctx,
                             this.tilesetName,
                             tileId,
                             x * this.tileSize,
                             y * this.tileSize
                         );
                    }
                }
             }
        }
    }
}
