/*
  main.js

  Точка входа в игру.
  Создаёт конфигурацию Phaser (размеры, физика, масштабирование)
  и запускает игру с подключённой сценой GameScene.

  Здесь НЕ должно быть игровой логики.
*/
import { GameScene } from "./GameScene.js";

const config = {
  type: Phaser.AUTO,
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
