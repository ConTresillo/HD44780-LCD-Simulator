export class EventBus {
    listeners = [];
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    emit(event) {
        for (const listener of this.listeners) {
            listener(event);
        }
    }
}
//# sourceMappingURL=eventBus.js.map