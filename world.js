/*
  world.js

  Модуль работы с объектами карты (Tiled).

  Отвечает за:
  - создание коллизий из Object Layer (Colliders)
  - создание дверей из Object Layer (Doors)
  - создание предметов из Object Layer (Items)
  - создание NPC из Object Layer (NPCs)
  - чтение пользовательских свойств объектов (type, locked, targetMap и т.д.)

  Это слой, который связывает карту Tiled с игровой логикой.
*/

function getProp(o, name, def = undefined) {
  const p = o.properties?.find((x) => x.name === name);
  return p ? p.value : def;
}

export function buildColliders(scene, map, layerName) {
  const layer = map.getObjectLayer(layerName);
  const walls = scene.physics.add.staticGroup();

  if (!layer) {
    console.warn(`Object Layer '${layerName}' не найден.`);
    return walls;
  }

  layer.objects.forEach((o) => {
    if (!o.width || !o.height) return;

    const x = o.x + o.width / 2;
    const y = o.y + o.height / 2;

    const zone = scene.add.zone(x, y, o.width, o.height);
    scene.physics.add.existing(zone, true);
    walls.add(zone);
  });

  return walls;
}

export function buildDoors(scene, map, layerName) {
  const layer = map.getObjectLayer(layerName);
  const doors = scene.physics.add.staticGroup();

  if (!layer) {
    console.warn(`Object Layer '${layerName}' не найден.`);
    return doors;
  }

  layer.objects.forEach((o) => {
    if (!o.width || !o.height) return;

    const x = o.x + o.width / 2;
    const y = o.y + o.height / 2;

    const z = scene.add.zone(x, y, o.width, o.height);
    scene.physics.add.existing(z, true);

    z.doorData = {
      type: getProp(o, "type", "door"),
      targetMap: getProp(o, "targetMap", ""),
      targetSpawn: getProp(o, "targetSpawn", ""),
      locked: !!getProp(o, "locked", false),
      keyId: getProp(o, "keyId", ""),
    };

    doors.add(z);
  });

  return doors;
}

export function buildItems(scene, map, layerName) {
  const layer = map.getObjectLayer(layerName);
  const items = scene.physics.add.staticGroup();

  if (!layer) return items; // нет слоя — нет предметов на этой карте, это нормально

  layer.objects.forEach((o) => {
    const type = getProp(o, "type", "");
    if (type !== "key") return;

    const itemId = getProp(o, "itemId", "");
    const spriteKey = getProp(o, "sprite", "key");

    // Проверяем через registry, не был ли ключ уже собран
    const inventory = scene.registry.get("inventory") || {};
    if (inventory[itemId]) {
      return;
    }

    // координаты: для Rect учитываем центр, для Point — x/y как есть
    const x = o.width ? o.x + o.width / 2 : o.x;
    const y = o.height ? o.y + o.height / 2 : o.y;

    const img = scene.add.image(x, y, spriteKey).setDepth(900);
    scene.physics.add.existing(img, true);

    img.itemData = {
      type,
      itemId,
      collected: false,
    };

    items.add(img);
  });

  return items;
}

export function buildNpcs(scene, map, layerName) {
  const layer = map.getObjectLayer(layerName);

  if (!layer) {
    return {
      zones: scene.physics.add.staticGroup(),
      sprites: scene.add.group(),
    };
  }

  const zones = scene.physics.add.staticGroup();
  const sprites = scene.add.group();

  layer.objects.forEach((o) => {
    const npcId = getProp(o, "npcId", "");
    if (!npcId) return;

    const texture = getProp(o, "texture", "");
    const offsetY = Number(getProp(o, "offsetY", 0));
    const offsetX = Number(getProp(o, "offsetX", 0));

    // Если объект rectangle — берём его размеры.
    // Если point — задаём дефолтную зону.
    const width = o.width || 24;
    const height = o.height || 24;

    const x = o.width ? o.x + o.width / 2 : o.x;
    const y = o.height ? o.y + o.height / 2 : o.y;

    // Невидимая зона взаимодействия
    const zone = scene.add.zone(x, y, width, height);
    scene.physics.add.existing(zone, true);

    zone.npcData = {
      npcId,
    };

    zones.add(zone);

    // Визуальный спрайт NPC, если texture указан
    if (texture) {
      const sprite = scene.add
        .image(x + offsetX, y + offsetY, texture)
        .setDepth(900);
      sprites.add(sprite);

      zone.npcData.sprite = sprite;
    }
  });

  return { zones, sprites };
}
