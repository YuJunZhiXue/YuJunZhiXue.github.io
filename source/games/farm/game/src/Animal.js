export default class Animal {
    constructor(type, x, y, image) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.image = image;
        
        // Define dimensions and frames based on type
        // The new sprites are generally 3 cols x 4 rows
        if (type === 'cow') {
            this.width = 24; // 72 / 3
            this.height = 24; // 96 / 4
        } else { // chickens
            this.width = 16; // 48 / 3
            this.height = 16; // 64 / 4
        }
        
        this.rows = 4;
        this.cols = 3;

        this.frame = 1; // Middle frame is idle
        this.direction = 0; // 0:Down, 1:Left, 2:Right, 3:Up
        this.animTimer = 0;
        this.moveTimer = Math.random() * 2 + 1;
        this.isMoving = false;
        this.vx = 0;
        this.vy = 0;
        this.speed = 10 + Math.random() * 10;

        // Husbandry state. `productType` (e.g. 'Milk'/'Egg') is assigned by World
        // from ANIMAL_DATA; a happy, petted animal yields one product each morning.
        this.happiness = 50;
        this.pettedToday = false;
        this.hasProduct = false;
        this.productType = null;
    }

    // Player interaction: collect a ready product, otherwise pet (once a day).
    // Returns { collected } or { petted } describing what happened.
    interact() {
        if (this.hasProduct) {
            this.hasProduct = false;
            return { collected: this.productType };
        }
        if (!this.pettedToday) {
            this.pettedToday = true;
            this.happiness = Math.min(100, this.happiness + 15);
            return { petted: true };
        }
        return { petted: false };
    }

    // Daily tick (on day:changed): a petted, content animal produces; an ignored
    // one loses happiness. Resets the daily petting flag.
    onNewDay() {
        if (this.pettedToday && this.happiness >= 40 && this.productType) {
            this.hasProduct = true;
        } else if (!this.pettedToday) {
            this.happiness = Math.max(0, this.happiness - 10);
        }
        this.pettedToday = false;
    }

    serialize() {
        return {
            x: this.x, y: this.y,
            happiness: this.happiness,
            pettedToday: this.pettedToday,
            hasProduct: this.hasProduct
        };
    }

    deserialize(d) {
        if (!d) return;
        if (typeof d.x === 'number') this.x = d.x;
        if (typeof d.y === 'number') this.y = d.y;
        if (typeof d.happiness === 'number') this.happiness = d.happiness;
        if (typeof d.pettedToday === 'boolean') this.pettedToday = d.pettedToday;
        if (typeof d.hasProduct === 'boolean') this.hasProduct = d.hasProduct;
    }

    // Feet-strip box used for collision (so the head may overlap edges, like the
    // player). World is optional so headless callers without collision still work.
    blockedAt(x, y, world) {
        if (!world || typeof world.isBlocked !== 'function') return false;
        return world.isBlocked(x + 2, y + this.height - 7, this.width - 4, 6);
    }

    update(dt, worldWidth, worldHeight, world = null) {
        this.animTimer += dt;
        
        if (this.isMoving) {
            if (this.animTimer > 0.15) {
                this.frame = (this.frame + 1) % this.cols;
                this.animTimer = 0;
            }
        } else {
            this.frame = 1; // Idle frame
        }

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
                
                // Determine direction
                if (Math.abs(this.vx) > Math.abs(this.vy)) {
                    this.direction = this.vx > 0 ? 2 : 1; // Right or Left
                } else {
                    this.direction = this.vy > 0 ? 0 : 3; // Down or Up
                }
            }
        }

        if (this.isMoving) {
            // Axis-separated so we slide along walls/buildings; stop the blocked
            // axis so the animal turns away instead of pushing into it.
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
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        const sx = this.frame * this.width;
        const sy = this.direction * this.height;

        const dx = Math.round(this.x);
        const dy = Math.round(this.y);

        ctx.drawImage(this.image, sx, sy, this.width, this.height, dx, dy, this.width, this.height);

        // "Product ready" bubble above the animal.
        if (this.hasProduct) {
            const bx = dx + this.width / 2;
            const by = dy - 5;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx, by, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#caa15a';
            ctx.beginPath();
            ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
