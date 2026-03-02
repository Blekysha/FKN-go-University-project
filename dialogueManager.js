// dialogueManager.js
import { dialogueUI } from "./dialogueUI.js";

export function createDialogueManager(scene, { inventory, state }) {
  function startNpc(npcId) {
    if (dialogueUI.isOpen()) return;

    switch (npcId) {
      case "roommate": {
        const met = state.hasFlag("met_roommate");
        const talkCount = state.getCounter("roommate_talks");

        if (!met) {
          state.setFlag("met_roommate");
          state.incCounter("roommate_talks");
          dialogueUI.show({
            speaker: "Сосед",
            lines: [
              "О, ты проснулась.",
              "Если пойдёшь сейчас — ещё успеешь на пару.",
            ],
          });
          return;
        }

        // пример ветвления по предмету
        if (inventory.has("key")) {
          state.incCounter("roommate_talks");
          dialogueUI.show({
            speaker: "Сосед",
            lines: ["Ключ нашла? Отлично.", "Тогда вперёд."],
          });
          return;
        }

        // пример прогрессии по количеству разговоров
        state.incCounter("roommate_talks");
        dialogueUI.show({
          speaker: "Сосед",
          lines:
            talkCount < 2
              ? ["Собирайся быстрее. Время идёт."]
              : ["Ну что, идём или опять думаешь?"],
        });
        return;
      }

      default:
        dialogueUI.show({
          speaker: "Система",
          lines: [`NPC "${npcId}" не настроен.`],
        });
    }
  }

  function startScene(sceneId) {
    if (dialogueUI.isOpen()) return;

    switch (sceneId) {
      case "intro": {
        if (state.hasFlag("intro_played")) return;
        state.setFlag("intro_played");

        dialogueUI.show({
          speaker: "ГГ",
          lines: ["Чёрт, опять идти на пару…", "…", "Ладно. Встаю."],
        });
        return;
      }

      default:
        dialogueUI.show({
          speaker: "Система",
          lines: [`Сцена "${sceneId}" не настроена.`],
        });
    }
  }

  return { startNpc, startScene };
}
