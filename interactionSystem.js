import { dialogueUI } from "./dialogueUI.js";

export function createInteractionSystem(
  scene,
  {
    playerSprite,
    keyE,
    hint,
    inventory,
    levelManager,
    dialogueManager,
    state,
    story,
  }
) {
  let currentItem = null;
  let currentDoor = null;
  let currentNpc = null;
  let blackScreenActive = false;

  function showBlackScreen(text, { onComplete = null } = {}) {
    const root = document.getElementById("blackScreen");
    const textEl = document.getElementById("blackScreenText");

    if (!root || !textEl) {
      console.warn("[interactionSystem] Не найден #blackScreen или #blackScreenText.");
      onComplete?.();
      return;
    }

    blackScreenActive = true;
    playerSprite.setVelocity(0);
    playerSprite.setVisible(false);
    if (playerSprite.body) {
      playerSprite.body.enable = false;
    }

    textEl.textContent = text;
    root.style.display = "flex";
    root.setAttribute("aria-hidden", "false");

    const close = () => {
      window.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("click", close);

      root.style.display = "none";
      root.setAttribute("aria-hidden", "true");
      textEl.textContent = "";

      playerSprite.setVisible(true);
      if (playerSprite.body) {
        playerSprite.body.enable = true;
      }

      blackScreenActive = false;
      onComplete?.();
    };

    const onKeyDown = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    root.addEventListener("click", close);
  }

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
      return;
    }

    if (currentDoor) {
      hint.showAt(
        currentDoor.x,
        currentDoor.y - currentDoor.height / 2 - 6,
        "E"
      );
      return;
    }

    if (currentNpc) {
      hint.showAt(currentNpc.x, currentNpc.y - currentNpc.height / 2 - 6, "E");
      return;
    }

    hint.hide();
  }

  function openSceneWithPlayerHidden(sceneId, { afterComplete = null } = {}) {
    if (dialogueUI.isOpen()) return;

    playerSprite.setVisible(false);
    if (playerSprite.body) {
      playerSprite.body.enable = false;
    }

    dialogueManager.startScene(sceneId, {
      onComplete: () => {
        playerSprite.setVisible(true);
        if (playerSprite.body) {
          playerSprite.body.enable = true;
        }

        afterComplete?.();
      },
    });
  }

  /* ===== ТУАЛЕТ ===== */

  function useToilet() {
    if (state.hasFlag("visited_toilet")) {
      dialogueManager.startScene("toiletAlreadyUsed");
      return;
    }

    openSceneWithPlayerHidden("toiletEvent", {
      afterComplete: () => {
        const goal = state.getValue("currentGoal");
        if (goal === "toilet") {
          dialogueManager.startScene("afterToiletChoice");
        }
      },
    });
  }

  /* ===== ДВЕРИ ===== */

  function handleDoor(d) {
    const doorId = d?.doorId ?? null;

    if (doorId === "toiletDoor") {
      useToilet();
      return;
    }

     // ===== НОВАЯ ПРОВЕРКА: поговорил ли с Семёном =====
    if (!state.hasFlag("talked_to_semyon")) {
      dialogueUI.show({
      speaker: "Подсказка",
      lines: [" Сначала поговори с Семёном!", "Он сидит в комнате. Нажми на него."],
    });
    return;
  }

    // ===== ПРОВЕРКА 2: нашёл ли ключ =====
    if (!state.hasFlag("has_key")) {
      dialogueUI.show({
      speaker: "Подсказка",
      lines: ["🔑 Найди ключ, чтобы выйти из комнаты!"],
    });
    return;
  }
 

    if (!state.hasFlag("met_Semyon")) {
      dialogueManager.startScene("needTalkToSemyonBeforeExit");
      return;
    }

    if (doorId === "svetaDoor") {
      const alreadyVisitedSveta = state.hasFlag("visited_sveta");
      const goal = state.getValue("currentGoal");

      if (!alreadyVisitedSveta && goal !== "sveta") {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Сейчас лучше заняться другим."],
        });
        return;
      }
    }

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

    if (doorId === "audienceDoor") {
      if (!state.hasFlag("talked_professor_corridor")) {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Сначала надо поговорить с преподавателем."],
        });
        return;
      }

      dialogueManager.startScene("audienceTimeSkip", {
        onComplete: () => {
          state.setFlag("entered_audience");
          state.setValue("currentGoal", "exam");
          levelManager.load(d.targetMap, d.targetSpawn);
        },
      });

      return;
    }

    if (["wrongDoor", "stairsDoor", "leftDormDoor"].includes(doorId)) {
      dialogueManager.startScene("wrongDoor");
      return;
    }

    if (d.locked && !inventory.has(d.keyId)) {
      dialogueUI.show({
        speaker: "Система",
        lines: ["Заперто.", `Нужен ключ: ${d.keyId}`],
      });
      return;
    }

    levelManager.load(d.targetMap, d.targetSpawn);
  }

  /* ===== ПРЕДМЕТЫ ===== */

  function handleItem(item) {
    const id = item.itemData?.itemId;

    if (!id) return;

    if (id === "studyDesk") {
      if (state.hasFlag("studied_exam")) {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Я уже позанимался."],
        });
        return;
      }

      const goal = state.getValue("currentGoal");
      if (goal !== "study") {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Сейчас мне нужно заняться другим."],
        });
        return;
      }

      dialogueManager.startScene("studySession");
      return;
    }

    if (id === "windowRest") {
      if (state.hasFlag("visited_window")) {
        dialogueManager.startScene("windowAlreadyUsed");
        return;
      }

      dialogueManager.startScene("windowRestEvent");
      return;
    }

    if (id === "examDesk") {
      if (!state.hasFlag("got_exam_ticket")) {
        dialogueManager.startScene("needTakeTicketFirst");
        return;
      }

      if (state.hasFlag("exam_prepared_answer")) {
        dialogueManager.startScene("examDeskAlreadyUsed");
        return;
      }

      showBlackScreen(
        "Васька садится за парту.\nПеред ним билет, черновик и несколько минут на подготовку.\nМысли путаются, но постепенно ответ складывается в голове.",
        {
          onComplete: () => {
            state.setFlag("exam_prepared_answer");
            dialogueManager.startScene("examAnswerPrepared");
          },
        }
      );
      return;
    }

    inventory.add(id);

    item.destroy();
    currentItem = null;

    dialogueUI.show({
      speaker: "Система",
      lines: [`Получен предмет: ${id}`],
    });
  }

  // НПС
  function handleNpc(npcId) {
    if (npcId === "ProfessorEntrance") {
      dialogueManager.startNpc(npcId);
      return;
    }

    if (npcId === "crowd_students") {
      dialogueManager.startNpc(npcId);
      return;
    }

    if (npcId === "Professor_audience") {
      if (state.hasFlag("exam_finished")) {
        dialogueManager.startScene("examAlreadyFinished");
        return;
      }

      if (!state.hasFlag("got_exam_ticket")) {
        dialogueManager.startScene("examTakeTicket");
        return;
      }

      if (!state.hasFlag("exam_prepared_answer")) {
        dialogueManager.startScene("needSitAtExamDesk");
        return;
      }

      dialogueManager.startScene("examDefenseStart", {
        onComplete: () => {
          const result = story?.getExamOutcome?.() ?? null;
          if (!result) return;

          state.setFlag("exam_finished");

          dialogueManager.startScene(result.endingScene, {
            onComplete: () => {
              showBlackScreen(
                "Экзамен закончен.\nВаська выходит из аудитории и наконец выдыхает.\nДальше здесь появятся финальные выводы по пройденному пути.",
                {
                  onComplete: () => dialogueManager.startScene("finalExamSummary"),
                }
              );
            },
          });
        },
      });
      return;
    }

    dialogueManager.startNpc(npcId);
  }

  /* ===== НАЖАТИЕ E ===== */

  function handleInteract() {
    if (!Phaser.Input.Keyboard.JustDown(keyE)) return;

    if (dialogueUI.isOpen()) return;

    if (currentItem) {
      handleItem(currentItem);
      return;
    }

    if (currentDoor) {
      handleDoor(currentDoor.doorData);
      return;
    }

    if (currentNpc) {
      const npcId = currentNpc.npcData?.npcId;

      if (!npcId) {
        dialogueUI.show({
          speaker: "Система",
          lines: ["У NPC не задан npcId."],
        });
        return;
      }

      handleNpc(npcId);
    }
  }

  function update() {
    if (blackScreenActive) {
      hint.hide();
      return;
    }

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
