/*
  levelManager.js

  Управление уровнем/картой.
*/

import { buildColliders, buildDoors, buildItems, buildNpcs } from "./world.js";

export function createLevelManager(scene, { playerSprite }) {
  const state = {
    map: null,
    backgroundLayer: null,
    walls: null,
    doors: null,
    items: null,
    npcs: null,
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

    if (state.npcs) {
      state.npcs.zones?.destroy(true);
      state.npcs.sprites?.clear(true, true);
      state.npcs = null;
    }

    if (state.backgroundLayer) {
      state.backgroundLayer.destroy();
      state.backgroundLayer = null;
    }

    state.map = null;
  }

  function applyBounds(map) {
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  function setSpawn(map, mapKey, spawnName) {
    if (!spawnName) return;

    const spawnsLayer = map.getObjectLayer("Spawns");
    const spawn = spawnsLayer?.objects?.find((o) => o.name === spawnName);

    if (spawn) {
      playerSprite.setPosition(spawn.x, spawn.y);
    } else {
      console.warn("Spawn не найден:", spawnName, "на карте", mapKey);
    }
  }

  function buildLevel(mapKey) {
    const map = scene.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage("tileset", "tiles");

    const backgroundLayer = map.createLayer("BackGround", tileset, 0, 0);
    if (!backgroundLayer) {
      console.warn("Слой BackGround не найден или он не tilelayer.");
    }

    const walls = buildColliders(scene, map, "Colliders");
    const playerCollider = walls
      ? scene.physics.add.collider(playerSprite, walls)
      : null;

    const doors = buildDoors(scene, map, "Doors");
    const items = buildItems(scene, map, "Items");
    const npcs = buildNpcs(scene, map, "NPCs");

    return {
      map,
      backgroundLayer,
      walls,
      playerCollider,
      doors,
      items,
      npcs,
    };
  }

  function load(mapKey, spawnName) {
    destroyCurrentLevel();

    const built = buildLevel(mapKey);

    state.map = built.map;
    state.backgroundLayer = built.backgroundLayer;
    state.walls = built.walls;
    state.playerCollider = built.playerCollider;
    state.doors = built.doors;
    state.items = built.items;
    state.npcs = built.npcs;

    applyBounds(state.map);
    setSpawn(state.map, mapKey, spawnName);
  }

  return {
    load,

    getMap() {
      return state.map;
    },

    getDoors() {
      return state.doors;
    },

    getItems() {
      return state.items;
    },

    getNpcs() {
      return state.npcs?.zones ?? null;
    },
  };
}
