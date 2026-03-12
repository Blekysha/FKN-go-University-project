/*
  storySystem.js
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
