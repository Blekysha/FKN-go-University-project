/*
  world.js

  Модуль работы с объектами карты (Tiled).
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
      doorId: getProp(o, "doorId", ""),
      objectName: o.name || "",
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

  // На некоторых картах интерактивных предметов нет — это нормальная ситуация.
  if (!layer) {
    return items;
  }

  layer.objects.forEach((o) => {
    const type = getProp(o, "type", "");
    const itemId = getProp(o, "itemId", "");

    // ===== КЛЮЧ =====
    if (type === "key") {
      const spriteKey = getProp(o, "sprite", "key");

      if (scene.inventory?.has?.(itemId)) {
        return;
      }

      const x = o.width ? o.x + o.width / 2 : o.x;
      const y = o.height ? o.y + o.height / 2 : o.y;

      const img = scene.add.image(x, y, spriteKey).setDepth(900);
      scene.physics.add.existing(img, true);

      img.itemData = {
        type,
        itemId,
        objectName: o.name || "",
        collected: false,
      };

      items.add(img);
      return;
    }

    // ===== ИНТЕРАКТИВНЫЕ ОБЪЕКТЫ =====
    // В старых картах у studyDesk может быть только itemId без type.
    // Поэтому проверяем не только type === "interaction", но и известные itemId.
    const isInteraction =
      type === "interaction" ||
      itemId === "studyDesk" ||
      itemId === "windowRest" ||
      itemId === "examDesk";

    if (isInteraction && itemId) {
      const x = o.width ? o.x + o.width / 2 : o.x;
      const y = o.height ? o.y + o.height / 2 : o.y;

      const zone = scene.add.zone(x, y, o.width || 32, o.height || 32);
      scene.physics.add.existing(zone, true);

      zone.itemData = {
        type: "interaction",
        itemId,
        objectName: o.name || "",
      };

      items.add(zone);
    }
  });

  return items;
}

export function buildNpcs(scene, map, layerName) {
  const layer = map.getObjectLayer(layerName);

  // На некоторых картах NPC может не быть — это нормальная ситуация.
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

    const width = o.width || 24;
    const height = o.height || 24;

    const x = o.width ? o.x + o.width / 2 : o.x;
    const y = o.height ? o.y + o.height / 2 : o.y;

    const zone = scene.add.zone(x, y, width, height);
    scene.physics.add.existing(zone, true);

    zone.npcData = {
      npcId,
      objectName: o.name || "",
    };

    zones.add(zone);

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
