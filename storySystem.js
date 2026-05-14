/*
  storySystem.js

  Сценарная система.
*/

export function createStorySystem(scene, { state, dialogueManager } = {}) {
  function playIntroOnce(dialogueManagerArg) {
    const dm = dialogueManagerArg ?? dialogueManager;

    if (state?.hasFlag("intro_played")) return;

    if (!state?.getValue("teacherMood", null)) {
      const moods = ["good", "neutral", "bad"];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      state?.setValue("teacherMood", mood);
    }

    state?.setFlag("intro_played");
    dm?.startScene("intro");
  }

  function normalizeEffects(effects = []) {
    if (!effects) return [];

    if (Array.isArray(effects)) return effects;

    // Старый формат из части диалогов: { anxiety: -1, social: +1 }
    if (typeof effects === "object") {
      return Object.entries(effects).map(([id, delta]) => ({
        type: "incCounter",
        id,
        delta,
      }));
    }

    return [];
  }

  function applyEffects(effects = []) {
    const normalizedEffects = normalizeEffects(effects);

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
    const C = state?.getCounter("confidence") ?? 0;
    const SR = state?.getCounter("sveta_relation") ?? 0;
    const teacherMood = state?.getValue("teacherMood", "neutral") ?? "neutral";
    const teacherMoodBonus =
      teacherMood === "good" ? 1 : teacherMood === "bad" ? -1 : 0;

    const heardSveta = state?.hasFlag("heard_sveta_no_sitting_advice") ?? false;
    const trustedSveta = state?.hasFlag("skipped_window_because_sveta") ?? false;
    const ignoredSveta = state?.hasFlag("sat_window_after_sveta_advice") ?? false;
    const playedComputer = state?.hasFlag("played_computer_game") ?? false;
    const studied = state?.hasFlag("studied_exam") ?? false;

    const svetaBonus = heardSveta ? Math.min(1, Math.max(0, SR)) : 0;
    const socialBonus = Math.floor(Math.max(0, S) / 2);
    const effectivePrep = P + socialBonus + Math.max(0, L) + Math.floor(Math.max(0, C) / 2) + svetaBonus;
    const pressure = A + F;

    let score =
      effectivePrep * 2 -
      A -
      Math.floor(F / 2) +
      Math.floor(Math.max(0, S) / 2) +
      teacherMoodBonus;

    if (trustedSveta) score += 1;
    if (ignoredSveta) score -= 1;
    if (playedComputer) score -= 1;
    if (!studied) score -= 1;

    let grade = 3;
    let endingScene = "endingNormal";
    let endingTone = "normal";

    if (effectivePrep <= 0 && pressure >= 5) {
      grade = 1;
      endingScene = "endingDisaster";
      endingTone = "disaster";
    } else if (score >= 6 && effectivePrep >= 3 && A <= 2) {
      grade = 5;
      endingScene = "endingPerfect";
      endingTone = "excellent";
    } else if (score >= 2 && effectivePrep >= 2) {
      grade = 4;
      endingScene = "endingGood";
      endingTone = "good";
    } else if (score >= -2 && effectivePrep >= 1) {
      grade = 3;
      endingScene = "endingNormal";
      endingTone = "pass";
    } else if (score >= -5) {
      grade = 2;
      endingScene = "endingEdge";
      endingTone = "fail";
    } else {
      grade = 1;
      endingScene = "endingDisaster";
      endingTone = "disaster";
    }

    const result = {
      preparation: P,
      anxiety: A,
      fatigue: F,
      social: S,
      luck: L,
      confidence: C,
      svetaRelation: SR,
      effectivePrep,
      pressure,
      score,
      teacherMood,
      teacherMoodBonus,
      grade,
      endingScene,
      endingTone,
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
