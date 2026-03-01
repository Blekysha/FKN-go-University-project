/*
  inventory.js

  Инвентарь (прогресс подбора предметов).

  Отвечает за:
  - хранение инвентаря в Set (itemId)
  - загрузку из scene.registry ("inventory" как объект { id: true })
  - сохранение обратно в scene.registry
  - операции add/has

  НЕ отвечает за:
  - создание предметов на карте (world/levelManager)
  - обработку нажатий/взаимодействий (interactionSystem)
*/

export function createInventory(scene) {
  // Загружаем из registry: объект { itemId: true }
  const invObj = scene.registry.get("inventory") || {};
  const set = new Set(Object.keys(invObj).filter((k) => invObj[k] === true));

  function syncToRegistry() {
    const obj = {};
    for (const id of set) obj[id] = true;
    scene.registry.set("inventory", obj);
  }

  return {
    has(id) {
      return set.has(id);
    },

    add(id) {
      set.add(id);
      syncToRegistry(); // важно: чтобы после смены карты предметы могли не появляться
    },

    // иногда полезно иметь доступ к списку (например для отладки/UI)
    values() {
      return Array.from(set.values());
    },
  };
}
