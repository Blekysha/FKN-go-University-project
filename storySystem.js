/*
  storySystem.js

  Сценарная система.
*/

export function createStorySystem(scene, { state, dialogueManager } = {}) {
  function playIntroOnce(dialogueManagerArg) {
    const dm = dialogueManagerArg ?? dialogueManager;

    if (state?.hasFlag("intro_played")) return;

    state?.setFlag("intro_played");
    dm?.startScene("intro");
  }

  function applyEffects(effects = []) {
    if (!Array.isArray(effects)) return;

    for (const effect of effects) {
      if (!effect || !effect.type) continue;

      switch (effect.type) {
        case "setFlag":
          state?.setFlag(effect.id);
          break;

        case "removeFlag":
          state?.removeFlag(effect.id);
          break;

        case "setValue":
          state?.setValue(effect.id, effect.value);
          break;

        case "removeValue":
          state?.removeValue(effect.id);
          break;

        case "incCounter":
          state?.incCounter(effect.id, effect.delta ?? 1);
          break;

        case "setCounter":
          state?.setCounter(effect.id, effect.value ?? 0);
          break;

        default:
          console.warn(`[storySystem] Неизвестный effect.type: ${effect.type}`);
      }
    }
  }

  function calculateExamEnding() {
    const P = state?.getCounter("preparation") ?? 0;
    const A = state?.getCounter("anxiety") ?? 0;
    const F = state?.getCounter("fatigue") ?? 0;
    const S = state?.getCounter("social") ?? 0;

    // Соцсвязи дают мягкий бонус.
    const prep = P + Math.floor(S / 2);

    if (prep >= 7 && A <= 4) return "endingPerfect";
    if (prep >= 7 && A <= 5) return "endingGood";
    if (prep >= 4 && prep <= 6 && A <= 5) return "endingNormal";
    if (prep >= 4 && prep <= 6 && A >= 6) return "endingEdge";
    if (prep <= 3 || F >= 7) return "endingFail";

    return "endingNormal";
  }

  function startExam(dialogueManagerArg) {
    const dm = dialogueManagerArg ?? dialogueManager;
    const endingScene = calculateExamEnding();
    dm?.startScene(endingScene);
  }

  // Вызывается из onComplete сцены examStart
  function startExamResult() {
    const endingScene = calculateExamEnding();
    dialogueManager?.startScene(endingScene);
  }

  return {
    playIntroOnce,
    applyEffects,
    calculateExamEnding,
    startExam,
    startExamResult,
  };
}
