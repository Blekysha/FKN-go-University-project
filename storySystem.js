// storySystem.js
export function createStorySystem(scene, deps = {}) {
  const { dialogueManager } = deps;

  let introPlayed = false;

  function playIntroOnce() {
    if (introPlayed) return;
    introPlayed = true;

    if (!dialogueManager) {
      console.warn("[storySystem] dialogueManager не передан");
      return;
    }

    dialogueManager.startScene("intro");
  }

  return { playIntroOnce };
}
