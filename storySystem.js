// storySystem.js отвечает только за “сценарные” реплики и триггеры.

import { dialogueUI } from "./dialogueUI.js";

export function createStorySystem(scene) {
  let started = false;

  function playIntroOnce() {
    if (started) return;
    started = true;

    dialogueUI.show({
      speaker: "ГГ",
      lines: ["Чёрт, опять идти на пару…", "…", "Ладно. Встаю."],
    });
  }

  return {
    playIntroOnce,
  };
}
