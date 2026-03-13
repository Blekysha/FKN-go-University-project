/*
  storyData.js

  Данные сюжета и диалогов.
*/

export const STORY_SCENES = {
  intro: {
    speaker: "Васька",
    lines: [
      "Блин... и ночь была паршивая.",
      "Сегодня экзамен.",
      "Надо встать и собраться.",
    ],
  },

  semyonExamTalk: {
    speaker: "Семён",
    lines: [
      "О, братан, проснулся! Экзамен сегодня в 16:00, забыл?",
      "Я вчера со Светой разговаривал.",
      "Она говорила, что если что, можно к ней зайти.",
      "Она там по картам раскладывает, судьбу предсказывает.",
      "Может, сходишь? А то вид у тебя — как будто уже не сдал.",
    ],
    choices: [
      { text: "Сразу пойти к Свете", nextScene: "goToSveta" },
      { text: "Сначала умыться", nextScene: "washFirst" },
      { text: "Готовиться самому", nextScene: "studyYourself" },
    ],
  },

  goToSveta: {
    speaker: "Васька",
    lines: ["Ладно, схожу. Чё терять-то?", "Где там её комната?"],
  },

  washFirst: {
    speaker: "Васька",
    lines: ["Сначала умоюсь."],
  },

  studyYourself: {
    speaker: "Васька",
    lines: ["Да ну это всё. Сам подготовлюсь."],
  },

  doorNoKey: {
    speaker: "Васька",
    lines: ["Без ключа не выйти."],
  },

  needTalkToSemyonBeforeExit: {
    speaker: "Васька",
    lines: ["Сначала надо поговорить с Семёном."],
  },

  needTalkToSemyon: {
    speaker: "Васька",
    lines: ["Ключ я уже нашёл, но надо поговорить с Семёном."],
  },
};

export const NPC_DIALOGUES = {
  Semyon: {
    firstMeeting: {
      useScene: "semyonExamTalk",
    },

    repeat: {
      speaker: "Семён",
      lines: ["Ну что, решил уже, идёшь к Свете или нет?"],
    },

    afterKey: {
      speaker: "Семён",
      lines: ["Ключ уже у тебя? Тогда не тупи, надо выходить."],
    },
  },

  Sveta: {
    firstMeeting: {
      speaker: "Света",
      lines: ["Привет. Семён сказал, ты можешь зайти ко мне."],
    },

    repeat: {
      speaker: "Света",
      lines: ["Если хочешь, можем ещё поговорить."],
    },
  },
};
