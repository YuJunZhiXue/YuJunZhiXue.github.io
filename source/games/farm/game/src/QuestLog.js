// Data-driven quest chain. Each quest is tracked by listening to events on the
// bus: `harvest` counts `crop:harvested`, `sell` counts `item:sold`. `target`
// null means "any". Add a quest by adding a row — no new logic. `crop:harvested`
// reports the seed name (crop.type), so harvest targets use the seed name.
export const QUEST_DATA = [
    {
        id: 'wheat5', npc: 'Mira', event: 'harvest', target: 'Wheat Seeds', count: 5, reward: 120,
        offer: 'Welcome, neighbor! Could you harvest 5 Wheat to get me started?',
        thanks: 'Wonderful — fresh wheat! Here\'s something for your trouble.'
    },
    {
        id: 'sell5', npc: 'Mira', event: 'sell', target: null, count: 5, reward: 150,
        offer: 'The market\'s quiet. Sell 5 things at the shop to stir up some business?',
        thanks: 'You\'re a natural at this. Take this as thanks.'
    },
    {
        id: 'harvest10', npc: 'Mira', event: 'harvest', target: null, count: 10, reward: 250,
        offer: 'One big push — harvest 10 crops of any kind for the festival?',
        thanks: 'The whole farm is thriving thanks to you!'
    }
];

export default class QuestLog {
    constructor(events = null) {
        this.index = 0;        // which quest in QUEST_DATA is current
        this.accepted = false; // has the player accepted the current quest
        this.progress = 0;     // progress toward the current quest

        if (events) {
            events.on('crop:harvested', (p) => this.track('harvest', p.name));
            events.on('item:sold', (p) => this.track('sell', p.name));
        }
    }

    current() {
        return QUEST_DATA[this.index] || null;
    }

    allDone() {
        return this.index >= QUEST_DATA.length;
    }

    // Advance progress when an accepted quest matches the event + target.
    track(event, name) {
        const q = this.current();
        if (!q || !this.accepted) return;
        if (q.event !== event) return;
        if (q.target && q.target !== name) return;
        if (this.progress < q.count) this.progress++;
    }

    isComplete() {
        const q = this.current();
        return !!q && this.accepted && this.progress >= q.count;
    }

    accept() {
        if (this.current() && !this.accepted) {
            this.accepted = true;
            this.progress = 0;
        }
    }

    // Claim a finished quest's reward and advance to the next. Returns the
    // reward amount (0 if not actually complete).
    claim() {
        if (!this.isComplete()) return 0;
        const reward = this.current().reward;
        this.index++;
        this.accepted = false;
        this.progress = 0;
        return reward;
    }

    serialize() {
        return { index: this.index, accepted: this.accepted, progress: this.progress };
    }

    deserialize(d) {
        if (!d) return;
        if (typeof d.index === 'number') this.index = d.index;
        if (typeof d.accepted === 'boolean') this.accepted = d.accepted;
        if (typeof d.progress === 'number') this.progress = d.progress;
    }
}
