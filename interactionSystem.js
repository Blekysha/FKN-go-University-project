/*
  interactionSystem.js

  Система взаимодействий.
*/

import { dialogueUI } from "./dialogueUI.js";

export function createInteractionSystem(
  scene,
  { playerSprite, keyE, hint, inventory, levelManager, dialogueManager, state }
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
    if (currentItem) {
      hint.showAt(currentItem.x, currentItem.y - 14, "E");
    } else if (currentDoor) {
      hint.showAt(
        currentDoor.x,
        currentDoor.y - currentDoor.height / 2 - 6,
        "E"
      );
    } else if (currentNpc) {
      hint.showAt(currentNpc.x, currentNpc.y - currentNpc.height / 2 - 6, "E");
    } else {
      hint.hide();
    }
  }

  function applyToiletEffects() {
    state.setFlag("visited_toilet");
    state.incCounter("fatigue", -1);
    state.incCounter("anxiety", -1);
  }

  function afterToilet() {
    const currentGoal = state.getValue("currentGoal", null);

    if (currentGoal === "toilet") {
      dialogueManager.startScene("afterToiletChoice");
      return;
    }

    if (currentGoal === "study") {
      dialogueManager.startScene("afterToiletGoStudy");
      return;
    }

    if (currentGoal === "sveta") {
      dialogueManager.startScene("afterToiletGoSveta");
      return;
    }
  }

  function useToilet() {
    if (state.hasFlag("visited_toilet")) {
      dialogueManager.startScene("toiletAlreadyUsed");
      return;
    }

    playerSprite.setVisible(false);
    if (playerSprite.body) {
      playerSprite.body.enable = false;
    }

    dialogueUI.show({
      speaker: "Система",
      lines: [
        "Васька заходит в туалет.",
        "Умывается холодной водой, приводит себя в порядок.",
        "Через пару минут он выходит посвежевшим.",
      ],
      onComplete: () => {
        playerSprite.setVisible(true);
        if (playerSprite.body) {
          playerSprite.body.enable = true;
        }

        applyToiletEffects();
        afterToilet();
      },
    });
  }

  function handleDoor(d) {
    const doorId = d?.doorId ?? d?.id ?? d?.name ?? null;

    // ===== ТУАЛЕТ =====
    if (doorId === "toiletDoor") {
      useToilet();
      return;
    }

    // ===== ДВЕРЬ СВЕТЫ =====
    if (doorId === "svetaDoor") {
      const goal = state?.getValue("currentGoal");

      if (goal !== "sveta") {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Сейчас не до этого."],
        });
        return;
      }
    }

    // ===== ОБЯЗАТЕЛЬНЫЙ РАЗГОВОР С СЕМЁНОМ =====
    if (!state?.hasFlag("met_Semyon")) {
      dialogueManager.startScene("needTalkToSemyonBeforeExit");
      return;
    }

    // ===== ПРОВЕРКА КЛЮЧА =====
    if (d.locked && !inventory.has(d.keyId)) {
      dialogueUI.show({
        speaker: "Система",
        lines: ["Заперто.", `Нужен ключ: ${d.keyId}`],
      });
      return;
    }

    // ===== ПРОСТО ДВЕРЬ =====
    if (!d.targetMap) {
      dialogueUI.show({
        speaker: "Система",
        lines: ["Эта дверь сейчас не используется."],
      });
      return;
    }

    // выход из коридора общаги
    if (doorId === "exitDormDoor") {
      const studied = state.hasFlag("studied_exam");
      const visitedSveta = state.hasFlag("visited_sveta");

      if (!studied && !visitedSveta) {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Надо сначала либо подготовиться, либо зайти к Свете."],
        });
        return;
      }
    }

    levelManager.load(d.targetMap, d.targetSpawn);
  }

  function handleInteract() {
    if (!Phaser.Input.Keyboard.JustDown(keyE)) return;

    if (dialogueUI.isOpen()) return;

    // 1) предмет
    if (currentItem) {
      const id = currentItem.itemData?.itemId;
      if (!id) return;

      // ===== УЧЁБА =====
      if (id === "studyDesk") {
        const goal = state?.getValue("currentGoal");

        if (goal !== "study") {
          dialogueUI.show({
            speaker: "Васька",
            lines: ["Сейчас не до учёбы."],
          });
          return;
        }

        dialogueManager.startScene("studySession");

        state.setFlag("studied_exam");
        state.incCounter("anxiety", -1);

        return;
      }

      // ===== ОБЫЧНЫЙ ПРЕДМЕТ =====
      inventory.add(id);

      currentItem.destroy();
      currentItem = null;

      dialogueUI.show({
        speaker: "Система",
        lines: [`Получен предмет: ${id}`],
      });

      return;
    }

    // 2) дверь
    if (currentDoor) {
      const d = currentDoor.doorData;
      // ограничение двери Светы
      if (d.doorId === "svetaDoor") {
        const goal = state?.getValue("currentGoal");

        if (goal !== "sveta") {
          dialogueUI.show({
            speaker: "Васька",
            lines: ["Сейчас не до этого."],
          });
          return;
        }
      }
      handleDoor(d);
      return;
    }

    // 3) NPC
    if (currentNpc) {
      const npcId = currentNpc.npcData?.npcId;

      if (!npcId) {
        dialogueUI.show({
          speaker: "Система",
          lines: ["У NPC не задан npcId."],
        });
        return;
      }

      dialogueManager.startNpc(npcId);
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
