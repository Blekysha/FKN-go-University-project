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
    let normalizedEffects = effects;

    if (effects && !Array.isArray(effects) && typeof effects === "object") {
      normalizedEffects = Object.entries(effects).map(([id, delta]) => ({
        type: "incCounter",
        id,
        delta,
      }));
    }

    if (!Array.isArray(normalizedEffects)) return;

    for (const effect of normalizedEffects) {
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
    const L = state?.getCounter("luck") ?? 0;

    const effectivePrep = P + Math.floor(S / 2) + Math.floor(L / 2);
    const score = effectivePrep * 2 + S - A - F;

    let grade = 3;
    let endingScene = "endingNormal";

    if (score >= 6 && effectivePrep >= 3 && A <= 2) {
      grade = 5;
      endingScene = "endingPerfect";
    } else if (score >= 3 && effectivePrep >= 2) {
      grade = 4;
      endingScene = "endingGood";
    } else if (score >= -1 && effectivePrep >= 1) {
      grade = 3;
      endingScene = "endingNormal";
    } else if (score <= -7 && effectivePrep <= 0) {
      grade = 1;
      endingScene = "endingDisaster";
    } else {
      grade = 2;
      endingScene = "endingFail";
    }

    const result = {
      preparation: P,
      anxiety: A,
      fatigue: F,
      social: S,
      luck: L,
      effectivePrep,
      score,
      grade,
      endingScene,
    };

    state?.setValue("lastExamStats", result);
    state?.setValue("lastExamEnding", endingScene);
    state?.setValue("lastExamGrade", grade);

    return result;
  }

  return {
    playIntroOnce,
    applyEffects,
    getExamOutcome,
  };
}
