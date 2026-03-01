/*
  interactionSystem.js

  Система взаимодействий.

  Отвечает за:
  - поиск текущего предмета (overlap)
  - поиск текущей двери (overlap)
  - управление подсказкой (hint)
  - обработку нажатия E:
      - подбор предмета
      - проверку двери (locked/key)
      - загрузку новой карты через levelManager

  НЕ отвечает за:
  - движение игрока
  - создание уровня
  - хранение инвентаря (только использует его API)
*/

export function createInteractionSystem(
  scene,
  { playerSprite, keyE, hint, inventory, levelManager }
) {
  let currentItem = null;
  let currentDoor = null;

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

  function updateHint() {
    if (currentItem) {
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

    // 1) предмет
    if (currentItem) {
      const id = currentItem.itemData?.itemId;
      if (!id) return;

      inventory.add(id);

      currentItem.destroy();
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

      levelManager.load(d.targetMap, d.targetSpawn);
    }
  }

  function update() {
    findItem();
    findDoor();
    updateHint();
    handleInteract();
  }

  return {
    update,
  };
}
