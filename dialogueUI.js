// dialogueUI.js
// DOM-диалог: показ/скрытие, очередь реплик, печать по буквам, Space/Enter (skip/next).

export class DialogueUI {
  constructor(options = {}) {
    this.root = document.getElementById("dialogue");
    this.nameEl = document.getElementById("dialogueName");
    this.textEl = document.getElementById("dialogueText");
    this.hintEl = document.getElementById("dialogueHint");

    if (!this.root || !this.nameEl || !this.textEl || !this.hintEl) {
      throw new Error(
        "[DialogueUI] Не найдены DOM-элементы диалога. Проверь index.html: #dialogue, #dialogueName, #dialogueText, #dialogueHint"
      );
    }

    // Настройки печати
    this.charDelayMs = Number.isFinite(options.charDelayMs)
      ? options.charDelayMs
      : 22;

    this.queue = [];
    this.active = false;

    // Текущее состояние печати
    this.currentSpeaker = "";
    this.currentLine = "";
    this.printIndex = 0;
    this.isTyping = false;
    this._typingTimer = null;

    this._onKeyDown = (e) => {
      if (!this.active) return;

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();

        // Если печатаем — допечатать всю строку
        if (this.isTyping) {
          this._finishTyping();
          return;
        }

        // Если не печатаем — следующая строка / закрыть
        this.next();
      }
    };

    window.addEventListener("keydown", this._onKeyDown, { passive: false });
  }

  async _ensureFontLoaded() {
    if (document.fonts?.load) {
      await document.fonts.load('22px "shrift"');
    }
  }

  isOpen() {
    return this.active;
  }

  async show({ speaker = "", lines = [] } = {}) {
    await this._ensureFontLoaded();

    const normalized = Array.isArray(lines)
      ? lines.map(String)
      : [String(lines)];
    this.queue = [...normalized];

    this.currentSpeaker = String(speaker ?? "");
    this.nameEl.textContent = this.currentSpeaker
      ? `${this.currentSpeaker}:`
      : "";

    this.active = true;
    this.root.style.display = "block";
    this.root.setAttribute("aria-hidden", "false");

    this._setHint();
    this.next(true);
  }

  next(first = false) {
    if (!this.active) return;

    // На всякий случай стопаем текущую печать
    this._stopTyping();

    const line = this.queue.shift();
    if (line == null) {
      this.hide();
      return;
    }

    this.currentLine = line;
    this.printIndex = 0;
    this.textEl.textContent = "";

    this._setHint();
    this._startTyping();
  }

  hide() {
    this._stopTyping();

    this.active = false;
    this.queue = [];
    this.currentSpeaker = "";
    this.currentLine = "";
    this.printIndex = 0;

    this.nameEl.textContent = "";
    this.textEl.textContent = "";

    this.root.style.display = "none";
    this.root.setAttribute("aria-hidden", "true");
  }

  destroy() {
    this._stopTyping();
    window.removeEventListener("keydown", this._onKeyDown);
  }

  /* ===== Typewriter ===== */

  _startTyping() {
    this.isTyping = true;

    const step = () => {
      if (!this.active) return;

      // допечатываем по символу
      this.printIndex += 1;
      this.textEl.textContent = this.currentLine.slice(0, this.printIndex);

      if (this.printIndex >= this.currentLine.length) {
        this._finishTyping();
        return;
      }

      this._typingTimer = window.setTimeout(step, this.charDelayMs);
    };

    this._typingTimer = window.setTimeout(step, this.charDelayMs);
  }

  _finishTyping() {
    this._stopTyping();
    this.textEl.textContent = this.currentLine;

    // Когда строка допечатана, подсказка зависит от наличия следующих строк
    this.hintEl.textContent = this.queue.length
      ? "Space / Enter — дальше"
      : "Space / Enter — закрыть";
  }

  _stopTyping() {
    this.isTyping = false;
    if (this._typingTimer != null) {
      window.clearTimeout(this._typingTimer);
      this._typingTimer = null;
    }
  }

  _setHint() {
    // Пока печатаем — подсказка про “допечатать”
    this.hintEl.textContent = "Space / Enter — допечатать";
  }
}

// singleton, чтобы импортировать и использовать в системах/сценах
export const dialogueUI = new DialogueUI({ charDelayMs: 22 });
