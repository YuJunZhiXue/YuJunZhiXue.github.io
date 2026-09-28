export default class Input {
    constructor(canvas = null) {
        this.keys = {};
        this.direction = { x: 0, y: 0 };
        this.action = false;

        // Mouse state, in internal canvas-resolution coordinates (0..320, 0..240).
        this.mouse = { x: 0, y: 0 };
        this.mouseDown = false;

        // Mobile touch state
        this.touchStart = { x: 0, y: 0 };
        this.touchCurrent = { x: 0, y: 0 };
        this.isTouching = false;

        this.setupKeyboard();
        this.setupTouch();
        if (canvas) this.setupMouse(canvas);
    }

    setupMouse(canvas) {
        // Map a DOM event's client coords to the canvas's internal resolution
        // (the canvas is CSS-scaled, so we rescale by width ratio).
        const toCanvas = (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        };
        canvas.addEventListener('mousemove', toCanvas);
        canvas.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            this.mouseDown = true;
            toCanvas(e);
        });
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouseDown = false;
        });
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.updateDirection();

            if (e.code === 'Space' || e.key === 'Enter') {
                this.action = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.updateDirection();

            if (e.code === 'Space' || e.key === 'Enter') {
                this.action = false;
            }
        });
    }

    setupTouch() {
        // Basic virtual joystick logic could go here
        // For now, let's just track touch for simple movement towards touch or swipes
        window.addEventListener('touchstart', (e) => {
            this.isTouching = true;
            this.touchStart.x = e.touches[0].clientX;
            this.touchStart.y = e.touches[0].clientY;
            this.touchCurrent = { ...this.touchStart };
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!this.isTouching) return;
            e.preventDefault(); // Prevent scrolling
            this.touchCurrent.x = e.touches[0].clientX;
            this.touchCurrent.y = e.touches[0].clientY;
            this.updateTouchDirection();
        }, { passive: false });

        window.addEventListener('touchend', () => {
            this.isTouching = false;
            this.direction = { x: 0, y: 0 };
        });
    }

    updateDirection() {
        this.direction.x = 0;
        this.direction.y = 0;

        if (this.keys['ArrowUp'] || this.keys['w']) this.direction.y -= 1;
        if (this.keys['ArrowDown'] || this.keys['s']) this.direction.y += 1;
        if (this.keys['ArrowLeft'] || this.keys['a']) this.direction.x -= 1;
        if (this.keys['ArrowRight'] || this.keys['d']) this.direction.x += 1;

        // Normalize if moving diagonally (simple approach)
        // If we want consistent speed, we'd normalize the vector length to 1
        // But for pixel grid movement, strict axis-aligned might be preferred later.
    }

    updateTouchDirection() {
        const dx = this.touchCurrent.x - this.touchStart.x;
        const dy = this.touchCurrent.y - this.touchStart.y;

        const threshold = 10; // Deadzone

        this.direction.x = 0;
        this.direction.y = 0;

        if (Math.abs(dx) > threshold) {
            this.direction.x = dx > 0 ? 1 : -1;
        }
        if (Math.abs(dy) > threshold) {
            this.direction.y = dy > 0 ? 1 : -1;
        }
    }

    getDirection() {
        return this.direction;
    }
}
