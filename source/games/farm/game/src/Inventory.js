export default class Inventory {
    constructor() {
        this.maxSlots = 9;
        this.slots = new Array(this.maxSlots).fill(null);
        this.selectedSlot = 0;

        // Initial loadout: tools + a few starter seeds. The rest of the seed
        // catalog is bought from the shop, and the empty slots leave headroom
        // for harvested crops (which stack via addItem).
        this.addItem({ name: 'Hoe', type: 'tool', icon: 'H' });
        this.addItem({ name: 'Watering Can', type: 'tool', icon: 'W' });
        this.addItem({ name: 'Scythe', type: 'tool', icon: 'S' });
        this.addItem({ name: 'Wheat Seeds', type: 'seed', icon: 'w', count: 5 });
        this.addItem({ name: 'Carrot Seeds', type: 'seed', icon: 'c', count: 5 });
        this.addItem({ name: 'Potato Seeds', type: 'seed', icon: 'p', count: 5 });
    }

    addItem(item) {
        // Stack onto an existing stackable item of the same name + type.
        if (item.count !== undefined) {
            for (let i = 0; i < this.maxSlots; i++) {
                const slot = this.slots[i];
                if (slot && slot.name === item.name && slot.type === item.type) {
                    slot.count = (slot.count || 0) + (item.count || 1);
                    return true;
                }
            }
        }
        // Otherwise drop into the first empty slot.
        for (let i = 0; i < this.maxSlots; i++) {
            if (this.slots[i] === null) {
                this.slots[i] = item;
                return true;
            }
        }
        return false;
    }

    selectSlot(index) {
        if (index >= 0 && index < this.maxSlots) {
            this.selectedSlot = index;
            return true;
        }
        return false;
    }

    getSelectedItem() {
        return this.slots[this.selectedSlot];
    }

    serialize() {
        // Slots are plain data objects, so they're already JSON-safe.
        return { slots: this.slots, selectedSlot: this.selectedSlot };
    }

    deserialize(d) {
        if (!d) return;
        if (Array.isArray(d.slots)) {
            this.slots = new Array(this.maxSlots).fill(null);
            for (let i = 0; i < Math.min(d.slots.length, this.maxSlots); i++) {
                this.slots[i] = d.slots[i] || null;
            }
        }
        if (typeof d.selectedSlot === 'number') this.selectedSlot = d.selectedSlot;
        // Back-fill the Scythe for saves written before it existed (if there's room).
        if (!this.slots.some((s) => s && s.name === 'Scythe')) {
            this.addItem({ name: 'Scythe', type: 'tool', icon: 'S' });
        }
    }
}
