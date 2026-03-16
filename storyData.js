/*
  storyData.js
  Сценарные сцены и NPC-диалоги
*/

export const STORY_SCENES = {
  /* ===== УТРО В КОМНАТЕ ===== */

  intro: {
    speaker: "Васька",
    lines: [
      "Блин... и ночь была паршивая.",
      "Сегодня экзамен.",
      "Надо встать и собраться.",
    ],
  },

  SemyonExamTalk: {
    speaker: "Семён",
    lines: [
      "О, братан, проснулся! Экзамен сегодня в 16:00, забыл?",
      "Я вчера со Светой разговаривал.",
      "Она говорила, что если что, можно к ней зайти.",
      "Она там по картам раскладывает, судьбу предсказывает.",
      "Может, сходишь? А то вид у тебя — как будто уже не сдал.",
    ],

    onComplete: (state) => {
      state?.setFlag("met_Semyon");
    },

    choices: [
      {
        text: "Сразу пойти к Свете",
        nextScene: "goToSveta",
        effects: [
          { type: "setValue", id: "currentGoal", value: "sveta" },
          { type: "setFlag", id: "choice_set" },
        ],
      },
      {
        text: "Сначала умыться",
        nextScene: "washFirst",
        effects: [
          { type: "setValue", id: "currentGoal", value: "toilet" },
          { type: "setFlag", id: "choice_set" },
        ],
      },
      {
        text: "Готовиться самому",
        nextScene: "studyYourself",
        effects: [
          { type: "setValue", id: "currentGoal", value: "study" },
          { type: "setFlag", id: "choice_set" },
        ],
      },
    ],
  },

  needTalkToSemyonBeforeExit: {
    speaker: "Васька",
    lines: ["Сначала надо поговорить с Семёном."],
  },

  /* ===== ТУАЛЕТ ===== */

  washFirst: {
    speaker: "Васька",
    lines: ["Пойду умоюсь сначала."],
  },

  toiletEvent: {
    speaker: "Система",
    lines: [
      "Васька заходит в туалет.",
      "Умывается холодной водой.",
      "Чистит зубы.",
      "Через пару минут выходит посвежевшим.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_toilet");
      state?.incCounter("fatigue", -1);
      state?.incCounter("anxiety", -1);
    },
  },

  afterToiletChoice: {
    speaker: "Васька",
    lines: ["Так, полегчало. Что дальше?"],

    choices: [
      {
        text: "Пойти к Свете",
        nextScene: "goToSvetaAfterToilet",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta" }],
      },
      {
        text: "Вернуться учиться",
        nextScene: "studyAfterToilet",
        effects: [{ type: "setValue", id: "currentGoal", value: "study" }],
      },
    ],
  },

  toiletAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже умывался."],
  },

  /* ===== УЧЁБА ===== */

  studyYourself: {
    speaker: "Васька",
    lines: ["Да ну эту эзотерику. Сам разберусь."],
  },

  studyAfterToilet: {
    speaker: "Васька",
    lines: ["Теперь можно спокойно позаниматься."],
  },

  studySession: {
    speaker: "Васька",
    lines: [
      "Ладно... надо собраться.",
      "Открою конспекты.",
      "Вроде стало понятнее.",
      "Хотя мысль о Свете всё равно не отпускает.",
    ],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.incCounter("fatigue", 1);
      state?.setFlag("studied_exam");
    },
    nextScene: "afterStudyChoice",
  },

  afterStudyChoice: {
    speaker: "Васька",
    lines: ["Так. Я уже хоть немного подготовился. Что дальше?"],
    choices: [
      {
        text: "Идти в универ",
        nextScene: "goToUniversity",
        effects: [{ type: "setValue", id: "currentGoal", value: "university" }],
      },
      {
        text: "Всё-таки зайти к Свете",
        nextScene: "goToSvetaAfterStudy",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta" }],
      },
    ],
  },

  goToUniversity: {
    speaker: "Васька",
    lines: ["Пора выдвигаться в универ."],
  },

  goToSvetaAfterStudy: {
    speaker: "Васька",
    lines: ["Может, всё-таки зайти к Свете перед выходом..."],
  },

  /* ===== СВЕТА ===== */

  goToSveta: {
    speaker: "Васька",
    lines: ["Ладно, схожу. Чё терять-то?"],
  },

  goToSvetaAfterToilet: {
    speaker: "Васька",
    lines: ["Ладно, теперь можно и к Свете зайти."],
  },

  svetaFortuneTalk: {
    speaker: "Света",
    lines: [
      "Заходи, Васька.",
      "Я знала, что ты придёшь.",
      "Экзамен ты сдашь.",
      "Но всё зависит от твоих решений.",
    ],
    choices: [
      {
        text: "Остаться на чай",
        nextScene: "svetaTea",
      },
      {
        text: "Пойти к Семёну",
        nextScene: "goBackToSemyon",
      },
      {
        text: "Пойти учиться",
        nextScene: "studyAfterSveta",
      },
    ],
  },

  svetaTea: {
    speaker: "Света",
    lines: ["Садись, чай попьём.", "Иногда лучше разгрузить голову."],
    onComplete: (state) => {
      state?.incCounter("anxiety", -2);
      state?.incCounter("fatigue", -1);
      state?.setFlag("visited_sveta");
    },
    nextScene: "goToUniversity",
  },

  studyAfterSveta: {
    speaker: "Васька",
    lines: ["Пойду я. Сам ещё конспекты посмотрю."],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("anxiety", 1);
      state?.setValue("currentGoal", "study");
    },
  },

  /* ===== СЕМЁН ПОСЛЕ СВЕТЫ ===== */

  goBackToSemyon: {
    speaker: "Васька",
    lines: ["Пойду обратно к Семёну."],

    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("anxiety", -1);
      state?.setValue("currentGoal", "semyon_after_sveta");
    },
  },

  SemyonAfterSveta: {
    speaker: "Семён",
    lines: ["О, вернулся!", "Ну чё, нагадала тебе Светка?"],

    onComplete: (state) => {
      state?.setFlag("talkedAfterSveta");
    },

    choices: [
      {
        text: "Поболтать о ерунде",
        nextScene: "SemyonFunTalk",
      },
      {
        text: "Поговорить об учёбе",
        nextScene: "SemyonStudyTalk",
      },
    ],
  },

  SemyonFunTalk: {
    speaker: "Семён",
    lines: ["Ладно, забей.", "Иногда надо просто выдохнуть."],
    onComplete: (state) => {
      state?.incCounter("social", 1);
    },
    nextScene: "goToUniversity",
  },

  SemyonStudyTalk: {
    speaker: "Семён",
    lines: [
      "Главное — не паниковать.",
      "Если билет нормальный попадётся — сдашь.",
    ],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.incCounter("social", 1);
    },
    nextScene: "goToUniversity",
  },

  /* ===== ПОДОКОННИК ===== */

  windowRestEvent: {
    speaker: "Васька",
    lines: [
      "Хм... можно немного посидеть.",
      "Тихо тут.",
      "Вроде даже полегчало.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_window");
      state?.incCounter("anxiety", -1);
    },
  },

  windowAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже сидел тут.", "Пора идти дальше."],
  },

  wrongDoor: {
    speaker: "Васька",
    lines: [
      "Блин. Не туда свернул.",
      "Спросонья только лишний раз дёрнулся.",
    ],
    onComplete: (state) => {
      state?.incCounter("anxiety", 1);
    },
  },

  /* ===== ПРОФЕССОР ===== */

  professorTalk: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Так, студенты.",
      "Экзамен начнётся через 10 минут.",
      "Кто опоздает — не пущу.",
      "А ты, молодой человек, чего такой бледный? Экзамена боишься?",
    ],
    choices: [
      {
        text: "Честно признаться",
        nextScene: "professorHonest",
      },
      {
        text: "Сказать что всё нормально",
        nextScene: "professorLie",
      },
      {
        text: "Попросить совет",
        nextScene: "professorAdvice",
      },
    ],
  },

  professorHonest: {
    speaker: "Васька",
    lines: ["Да, профессор... нервничаю."],
    onComplete: (state) => {
      state?.incCounter("anxiety", -1);
    },
    nextScene: "examStart",
  },

  professorLie: {
    speaker: "Васька",
    lines: ["Да не, всё нормально."],
    onComplete: (state) => {
      state?.incCounter("anxiety", 1);
    },
    nextScene: "examStart",
  },

  professorAdvice: {
    speaker: "Александр Евгеньевич",
    lines: ["Отвечай по существу.", "Если не знаешь — не выдумывай."],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.incCounter("anxiety", -1);
    },
    nextScene: "examStart",
  },

  /* ===== ЭКЗАМЕН ===== */

  examStart: {
    speaker: "Профессор",
    lines: ["Фамилия?", "Петров.", "Садись. Тяни билет."],
    onComplete: (_state, _inventory, story) => {
      story?.startExamResult();
    },
  },

  /* ===== КОНЦОВКИ ===== */

  endingPerfect: {
    speaker: "Профессор",
    lines: ["Отлично, Петров.", "Редко такое вижу.", "Пятёрка."],
  },

  endingGood: {
    speaker: "Профессор",
    lines: ["Неплохо.", "Четвёрка.", "Можешь идти."],
  },

  endingNormal: {
    speaker: "Профессор",
    lines: ["На троечку.", "Но видно, что старался."],
  },

  endingEdge: {
    speaker: "Профессор",
    lines: ["Петров...", "Ладно, тройка.", "Идите."],
  },

  endingFail: {
    speaker: "Профессор",
    lines: ["Пересдача.", "Следующий."],
  },
};

/* ===== NPC DIALOGUES ===== */

export const NPC_DIALOGUES = {
  Semyon: {
    firstMeeting: {
      useScene: "SemyonExamTalk",
    },

    repeat: {
      speaker: "Семён",
      lines: ["Ну что, решил уже?"],
    },
  },

  Sveta: {
    firstMeeting: {
      useScene: "svetaFortuneTalk",
    },

    repeat: {
      speaker: "Света",
      lines: ["Я уже всё сказала.", "Теперь всё зависит от тебя."],
    },
  },

  Professor: {
    firstMeeting: {
      useScene: "professorTalk",
    },
  },

  Professor_audience: {
    firstMeeting: {
      useScene: "examStart",
    },
  },
};
