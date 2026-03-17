/*
  dialogueManager.js
*/

import { dialogueUI } from "./dialogueUI.js";
import { STORY_SCENES, NPC_DIALOGUES } from "./storyData.js";

export function createDialogueManager(scene, { inventory, state, story } = {}) {
  function startScene(sceneId, options = {}) {
    if (dialogueUI.isOpen()) return;

    let sceneData = STORY_SCENES[sceneId];
    if (!sceneData) {
      console.warn(`[dialogueManager] Сцена '${sceneId}' не найдена.`);
      return;
    }

    if (sceneId === "debugExamStats") {
      const stats = state?.getValue("lastExamStats") ?? {};
      sceneData = {
        ...sceneData,
        lines: [
          `Preparation: ${stats.preparation ?? 0}`,
          `Anxiety: ${stats.anxiety ?? 0}`,
          `Fatigue: ${stats.fatigue ?? 0}`,
          `Social: ${stats.social ?? 0}`,
          `EffectivePrep: ${stats.effectivePrep ?? 0}`,
          `Ending: ${stats.endingScene ?? "unknown"}`,
        ],
      };
    }

    const extraOnComplete = options.onComplete;

    dialogueUI.onChoice = (choice) => {
      story?.applyEffects(choice.effects);

      if (typeof choice.nextScene === "string") {
        startScene(choice.nextScene);
      }
    };

    dialogueUI.show({
      ...sceneData,
      onComplete: () => {
        sceneData.onComplete?.(state, inventory, story);
        extraOnComplete?.(state, inventory, story);

        if (typeof sceneData.nextScene === "string") {
          startScene(sceneData.nextScene);
        }
      },
    });
  }

  function startNpc(npcId) {
    if (dialogueUI.isOpen()) return;

    const npcData = NPC_DIALOGUES[npcId];
    if (!npcData) {
      console.warn(`[dialogueManager] NPC '${npcId}' не найден.`);
      return;
    }

    if (
      npcId === "Semyon" &&
      state?.getValue("currentGoal") === "semyon_after_sveta" &&
      !(state?.hasFlag("talkedAfterSveta") ?? false)
    ) {
      state?.setValue("currentGoal", null);
      startScene("SemyonAfterSveta");
      return;
    }

    if (npcId === "Sveta" && (state?.hasFlag("visited_sveta") ?? false)) {
      dialogueUI.onChoice = null;
      dialogueUI.show({
        speaker: "Света",
        lines: ["Я уже всё сказала.", "Теперь всё зависит от тебя."],
      });
      return;
    }

    if (npcId === "Professor") {
      if (state?.hasFlag("talked_professor_corridor")) {
        dialogueUI.onChoice = null;
        dialogueUI.show({
          speaker: "Александр Евгеньевич",
          lines: ["Чего стоите? Заходите в аудиторию."],
        });
        return;
      }
    }

    if (npcId === "Professor_audience") {
      if (!(state?.hasFlag("entered_audience") ?? false)) {
        return;
      }

      if (state?.hasFlag("exam_finished")) {
        dialogueUI.onChoice = null;
        dialogueUI.show({
          speaker: "Александр Евгеньевич",
          lines: ["Следующий студент."],
        });
        return;
      }
    }

    const talkCounterId = `${npcId}_talk_count`;
    const metFlagId = `met_${npcId}`;
    const hasMet = state?.hasFlag(metFlagId) ?? false;

    let dialogue = null;

    if (!hasMet && npcData.firstMeeting) {
      state?.setFlag(metFlagId);
      state?.incCounter(talkCounterId);

      if (npcData.firstMeeting.useScene) {
        startScene(npcData.firstMeeting.useScene);
        return;
      }

      dialogue = npcData.firstMeeting;
    } else if (npcData.repeat) {
      state?.incCounter(talkCounterId);

      if (npcData.repeat.useScene) {
        startScene(npcData.repeat.useScene);
        return;
      }

      dialogue = npcData.repeat;
    } else {
      dialogue = {
        speaker: "Система",
        lines: [`У NPC '${npcId}' не настроен диалог.`],
      };
    }

    dialogueUI.onChoice = null;
    dialogueUI.show(dialogue);
  }

  return {
    startScene,
    startNpc,
  };
}
