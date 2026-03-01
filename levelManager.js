/*
  levelManager.js

  Управление уровнем/картой.

  Отвечает за:
  - уничтожение текущего уровня (слои/группы/коллайдеры)
  - создание нового уровня из tilemap: слой BackGround + walls/doors/items
  - настройку bounds мира и камеры под размер карты
  - установка спавна игрока по Object Layer "Spawns" (если указан)

  НЕ отвечает за:
  - логику "можно ли пройти через дверь" (interactionSystem)
  - логику инвентаря/прогресса (inventory)
*/

import { buildColliders, buildDoors, buildItems } from "./world.js";

export function createLevelManager(scene, { playerSprite }) {
  // текущее состояние уровня
  const state = {
    map: null,
    layer: null, // BackGround
    walls: null,
    doors: null,
    items: null,
    playerCollider: null,
  };

  function destroyCurrentLevel() {
    if (state.playerCollider) {
      state.playerCollider.destroy();
      state.playerCollider = null;
    }

    if (state.walls) {
      state.walls.destroy(true);
      state.walls = null;
    }

    if (state.doors) {
      state.doors.destroy(true);
      state.doors = null;
    }

    if (state.items) {
      state.items.destroy(true);
      state.items = null;
    }

    if (state.layer) {
      state.layer.destroy();
      state.layer = null;
    }

    state.map = null;
  }

  function applyBounds(map) {
    // bounds физики
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // bounds камеры (follow остаётся настроенным в GameScene)
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  function setSpawn(map, spawnName) {
    if (!spawnName) return;

    const spawnsLayer = map.getObjectLayer("Spawns");
    const spawn = spawnsLayer?.objects?.find((o) => o.name === spawnName);

    if (spawn) {
      playerSprite.setPosition(spawn.x, spawn.y);
    } else {
      console.warn("Spawn не найден:", spawnName, "на карте", map.key);
    }
  }

  function buildLevel(mapKey) {
    const map = scene.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage("tileset", "tiles");

    const background = map.createLayer("BackGround", tileset, 0, 0);
    if (!background) {
      console.warn("Слой BackGround не найден или он не tilelayer.");
    }

    // стены/коллизии
    const walls = buildColliders(scene, map, "Colliders");
    const playerCollider = scene.physics.add.collider(playerSprite, walls);

    // двери
    const doors = buildDoors(scene, map, "Doors");

    // предметы (создаются все; фильтрацию "уже собран" будем делать в inventory/interaction)
    const items = buildItems(scene, map, "Items");

    return { map, background, walls, playerCollider, doors, items };
  }

  function load(mapKey, spawnName) {
    destroyCurrentLevel();

    const built = buildLevel(mapKey);

    state.map = built.map;
    state.layer = built.background;
    state.walls = built.walls;
    state.playerCollider = built.playerCollider;
    state.doors = built.doors;
    state.items = built.items;

    applyBounds(state.map);
    setSpawn(state.map, spawnName);
  }

  // Публичный API
  return {
    load,

    // доступ к текущим группам/карте для других подсистем
    getMap() {
      return state.map;
    },
    getDoors() {
      return state.doors;
    },
    getItems() {
      return state.items;
    },
  };
}
