/*
  dialogueManager.js
*/

import { dialogueUI } from "./dialogueUI.js";
import { STORY_SCENES, NPC_DIALOGUES } from "./storyData.js";

export function createDialogueManager(scene, { inventory, state } = {}) {
  function startScene(sceneId) {
    if (dialogueUI.isOpen()) return;

    const sceneData = STORY_SCENES[sceneId];
    if (!sceneData) {
      console.warn(`[dialogueManager] Сцена '${sceneId}' не найдена.`);
      return;
    }

    dialogueUI.onChoice = (choice) => {
      if (choice.nextScene === "goToSveta") {
        state?.setFlag("choice_sveta");
        state?.setValue("currentGoal", "sveta");
        state?.setFlag("choice_set");
      }

      if (choice.nextScene === "washFirst") {
        state?.setFlag("choice_toilet");
        state?.setValue("currentGoal", "toilet");
        state?.setFlag("choice_set");
      }

      if (choice.nextScene === "studyYourself") {
        state?.setFlag("choice_study");
        state?.setValue("currentGoal", "study");
        state?.setFlag("choice_set");
      }

      if (choice.nextScene === "goToSvetaAfterToilet") {
        state?.setValue("currentGoal", "sveta");
      }

      if (choice.nextScene === "studyAfterToilet") {
        state?.setValue("currentGoal", "study");
      }

      if (choice.nextScene) {
        startScene(choice.nextScene);
      }
    };

    dialogueUI.show(sceneData);
  }

  function startNpc(npcId) {
    if (dialogueUI.isOpen()) return;

    const npcData = NPC_DIALOGUES[npcId];
    if (!npcData) {
      console.warn(`[dialogueManager] NPC '${npcId}' не найден.`);
      return;
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
    } else if (inventory?.has("key") && npcData.afterKey) {
      state?.incCounter(talkCounterId);

      if (npcData.afterKey.useScene) {
        startScene(npcData.afterKey.useScene);
        return;
      }

      dialogue = npcData.afterKey;
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
