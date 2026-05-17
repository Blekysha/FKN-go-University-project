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
      : 58;

    // Защита от случайного двойного нажатия: как в VN/RPG,
    // первое нажатие допечатывает строку, следующее — листает дальше.
    this.minAdvanceDelayMs = Number.isFinite(options.minAdvanceDelayMs)
      ? options.minAdvanceDelayMs
      : 420;

    this.queue = [];
    this.choices = [];
    this.active = false;
    this.onChoice = null;
    this.onComplete = null;

    this.currentSpeaker = "";
    this.currentLine = "";
    this.printIndex = 0;
    this.isTyping = false;
    this._typingTimer = null;
    this._lineShownAt = 0;
    this._justFinishedTypingAt = 0;

    this.advance = () => {
      if (!this.active) return;

      // Если показаны варианты ответа, тап по фону не должен выбирать случайный вариант.
      if (this.choicesEl.children.length > 0) {
        return;
      }

      const now = Date.now();

      if (this.isTyping) {
        if (now - this._lineShownAt < this.minAdvanceDelayMs) return;
        this._finishTyping();
        return;
      }

      if (now - this._justFinishedTypingAt < this.minAdvanceDelayMs) {
        return;
      }

      this.next();
    };

    this._onKeyDown = (e) => {
      if (!this.active) return;

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        this.advance();
      }
    };

    this._onPointerAdvance = (e) => {
      if (!this.active) return;

      // Кнопки выборов обрабатываются отдельно.
      if (e.target.closest?.(".dialogue-choice-btn")) return;

      e.preventDefault?.();
      this.advance();
    };

    window.addEventListener("keydown", this._onKeyDown, { passive: false });
    this.root.addEventListener("pointerdown", this._onPointerAdvance);
    this.root.addEventListener("touchstart", this._onPointerAdvance, { passive: false });
    this.root.addEventListener("click", this._onPointerAdvance);
  }

  _ensureFontLoaded() {
    if (document.fonts?.load) {
      document.fonts.load('22px "shrift"').catch(() => {});
    }
  }

  isOpen() {
    return this.active;
  }

  show({ speaker = "", lines = [], choices = [], onComplete = null } = {}) {
    this._ensureFontLoaded();

    const normalized = Array.isArray(lines)
      ? lines.map(String)
      : [String(lines)];

    this.queue = [...normalized];
    this.choices = Array.isArray(choices) ? choices : [];
    this.currentSpeaker = String(speaker ?? "");
    this.onComplete = onComplete;

    this._setSpeakerName(this.currentSpeaker);

    this.textEl.textContent = "";
    this.choicesEl.innerHTML = "";

    this.active = true;
    this.root.style.display = "block";
    this.root.setAttribute("aria-hidden", "false");

    this._setHint();
    this.next();
  }

  _splitSpeakerPrefix(line) {
    const text = String(line ?? "");

    // Поддерживает строки формата:
    // "Васька: текст", "Света: текст", "Семён: текст".
    // Если префикса нет — используется speaker сцены.
    const match = text.match(/^([А-ЯЁA-Z][А-ЯЁа-яёA-Za-z0-9 .\-]{1,32}):\s*(.*)$/);

    if (!match) {
      return {
        speaker: this.currentSpeaker,
        text,
      };
    }

    return {
      speaker: match[1],
      text: match[2],
    };
  }

  _setSpeakerName(speaker) {
    const normalized = String(speaker ?? "").trim();
    this.nameEl.textContent = normalized ? `${normalized}:` : "";
  }

  next() {
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

    const parsedLine = this._splitSpeakerPrefix(line);
    this.currentLine = parsedLine.text;
    this._setSpeakerName(parsedLine.speaker);
    this.printIndex = 0;
    this.textEl.textContent = "";
    this._lineShownAt = Date.now();
    this._justFinishedTypingAt = 0;

    this._setHint();
    this._startTyping();
  }

  hide() {
    this._stopTyping();

    const completeCallback = this.onComplete;

    this.active = false;
    this.queue = [];
    this.choices = [];
    this.currentSpeaker = "";
    this.currentLine = "";
    this.printIndex = 0;
    this.onChoice = null;
    this.onComplete = null;

    this.nameEl.textContent = "";
    this.textEl.textContent = "";
    this.hintEl.textContent = "";
    this.choicesEl.innerHTML = "";

    this.root.style.display = "none";
    this.root.setAttribute("aria-hidden", "true");

    if (typeof completeCallback === "function") {
      completeCallback();
    }
  }

  destroy() {
    this._stopTyping();
    window.removeEventListener("keydown", this._onKeyDown);
    this.root.removeEventListener("pointerdown", this._onPointerAdvance);
    this.root.removeEventListener("touchstart", this._onPointerAdvance);
    this.root.removeEventListener("click", this._onPointerAdvance);
  }

  _showChoices() {
    this._stopTyping();
    this.textEl.textContent = this.currentLine || "";
    this.choicesEl.innerHTML = "";
    this.hintEl.textContent = this._choiceHintText();

    this.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dialogue-choice-btn";
      btn.textContent = choice.text;

      let chosen = false;

      const choose = (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();

        if (chosen) return;
        chosen = true;

        const selectedChoice = choice;
        const callback = this.onChoice;

        this.hide();

        if (typeof callback === "function") {
          callback(selectedChoice);
        }
      };

      // Выбор срабатывает только при обычном click,
      // чтобы на телефоне можно было зажать палец, увести его и не выбрать случайно.
      btn.addEventListener("click", choose);

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

      let delay = this.charDelayMs;
      const lastChar = this.currentLine[this.printIndex - 1];

      if (lastChar === "." || lastChar === "!" || lastChar === "?") delay += 90;
      if (lastChar === "," || lastChar === "—") delay += 45;
      if (lastChar === "…") delay += 120;

      this._typingTimer = window.setTimeout(step, delay);
    };

    this._typingTimer = window.setTimeout(step, this.charDelayMs);
  }

  _isMobileDevice() {
    return !!window.isMobileControlsDevice;
  }

  _advanceHintText(action = "дальше") {
    return this._isMobileDevice()
      ? `Тап — ${action}`
      : `Space / Enter — ${action}`;
  }

  _choiceHintText() {
    return this._isMobileDevice()
      ? "Выберите вариант пальцем"
      : "Выберите вариант мышкой";
  }

  _finishTyping() {
    this._stopTyping();
    this.textEl.textContent = this.currentLine;
    this._justFinishedTypingAt = Date.now();

    if (this.queue.length > 0) {
      this.hintEl.textContent = this._advanceHintText("дальше");
    } else if (this.choices.length > 0) {
      this.hintEl.textContent = this._choiceHintText();
    } else {
      this.hintEl.textContent = this._advanceHintText("закрыть");
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
    this.hintEl.textContent = this._advanceHintText("допечатать");
  }
}

export const dialogueUI = new DialogueUI({ charDelayMs: 58, minAdvanceDelayMs: 420 });
