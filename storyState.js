// storyState — хранилище прогресса, чтобы сюжет мог быть условным и помнить прошлое:
export function createStoryState() {
  return {
    flags: new Set(),
    counters: new Map(),

    hasFlag(id) {
      return this.flags.has(id);
    },
    setFlag(id) {
      this.flags.add(id);
    },

    getCounter(id) {
      return this.counters.get(id) ?? 0;
    },
    incCounter(id, delta = 1) {
      this.counters.set(id, this.getCounter(id) + delta);
      return this.getCounter(id);
    },
  };
}
