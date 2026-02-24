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
import { buildColliders, buildDoors, buildItems } from "./world.js";
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
let items;
let currentItem = null;
let inventory; // Set

function preload() {
  this.load.image("tiles", "assets/tileset.png");
  this.load.tilemapTiledJSON("testMap", "assets/maps/testMap.json");
  this.load.image("player", "assets/player.png");
  this.load.tilemapTiledJSON("corridor", "assets/maps/corridor.json");
  this.load.image("key", "assets/key.png");
}

function create() {
  const map = this.make.tilemap({ key: "testMap" });
  const tileset = map.addTilesetImage("tileset", "tiles");

  const background = map.createLayer("BackGround", tileset, 0, 0);
  if (!background)
    console.warn("Слой BackGround не найден или он не tilelayer.");

  // важно: сохраняем слой, чтобы потом удалить при смене карты
  this.currentMapLayer = background;

  // Игрок
  player = createPlayer(this, 48, 90); // расположение игрока при появлении
  player.setupWorldBounds(map.widthInPixels, map.heightInPixels, 20);

  // --- Inventory (Set) + sync with registry ---
  const invObj = this.registry.get("inventory") || {}; // объект { itemId: true }
  inventory = new Set(Object.keys(invObj).filter((k) => invObj[k] === true));

  // Коллизии (сохраняем ссылки, чтобы удалять при смене карты)
  this.currentWalls = buildColliders(this, map, "Colliders");
  this.playerCollider = this.physics.add.collider(
    player.sprite,
    this.currentWalls
  );

  // Двери (сохраняем)
  this.currentDoors = buildDoors(this, map, "Doors");
  doors = this.currentDoors;

  // Предметы (сохраняем)
  this.currentItems = buildItems(this, map, "Items");
  items = this.currentItems;

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

  // --- поиск предмета ---
  currentItem = null;
  this.physics.overlap(player.sprite, items, (_, it) => {
    currentItem = it;
  });

  // --- поиск двери ---
  currentDoor = null;
  this.physics.overlap(player.sprite, doors, (_, doorZone) => {
    currentDoor = doorZone;
  });

  // --- подсказка ---
  if (currentItem) {
    hintE.showAt(currentItem.x, currentItem.y - 14, "E");
  } else if (currentDoor) {
    hintE.showAt(
      currentDoor.x,
      currentDoor.y - currentDoor.height / 2 - 6,
      "E"
    );
  } else {
    hintE.hide();
  }

  // --- обработка E ---
  if (Phaser.Input.Keyboard.JustDown(keyE)) {
    // 1) предмет
    if (currentItem) {
      const id = currentItem.itemData?.itemId;
      if (!id) return;

      inventory.add(id);
      syncInventoryToRegistry(this); // важно для buildItems после смены карты

      currentItem.destroy(); // визуально исчезает
      currentItem = null;

      console.log("Подобран предмет:", id);
      return;
    }

    // 2) дверь
    if (currentDoor) {
      const d = currentDoor.doorData;

      if (d.locked && !inventory.has(d.keyId)) {
        console.log("Заперто. Нужен ключ:", d.keyId);
        return;
      }

      loadMap(this, d.targetMap, d.targetSpawn);
    }
  }
}

function loadMap(scene, mapKey, spawnName) {
  // Удаляем старые стены/коллайдер/двери/предметы/слой
  if (scene.playerCollider) {
    scene.playerCollider.destroy();
    scene.playerCollider = null;
  }

  if (scene.currentWalls) {
    scene.currentWalls.destroy(true);
    scene.currentWalls = null;
  }

  if (scene.currentDoors) {
    scene.currentDoors.destroy(true);
    scene.currentDoors = null;
  }

  if (scene.currentItems) {
    scene.currentItems.destroy(true);
    scene.currentItems = null;
  }

  if (scene.currentMapLayer) {
    scene.currentMapLayer.destroy();
    scene.currentMapLayer = null;
  }

  // Загружаем новую карту
  const newMap = scene.make.tilemap({ key: mapKey });
  const tileset = newMap.addTilesetImage("tileset", "tiles");
  scene.currentMapLayer = newMap.createLayer("BackGround", tileset, 0, 0);

  // Стены
  scene.currentWalls = buildColliders(scene, newMap, "Colliders");
  scene.playerCollider = scene.physics.add.collider(
    player.sprite,
    scene.currentWalls
  );

  // Двери
  scene.currentDoors = buildDoors(scene, newMap, "Doors");
  doors = scene.currentDoors;

  // Предметы
  scene.currentItems = buildItems(scene, newMap, "Items");
  items = scene.currentItems;

  // Границы
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
  } else {
    console.warn("Spawn не найден:", spawnName, "на карте", mapKey);
  }
}

function syncInventoryToRegistry(scene) {
  const obj = {};
  for (const id of inventory) obj[id] = true;
  scene.registry.set("inventory", obj);
}
