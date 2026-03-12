// dialogueUI.js

export class DialogueUI {
  constructor(options = {}) {
    this.root = document.getElementById("dialogue");
    this.nameEl = document.getElementById("dialogueName");
    this.textEl = document.getElementById("dialogueText");
    this.hintEl = document.getElementById("dialogueHint");
    this.choicesEl = document.getElementById("dialogueChoices");

    if (
      !this.root ||
      !this.nameEl ||
      !this.textEl ||
      !this.hintEl ||
      !this.choicesEl
    ) {
      throw new Error(
        "[DialogueUI] Не найдены DOM-элементы диалога. Проверь index.html: #dialogue, #dialogueName, #dialogueText, #dialogueHint, #dialogueChoices"
      );
    }

    this.charDelayMs = Number.isFinite(options.charDelayMs)
      ? options.charDelayMs
      : 22;

    this.queue = [];
    this.choices = [];
    this.active = false;
    this.onChoice = null;

    this.currentSpeaker = "";
    this.currentLine = "";
    this.printIndex = 0;
    this.isTyping = false;
    this._typingTimer = null;

    this._onKeyDown = (e) => {
      if (!this.active) return;

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();

        if (this.choicesEl.children.length > 0) {
          return;
        }

        if (this.isTyping) {
          this._finishTyping();
          return;
        }

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

  async show({ speaker = "", lines = [], choices = [] } = {}) {
    await this._ensureFontLoaded();

    const normalized = Array.isArray(lines)
      ? lines.map(String)
      : [String(lines)];

    this.queue = [...normalized];
    this.choices = Array.isArray(choices) ? choices : [];
    this.currentSpeaker = String(speaker ?? "");

    this.nameEl.textContent = this.currentSpeaker
      ? `${this.currentSpeaker}:`
      : "";

    this.textEl.textContent = "";
    this.choicesEl.innerHTML = "";

    this.active = true;
    this.root.style.display = "block";
    this.root.setAttribute("aria-hidden", "false");

    this._setHint();
    this.next(true);
  }

  next(first = false) {
    if (!this.active) return;

    this._stopTyping();

    const line = this.queue.shift();

    if (line == null) {
      if (this.choices.length > 0) {
        this._showChoices();
        return;
      }

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
    this.choices = [];
    this.currentSpeaker = "";
    this.currentLine = "";
    this.printIndex = 0;
    this.onChoice = null;

    this.nameEl.textContent = "";
    this.textEl.textContent = "";
    this.hintEl.textContent = "";
    this.choicesEl.innerHTML = "";

    this.root.style.display = "none";
    this.root.setAttribute("aria-hidden", "true");
  }

  destroy() {
    this._stopTyping();
    window.removeEventListener("keydown", this._onKeyDown);
  }

  _showChoices() {
    this._stopTyping();
    this.textEl.textContent = this.currentLine || "";
    this.choicesEl.innerHTML = "";
    this.hintEl.textContent = "Выберите вариант мышкой";

    this.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dialogue-choice-btn";
      btn.textContent = choice.text;

      btn.addEventListener("click", () => {
        const selectedChoice = choice;
        const callback = this.onChoice;

        this.hide();

        if (typeof callback === "function") {
          callback(selectedChoice);
        }
      });

      this.choicesEl.appendChild(btn);
    });
  }

  _startTyping() {
    this.isTyping = true;

    const step = () => {
      if (!this.active) return;

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

    if (this.queue.length > 0) {
      this.hintEl.textContent = "Space / Enter — дальше";
    } else if (this.choices.length > 0) {
      this.hintEl.textContent = "Выберите вариант мышкой";
    } else {
      this.hintEl.textContent = "Space / Enter — закрыть";
    }
  }

  _stopTyping() {
    this.isTyping = false;
    if (this._typingTimer != null) {
      window.clearTimeout(this._typingTimer);
      this._typingTimer = null;
    }
  }

  _setHint() {
    this.hintEl.textContent = "Space / Enter — допечатать";
  }
}

export const dialogueUI = new DialogueUI({ charDelayMs: 22 });
