/*
  main.js

  Точка входа в игру.
  Создаёт конфигурацию Phaser (размеры, физика, масштабирование)
  и запускает игру с подключённой сценой GameScene.

  Здесь НЕ должно быть игровой логики.
*/
import { GameScene } from "./GameScene.js";


function isTouchDevice() {
  return window.matchMedia?.("(pointer: coarse)")?.matches || "ontouchstart" in window;
}

window.isMobileControlsDevice = isTouchDevice();

if (window.isMobileControlsDevice) {
  document.documentElement.classList.add("is-mobile-controls");
} else {
  document.documentElement.classList.add("is-desktop-controls");
}



function initMobileControls() {
  window.mobileInput = window.mobileInput ?? {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
  };

  const bindHoldButton = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const press = (event) => {
      event.preventDefault();
      window.mobileInput[key] = true;
      btn.classList.add("is-pressed");
    };

    const release = (event) => {
      event?.preventDefault?.();
      window.mobileInput[key] = false;
      btn.classList.remove("is-pressed");
    };

    btn.addEventListener("touchstart", press, { passive: false });
    btn.addEventListener("touchend", release, { passive: false });
    btn.addEventListener("touchcancel", release, { passive: false });
    btn.addEventListener("pointerdown", press);
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointerleave", release);
  };

  const bindTapButton = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const tap = (event) => {
      event.preventDefault();
      window.mobileInput[key] = true;
      btn.classList.add("is-pressed");
      window.setTimeout(() => btn.classList.remove("is-pressed"), 120);
    };

    btn.addEventListener("touchstart", tap, { passive: false });
    btn.addEventListener("pointerdown", tap);
  };

  bindHoldButton("btnUp", "up");
  bindHoldButton("btnDown", "down");
  bindHoldButton("btnLeft", "left");
  bindHoldButton("btnRight", "right");
  bindTapButton("btnInteract", "interact");
}

initMobileControls();

function bindGlobalMobileAdvance() {
  const sendSpace = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        cancelable: true,
      })
    );
  };

  const isVisible = (el) => {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  };

  const isIgnoredTarget = (target) =>
    target.closest?.("button") ||
    target.closest?.(".dialogue-choice-btn") ||
    target.closest?.("#mobileControls") ||
    target.closest?.("#miniGameOverlay") ||
    target.closest?.("#startMenu");

  const canAdvanceNow = () => {
    const dialogue = document.getElementById("dialogue");
    const blackScreen = document.getElementById("blackScreen");
    return isVisible(dialogue) || isVisible(blackScreen);
  };

  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  let suppressNextClickUntil = 0;

  document.addEventListener(
    "touchstart",
    (event) => {
      if (!window.isMobileControlsDevice) return;
      const touch = event.touches?.[0];
      if (!touch) return;

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchMoved = false;
    },
    { passive: true, capture: true }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (!window.isMobileControlsDevice) return;
      const touch = event.touches?.[0];
      if (!touch) return;

      const dx = Math.abs(touch.clientX - touchStartX);
      const dy = Math.abs(touch.clientY - touchStartY);
      if (dx > 10 || dy > 10) {
        touchMoved = true;
      }
    },
    { passive: true, capture: true }
  );

  document.addEventListener(
    "touchend",
    (event) => {
      if (!window.isMobileControlsDevice) return;
      if (touchMoved) return;
      if (isIgnoredTarget(event.target)) return;
      if (!canAdvanceNow()) return;

      event.preventDefault();
      suppressNextClickUntil = Date.now() + 350;
      sendSpace();
    },
    { passive: false, capture: true }
  );

  document.addEventListener(
    "click",
    (event) => {
      if (!window.isMobileControlsDevice) return;
      if (Date.now() < suppressNextClickUntil) return;
      if (isIgnoredTarget(event.target)) return;
      if (!canAdvanceNow()) return;

      event.preventDefault();
      sendSpace();
    },
    { capture: true }
  );
}

bindGlobalMobileAdvance();







const config = {
  type: Phaser.AUTO,
  parent: "game", // <-- добавить
  width: 760,
  height: 480,
  backgroundColor: "#000000",
  pixelArt: true,
  roundPixels: true,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },

  scene: GameScene,
};

new Phaser.Game(config);
