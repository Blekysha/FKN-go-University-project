// storyState — хранилище прогресса, чтобы сюжет мог быть условным и помнить,
// что уже произошло: флаги, счётчики и обычные значения

export function createStoryState() {
  return {
    flags: new Set(),
    counters: new Map(),
    values: new Map(),

    // ===== ФЛАГИ =====
    hasFlag(id) {
      return this.flags.has(id);
    },

    setFlag(id) {
      this.flags.add(id);
    },

    removeFlag(id) {
      this.flags.delete(id);
    },

    // ===== СЧЁТЧИКИ =====
    getCounter(id) {
      return this.counters.get(id) ?? 0;
    },

    incCounter(id, delta = 1) {
      this.counters.set(id, this.getCounter(id) + delta);
      return this.getCounter(id);
    },

    setCounter(id, value) {
      this.counters.set(id, value);
      return value;
    },

    // ===== ОБЫЧНЫЕ ЗНАЧЕНИЯ =====
    getValue(id, defaultValue = null) {
      return this.values.has(id) ? this.values.get(id) : defaultValue;
    },

    setValue(id, value) {
      this.values.set(id, value);
      return value;
    },

    removeValue(id) {
      this.values.delete(id);
    },
  };
}
