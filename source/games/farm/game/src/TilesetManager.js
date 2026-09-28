export default class TilesetManager {
    constructor() {
        this.tilesets = {};
    }

    async loadTileset(name, imagePath, metadata) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const tileSize = metadata.tileSize;
                const offsetX = metadata.offsetX || 0;
                const offsetY = metadata.offsetY || 0;
                const cols = metadata.columns || Math.floor((image.width - offsetX) / tileSize);

                this.tilesets[name] = {
                    image: image,
                    metadata: metadata,
                    tileSize: tileSize,
                    columns: cols,
                    offsetX: offsetX,
                    offsetY: offsetY
                };
                console.log(`Tileset '${name}' loaded: ${image.width}x${image.height}, offset:(${offsetX},${offsetY}), cols: ${cols}`);
                resolve(this.tilesets[name]);
            };
            image.onerror = (e) => {
                console.error(`Failed to load tileset image: ${imagePath}`, e);
                reject(e);
            };
            image.src = imagePath;
        });
    }

    getTileInfo(tilesetName, tileId) {
        const tileset = this.tilesets[tilesetName];
        if (!tileset) return null;

        if (tileset.metadata.tiles && tileset.metadata.tiles[tileId]) {
            return tileset.metadata.tiles[tileId];
        }
        
        // Default minimal info if not explicitly defined in metadata
        return { id: tileId, walkable: true };
    }

    getTileSize(tilesetName) {
        return this.tilesets[tilesetName] ? this.tilesets[tilesetName].tileSize : 0;
    }

    drawTile(ctx, tilesetName, tileId, x, y) {
        const tileset = this.tilesets[tilesetName];
        if (!tileset) return;

        const tileSize = tileset.tileSize;
        const cols = tileset.columns;

        // Calculate source position relative to the starting offset
        const srcX = tileset.offsetX + (tileId % cols) * tileSize;
        const srcY = tileset.offsetY + Math.floor(tileId / cols) * tileSize;

        ctx.drawImage(
            tileset.image,
            srcX, srcY, tileSize, tileSize,
            x, y, tileSize, tileSize
        );
    }
}
