// storySystem.js
export function createStorySystem(scene, { dialogueManager }) {
  function playIntroOnce() {
    dialogueManager.startScene("intro");
  }

  return { playIntroOnce };
}
