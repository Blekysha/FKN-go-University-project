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

    const colliderId =
      getProp(o, "colliderId", "") ||
      getProp(o, "npcId", "") ||
      o.name ||
      "";

    const isExamStudentCollider =
      colliderId === "exam_student" ||
      colliderId === "npc_exam_student";

    const isCrowdStudentsCollider =
      colliderId === "crowd_students" ||
      colliderId === "npc_crowd_students";

    const isTransitionGirlCollider =
      colliderId === "transition_girl" ||
      colliderId === "npc_transition_girl";

    // late: убираем только коллайдер одиночного студента.
    // very late: убираем и одиночного студента, и толпу.
    if (scene.storyState?.hasFlag?.("very_late_to_exam")) {
      if (isExamStudentCollider || isCrowdStudentsCollider) {
        return;
      }
    } else if (scene.storyState?.hasFlag?.("late_to_exam")) {
      if (isExamStudentCollider) {
        return;
      }
    }

    // Девушка в переходе ушла после выхода Васьки в университет.
    if (
      scene.storyState?.hasFlag?.("transition_acquaintance_left") &&
      isTransitionGirlCollider
    ) {
      return;
    }

    const x = o.x + o.width / 2;
    const y = o.y + o.height / 2;

    const zone = scene.add.zone(x, y, o.width, o.height);
    scene.physics.add.existing(zone, true);

    zone.colliderData = {
      colliderId,
      objectName: o.name || "",
    };

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

  if (!layer) {
    console.warn(`Object Layer '${layerName}' не найден.`);
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
    // Некоторые старые объекты в Tiled имеют только itemId без type.
    // Например studyDesk — стол/компьютер для подготовки.
    const isInteraction =
      type === "interaction" ||
      itemId === "studyDesk" ||
      itemId === "windowRest" ||
      itemId === "examDesk" ||
      itemId === "tetruDoor" ||
      itemId === "universityStairs" ||
      itemId === "universitySchedule" ||
      itemId === "coffeeMachine";

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

  if (!layer) {
    console.warn(`Object Layer '${layerName}' не найден.`);
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

    // Опоздание влияет на состав NPC ещё ДО создания спрайтов и коллайдеров.
    // Проверяем не только npcId, но и texture/name, потому что в Tiled
    // объект может быть назван иначе.
    const textureForLateCheck = getProp(o, "texture", "");
    const objectNameForLateCheck = o.name || "";

    const isExamStudent =
      npcId === "exam_student" ||
      npcId === "npc_exam_student" ||
      textureForLateCheck === "npc_exam_student" ||
      objectNameForLateCheck === "exam_student" ||
      objectNameForLateCheck === "npc_exam_student";

    const isCrowdStudents =
      npcId === "crowd_students" ||
      npcId === "npc_crowd_students" ||
      textureForLateCheck === "npc_crowd_students" ||
      objectNameForLateCheck === "crowd_students" ||
      objectNameForLateCheck === "npc_crowd_students";

    // late: одиночный студент уже ушёл.
    // very late: ушли и одиночный студент, и толпа.
    if (scene.storyState?.hasFlag?.("very_late_to_exam")) {
      if (isExamStudent || isCrowdStudents) {
        return;
      }
    } else if (scene.storyState?.hasFlag?.("late_to_exam")) {
      if (isExamStudent) {
        return;
      }
    }

    if (
      npcId === "transition_girl" &&
      scene.storyState?.hasFlag?.("transition_acquaintance_left")
    ) {
      return;
    }

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
