// A simple enterable building interior. Rendered with flat fills rather than
// tileset art (the building tilesets' interior layout isn't verified), so it's
// guaranteed to draw and is easy to swap for real art later. Coordinates are
// room-space; Game centers the room on the canvas when drawing.
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export default class Interior {
    constructor() {
        this.tileSize = 16;
        this.cols = 14;
        this.rows = 10;
        this.width = this.cols * this.tileSize;  // 224
        this.height = this.rows * this.tileSize;  // 160
        this.label = '';
        this.bed = null; // set for the house; sleep here to restore energy

        // Exit mat sits on the last floor row, centered. Walking onto it leaves.
        this.exit = { x: this.width / 2 - 16, y: (this.rows - 2) * this.tileSize, w: 32, h: 16 };
        // Spawn near the top, facing down into the room (away from the exit mat).
        this.spawn = { x: this.width / 2 - 8, y: 5 * this.tileSize, direction: 0 };
    }

    setRoom(label) {
        this.label = label;
        // Only the house has a bed (top-left corner of the floor).
        this.bed = label === 'house' ? { x: 2 * this.tileSize, y: 2 * this.tileSize, w: 32, h: 32 } : null;
    }

    isBed(x, y, w, h) {
        if (!this.bed) return false;
        const b = this.bed;
        return x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y;
    }

    // A 1-tile wall border is solid. The exit opening is reached before the wall.
    isBlocked(x, y, w, h) {
        const t = this.tileSize;
        return x < t || y < t || x + w > this.width - t || y + h > this.height - t;
    }

    isExit(x, y, w, h) {
        return rectsOverlap(x, y, w, h, this.exit.x, this.exit.y, this.exit.w, this.exit.h);
    }

    draw(ctx) {
        const t = this.tileSize;
        // Floor
        ctx.fillStyle = '#6b4a2b';
        ctx.fillRect(0, 0, this.width, this.height);
        // Plank lines for a bit of texture
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        for (let y = t; y < this.height - t; y += t) {
            ctx.beginPath();
            ctx.moveTo(t, y + 0.5);
            ctx.lineTo(this.width - t, y + 0.5);
            ctx.stroke();
        }
        // Wall border
        ctx.fillStyle = '#3a2a4a';
        ctx.fillRect(0, 0, this.width, t);                       // top
        ctx.fillRect(0, this.height - t, this.width, t);          // bottom
        ctx.fillRect(0, 0, t, this.height);                       // left
        ctx.fillRect(this.width - t, 0, t, this.height);          // right

        // Bed (house only): wooden frame, blanket, pillow.
        if (this.bed) {
            const b = this.bed;
            ctx.fillStyle = '#7a4a2a';
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = '#3b6ea5';
            ctx.fillRect(b.x + 2, b.y + 8, b.w - 4, b.h - 10);
            ctx.fillStyle = '#e8e8e8';
            ctx.fillRect(b.x + 4, b.y + 2, b.w - 8, 6);
            ctx.fillStyle = '#fff';
            ctx.font = '6px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('BED', b.x + b.w / 2, b.y + b.h + 7);
        }

        // Exit mat
        ctx.fillStyle = '#caa15a';
        ctx.fillRect(this.exit.x, this.exit.y, this.exit.w, this.exit.h);
        ctx.fillStyle = '#000';
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', this.exit.x + this.exit.w / 2, this.exit.y + 11);

        // Room label
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.fillText(this.label.toUpperCase(), this.width / 2, t + 14);
        ctx.textAlign = 'left';
    }
}
