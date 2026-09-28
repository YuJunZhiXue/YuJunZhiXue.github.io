// Minimal pub/sub used to decouple cross-system reactions (e.g. day change ->
// advance crops, crop harvested -> add to inventory) instead of threading direct
// calls and `typeof` guards through Game. State still flows down from Game, which
// owns the single emitter and hands it to the subsystems that need it.
export default class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    // Subscribe to `event`. Returns an unsubscribe function.
    on(event, fn) {
        (this.listeners[event] ||= []).push(fn);
        return () => this.off(event, fn);
    }

    off(event, fn) {
        const arr = this.listeners[event];
        if (arr) this.listeners[event] = arr.filter((f) => f !== fn);
    }

    // Notify listeners. Iterates a copy so handlers may subscribe/unsubscribe.
    emit(event, payload) {
        const arr = this.listeners[event];
        if (arr) for (const fn of arr.slice()) fn(payload);
    }
}
