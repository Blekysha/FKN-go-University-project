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
  this.load.tilemapTiledJSON("corridor", "assets/maps/corridor.json");
}

function create() {
  const map = this.make.tilemap({ key: "testMap" });
  const tileset = map.addTilesetImage("tileset", "tiles");

  const background = map.createLayer("BackGround", tileset, 0, 0);
  if (!background)
    console.warn("Слой BackGround не найден или он не tilelayer.");

  // Игрок
  player = createPlayer(this, 4 * 12, 90); //расположение игрока при появлении
  player.setupWorldBounds(map.widthInPixels, map.heightInPixels, 20);

  // Коллизии (сохраняем ссылки, чтобы удалять при смене карты)
  this.currentWalls = buildColliders(this, map, "Colliders");
  this.playerCollider = this.physics.add.collider(
    player.sprite,
    this.currentWalls
  );

  // Двери (тоже сохраняем)
  this.currentDoors = buildDoors(this, map, "Doors");
  doors = this.currentDoors;

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

    loadMap(this, d.targetMap, d.targetSpawn);
  }
  function loadMap(scene, mapKey, spawnName) {
    // Удаляем старые стены
    if (scene.currentWalls) {
      scene.currentWalls.clear(true, true);
    }

    // Удаляем старый collider
    if (scene.playerCollider) {
      scene.playerCollider.destroy();
    }

    // Удаляем старые двери
    if (scene.currentDoors) {
      scene.currentDoors.clear(true, true);
    }

    // Загружаем новую карту
    const newMap = scene.make.tilemap({ key: mapKey });
    const tileset = newMap.addTilesetImage("tileset", "tiles");
    const background = newMap.createLayer("BackGround", tileset, 0, 0);

    // Создаём новые стены
    const newWalls = buildColliders(scene, newMap, "Colliders");
    scene.currentWalls = newWalls;

    // Создаём новый collider
    scene.playerCollider = scene.physics.add.collider(player.sprite, newWalls);

    // Создаём новые двери
    const newDoors = buildDoors(scene, newMap, "Doors");
    scene.currentDoors = newDoors;
    doors = newDoors;

    // Обновляем границы мира
    scene.physics.world.setBounds(
      0,
      0,
      newMap.widthInPixels,
      newMap.heightInPixels
    );

    scene.cameras.main.setBounds(
      0,
      0,
      newMap.widthInPixels,
      newMap.heightInPixels
    );

    // Спавн
    const spawnsLayer = newMap.getObjectLayer("Spawns");
    const spawn = spawnsLayer?.objects?.find((o) => o.name === spawnName);

    if (spawn) {
      player.sprite.setPosition(spawn.x, spawn.y);
    }
  }
}
