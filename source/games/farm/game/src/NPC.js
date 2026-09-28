// A wandering villager you can talk to (quest giver). Reuses the Animal wander
// idiom (random timed hops) with the same feet-box collision against the world,
// and draws a simple fill-based figure (no dedicated sprite art needed yet).
export default class NPC {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 24;
        this.direction = 0;
        this.moveTimer = Math.random() * 2 + 1;
        this.isMoving = false;
        this.vx = 0;
        this.vy = 0;
        this.speed = 12 + Math.random() * 8;
    }

    blockedAt(x, y, world) {
        if (!world || typeof world.isBlocked !== 'function') return false;
        return world.isBlocked(x + 2, y + this.height - 7, this.width - 4, 6);
    }

    update(dt, worldWidth, worldHeight, world = null) {
        this.moveTimer -= dt;
        if (this.moveTimer <= 0) {
            if (this.isMoving) {
                this.isMoving = false;
                this.moveTimer = Math.random() * 3 + 2;
                this.vx = 0;
                this.vy = 0;
            } else {
                this.isMoving = true;
                this.moveTimer = Math.random() * 2 + 1;
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
                if (Math.abs(this.vx) > Math.abs(this.vy)) this.direction = this.vx > 0 ? 2 : 1;
                else this.direction = this.vy > 0 ? 0 : 3;
            }
        }

        if (this.isMoving) {
            const nx = this.x + this.vx * dt;
            if (!this.blockedAt(nx, this.y, world)) this.x = nx;
            else this.vx = 0;
            const ny = this.y + this.vy * dt;
            if (!this.blockedAt(this.x, ny, world)) this.y = ny;
            else this.vy = 0;
            this.x = Math.max(0, Math.min(worldWidth - this.width, this.x));
            this.y = Math.max(0, Math.min(worldHeight - this.height, this.y));
        }
    }

    draw(ctx) {
        const x = Math.round(this.x);
        const y = Math.round(this.y);
        ctx.fillStyle = '#e8b07a';            // head
        ctx.fillRect(x + 4, y, 8, 6);
        ctx.fillStyle = '#7a3aa0';            // tunic
        ctx.fillRect(x + 2, y + 6, 12, 12);
        ctx.fillStyle = '#43306b';            // legs
        ctx.fillRect(x + 3, y + 18, 4, 5);
        ctx.fillRect(x + 9, y + 18, 4, 5);
    }

    serialize() {
        return { x: this.x, y: this.y };
    }

    deserialize(d) {
        if (!d) return;
        if (typeof d.x === 'number') this.x = d.x;
        if (typeof d.y === 'number') this.y = d.y;
    }
}
