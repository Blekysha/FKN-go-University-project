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

  function getExamOutcome() {
    const P = state?.getCounter("preparation") ?? 0;
    const A = state?.getCounter("anxiety") ?? 0;
    const F = state?.getCounter("fatigue") ?? 0;
    const S = state?.getCounter("social") ?? 0;

    const effectivePrep = P + Math.floor(S / 2);

    let endingScene = "endingNormal";

    if (effectivePrep >= 3 && A <= 0 && F <= 2) {
      endingScene = "endingPerfect";
    } else if (effectivePrep >= 2 && A <= 1 && F <= 3) {
      endingScene = "endingGood";
    } else if (effectivePrep >= 1 && A <= 3 && F <= 4) {
      endingScene = "endingNormal";
    } else if (effectivePrep >= 1 && A <= 5) {
      endingScene = "endingEdge";
    } else {
      endingScene = "endingFail";
    }

    const result = {
      preparation: P,
      anxiety: A,
      fatigue: F,
      social: S,
      effectivePrep,
      endingScene,
    };

    state?.setValue("lastExamStats", result);
    state?.setValue("lastExamEnding", endingScene);

    return result;
  }

  return {
    playIntroOnce,
    applyEffects,
    getExamOutcome,
  };
}
