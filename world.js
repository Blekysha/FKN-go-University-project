/*
  world.js

  Модуль работы с объектами карты (Tiled).

  Отвечает за:
  - создание коллизий из Object Layer (Colliders)
  - создание дверей из Object Layer (Doors)
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
