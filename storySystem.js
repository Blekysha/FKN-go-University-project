/*
  storySystem.js

  Сценарная система.

  Отвечает за:
  - запуск сцен в нужный момент
  - защиту от повторного запуска одноразовых сцен

  НЕ отвечает за:
  - хранение текстов
  - показ UI
  - overlap / input
*/

export function createStorySystem(scene, { dialogueManager, state } = {}) {
  function playIntroOnce() {
    if (state?.hasFlag("intro_played")) return;

    state?.setFlag("intro_played");
    dialogueManager?.startScene("intro");
  }

  return {
    playIntroOnce,
  };
}
