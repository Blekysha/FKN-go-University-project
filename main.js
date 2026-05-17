/*
  main.js

  Точка входа в игру.
  Создаёт конфигурацию Phaser (размеры, физика, масштабирование)
  и запускает игру с подключённой сценой GameScene.

  Здесь НЕ должно быть игровой логики.
*/
import { GameScene } from "./GameScene.js";


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
