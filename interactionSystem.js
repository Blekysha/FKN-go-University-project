/*
  interactionSystem.js

  Система взаимодействий.

  Отвечает за:
  - поиск текущего предмета (overlap)
  - поиск текущей двери (overlap)
  - поиск текущего NPC (overlap)
  - управление подсказкой (hint)
  - обработку нажатия E:
      - подбор предмета
      - проверку двери (locked/key)
      - разговор с NPC
      - загрузку новой карты через levelManager

  НЕ отвечает за:
  - движение игрока
  - создание уровня
  - хранение инвентаря
  - тексты диалогов
*/

import { dialogueUI } from "./dialogueUI.js";

export function createInteractionSystem(
  scene,
  { playerSprite, keyE, hint, inventory, levelManager, dialogueManager }
) {
  let currentItem = null;
  let currentDoor = null;
  let currentNpc = null;

  function findItem() {
    currentItem = null;

    const items = levelManager.getItems();
    if (!items) return;

    scene.physics.overlap(playerSprite, items, (_, it) => {
      currentItem = it;
    });
  }

  function findDoor() {
    currentDoor = null;

    const doors = levelManager.getDoors();
    if (!doors) return;

    scene.physics.overlap(playerSprite, doors, (_, doorZone) => {
      currentDoor = doorZone;
    });
  }

  function findNpc() {
    currentNpc = null;

    const npcs = levelManager.getNpcs();
    if (!npcs) return;

    scene.physics.overlap(playerSprite, npcs, (_, npcZone) => {
      currentNpc = npcZone;
    });
  }

  function updateHint() {
    // приоритет: NPC → предмет → дверь
    if (currentNpc) {
      hint.showAt(currentNpc.x, currentNpc.y - 20, "E");
    } else if (currentItem) {
      hint.showAt(currentItem.x, currentItem.y - 14, "E");
    } else if (currentDoor) {
      hint.showAt(
        currentDoor.x,
        currentDoor.y - currentDoor.height / 2 - 6,
        "E"
      );
    } else {
      hint.hide();
    }
  }

  function handleInteract() {
    if (!Phaser.Input.Keyboard.JustDown(keyE)) return;

    // если открыт диалог — не начинаем новый
    if (dialogueUI.isOpen()) return;

    // 1) NPC
    if (currentNpc) {
      const npcId = currentNpc.npcData?.npcId;
      if (!npcId) return;

      dialogueManager.startNpc(npcId);
      return;
    }

    // 2) предмет
    if (currentItem) {
      const id = currentItem.itemData?.itemId;
      if (!id) return;

      inventory.add(id);

      currentItem.destroy();
      currentItem = null;

      dialogueUI.show({
        speaker: "Система",
        lines: [`Получен предмет: ${id}`],
      });

      return;
    }

    // 3) дверь
    if (currentDoor) {
      const d = currentDoor.doorData;

      if (d.locked && !inventory.has(d.keyId)) {
        dialogueUI.show({
          speaker: "Система",
          lines: ["Заперто.", `Нужен ключ: ${d.keyId}`],
        });
        return;
      }

      levelManager.load(d.targetMap, d.targetSpawn);
    }
  }

  function update() {
    findItem();
    findDoor();
    findNpc();
    updateHint();
    handleInteract();
  }

  return {
    update,
  };
}
