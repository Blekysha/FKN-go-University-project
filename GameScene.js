/*
  GameScene.js

  Основная игровая сцена.

  Отвечает за:
  - загрузку ассетов (preload)
  - создание карты, игрока, дверей и коллизий (create)
  - обновление логики каждый кадр (update)
  - обработку взаимодействий (движение, двери, клавиша E)

  Это координационный слой, который связывает остальные модули.
*/
import { createPlayer } from "./Player.js";
import { buildColliders, buildDoors } from "./world.js";
import { createInteractionHint } from "./ui.js";

export const GameScene = {
  preload,
  create,
  update,
};

let player;
let cursors;
let keyE;
let doors;
let currentDoor = null;
let hintE;

function preload() {
  this.load.image("tiles", "assets/tileset.png");
  this.load.tilemapTiledJSON("testMap", "assets/maps/testMap.json");
  this.load.image("player", "assets/player.png");
}

function create() {
  const map = this.make.tilemap({ key: "testMap" });
  const tileset = map.addTilesetImage("tileset", "tiles");

  const background = map.createLayer("BackGround", tileset, 0, 0);
  if (!background)
    console.warn("Слой BackGround не найден или он не tilelayer.");

  // Игрок
  player = createPlayer(this, 4 * 32, 100);
  player.setupWorldBounds(map.widthInPixels, map.heightInPixels, 20);

  // Коллизии
  const walls = buildColliders(this, map, "Colliders");
  this.physics.add.collider(player.sprite, walls);

  // Двери
  doors = buildDoors(this, map, "Doors");

  // Клавиши
  cursors = this.input.keyboard.createCursorKeys();
  keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  // UI
  hintE = createInteractionHint(this);

  // Камера
  this.cameras.main.startFollow(player.sprite);
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.setZoom(3);

  this.input.on("pointerdown", () => this.game.canvas.focus());
}

function update() {
  player.updateMovement(cursors);

  // --- дверь + подсказка E ---
  currentDoor = null;
  this.physics.overlap(player.sprite, doors, (_, doorZone) => {
    currentDoor = doorZone;
  });

  if (currentDoor) {
    hintE.showAt(
      currentDoor.x,
      currentDoor.y - currentDoor.height / 2 - 6,
      "E"
    );
  } else {
    hintE.hide();
  }

  if (Phaser.Input.Keyboard.JustDown(keyE) && currentDoor) {
    const d = currentDoor.doorData;

    if (d.locked) {
      console.log("Заперто.");
      return;
    }

    console.log("Переход:", d.targetMap, d.targetSpawn);
  }
}
