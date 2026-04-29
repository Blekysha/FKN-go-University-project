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

  studyAfterSveta: {
    speaker: "Васька",
    lines: [
      "Ладно, надо хотя бы немного повторить.",
      "Времени уже маловато, но лучше так, чем вообще никак.",
    ],
  },

  studySession: {
    speaker: "Васька",
    lines: [
      "Ладно... надо собраться.",
      "Открою конспекты.",
      "Вроде стало понятнее.",
    ],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.incCounter("fatigue", 1);
      state?.setFlag("studied_exam");
    },
  },

  afterStudyChoice: {
    speaker: "Васька",
    lines: ["Так. Я уже позанимался. Что дальше?"],
    choices: [
      {
        text: "Сразу идти в универ",
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
    lines: ["Ладно. Пора идти в универ."],
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

  goToSvetaAfterStudy: {
    speaker: "Васька",
    lines: ["Ладно, быстро зайду к Свете и потом уже без вариантов в универ."],
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
        effects: [{ type: "setValue", id: "currentGoal", value: "study" }],
      },
    ],
  },

  svetaFortuneTalkAfterStudy: {
    speaker: "Света",
    lines: [
      "Заходи, Васька.",
      "Ты уже занимался, да? Вижу по лицу.",
      "Тогда долго не сиди. Времени до экзамена осталось мало.",
    ],
    choices: [
      {
        text: "Остаться на чай",
        nextScene: "svetaTeaAfterStudy",
      },
      {
        text: "Пойти к Семёну",
        nextScene: "goBackToSemyonAfterStudy",
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
      state?.setValue("currentGoal", "university");
    },
  },

  svetaTeaAfterStudy: {
    speaker: "Света",
    lines: ["По чашке чая — и бегом.", "Не накручивай себя перед экзаменом."],
    onComplete: (state) => {
      state?.incCounter("anxiety", -2);
      state?.incCounter("fatigue", -1);
      state?.setFlag("visited_sveta");
      state?.setValue("currentGoal", "university");
    },
  },

  /* ===== СЕМЁН ПОСЛЕ СВЕТЫ ===== */

  goBackToSemyon: {
    speaker: "Васька",
    lines: ["Пойду обратно к Семёну."],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.setValue("currentGoal", "semyon_after_sveta");
    },
  },

  goBackToSemyonAfterStudy: {
    speaker: "Васька",
    lines: ["Ладно, быстро перекинусь парой слов с Семёном — и в универ."],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.setValue("currentGoal", "semyon_after_sveta");
    },
  },

  SemyonAfterSveta: {
    speaker: "Семён",
    lines: [
      "О, вернулся!",
      "Ну чё, нагадала тебе Светка?",
      "Только давай быстро, а то уже реально времени мало.",
    ],

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
      state?.setValue("currentGoal", "university");
    },
  },

  SemyonStudyTalk: {
    speaker: "Семён",
    lines: [
      "Главное — не паниковать.",
      "Если билет нормальный попадётся — сдашь.",
    ],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.setValue("currentGoal", "university");
    },
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


  /* ===== ФИНАЛ: КОРИДОР УНИВЕРСИТЕТА И ЭКЗАМЕН ===== */

  professorEntranceTalk: {
    speaker: "Преподаватель",
    lines: [
      "Следующий.",
      "Готовьтесь заходить в аудиторию по одному.",
      "Когда будете готовы — проходите.",
    ],
    onComplete: (state) => {
      state?.setFlag("talked_professor_corridor");
      state?.setFlag("talked_professor_entrance");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorEntranceRepeat: {
    speaker: "Преподаватель",
    lines: ["Не задерживайтесь. Заходите в аудиторию."],
  },

  crowdStudentsTalk: {
    speaker: "Студенты",
    lines: [
      "В коридоре шумно: кто-то повторяет билеты, кто-то спорит, кто-то нервно смеётся.",
      "Разговоры только сильнее напоминают Ваське, что экзамен уже начался.",
    ],
    choices: [
      {
        text: "Послушать разговоры",
        nextScene: "crowdStudentsListen",
        effects: [{ type: "incCounter", id: "anxiety", delta: 1 }],
      },
      {
        text: "Отойти и не накручивать себя",
        nextScene: "crowdStudentsIgnore",
        effects: [{ type: "incCounter", id: "anxiety", delta: -1 }],
      },
    ],
  },

  crowdStudentsListen: {
    speaker: "Васька",
    lines: ["Лучше бы я этого не слушал."],
  },

  crowdStudentsIgnore: {
    speaker: "Васька",
    lines: ["Сейчас главное — не паниковать."],
  },

  examTakeTicket: {
    speaker: "Профессор",
    lines: ["Подойдите к столу.", "Возьмите билет и садитесь готовиться."],
    onComplete: (state) => {
      state?.setFlag("got_exam_ticket");
      state?.setValue("currentGoal", "exam_prepare");
    },
  },

  needTakeTicketFirst: {
    speaker: "Васька",
    lines: ["Сначала надо подойти к преподавателю и взять билет."],
  },

  needSitAtExamDesk: {
    speaker: "Профессор",
    lines: ["Сначала подготовьте ответ за партой."],
  },

  examAnswerPrepared: {
    speaker: "Васька",
    lines: ["Время вышло. Надо идти отвечать."],
    onComplete: (state) => {
      state?.setValue("currentGoal", "exam_defense");
    },
  },

  examDeskAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже подготовил ответ. Теперь надо идти к преподавателю."],
  },

  examDefenseStart: {
    speaker: "Профессор",
    lines: [
      "Начинайте ответ.",
      "Хорошо, достаточно.",
      "Сейчас скажу результат.",
    ],
    onComplete: (state) => {
      state?.setFlag("exam_defended");
    },
  },

  finalExamSummary: {
    speaker: "Система",
    lines: ["Экзамен завершён."],
  },

  /* ===== ПРОФЕССОР ===== */

  professorTalk: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Так, студенты.",
      "Экзамен начнётся через 10 минут.",
      "Кто опоздает — не пущу.",
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
      state?.setFlag("talked_professor_corridor");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorLie: {
    speaker: "Васька",
    lines: ["Да не, всё нормально."],
    onComplete: (state) => {
      state?.incCounter("anxiety", 1);
      state?.setFlag("talked_professor_corridor");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorAdvice: {
    speaker: "Александр Евгеньевич",
    lines: ["Отвечай по существу.", "Если не знаешь — не выдумывай."],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.incCounter("anxiety", -1);
      state?.setFlag("talked_professor_corridor");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorCorridorRepeat: {
    speaker: "Александр Евгеньевич",
    lines: ["Не задерживайся в коридоре. Заходи в аудиторию."],
  },

  audienceTimeSkip: {
    speaker: "Система",
    lines: [
      "Через несколько минут студентов запускают в аудиторию.",
      "Васька садится и ждёт своей очереди.",
    ],
  },

  /* ===== ЭКЗАМЕН ===== */

  examStart: {
    speaker: "Профессор",
    lines: ["Фамилия?", "Садись. Тяни билет."],
  },

  debugExamStats: {
    speaker: "Система",
    lines: ["Отладка экзамена..."],
  },

  examAlreadyFinished: {
    speaker: "Профессор",
    lines: ["Экзамен для тебя уже закончился."],
  },

  /* ===== КОНЦОВКИ ===== */

  endingPerfect: {
    speaker: "Профессор",
    lines: [
      "Отлично, Петров.",
      "Редко вижу такой уверенный ответ.",
      "Пятёрка.",
    ],
  },

  endingGood: {
    speaker: "Профессор",
    lines: ["Неплохо.", "Есть мелкие огрехи, но в целом хорошо.", "Четвёрка."],
  },

  endingNormal: {
    speaker: "Профессор",
    lines: ["На троечку.", "Но видно, что старался.", "Свободен."],
  },

  endingEdge: {
    speaker: "Профессор",
    lines: ["Петров...", "На грани.", "Ладно, тройка. Иди."],
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

    repeat: {
      useScene: "professorCorridorRepeat",
    },
  },

  ProfessorEntrance: {
    firstMeeting: {
      useScene: "professorEntranceTalk",
    },

    repeat: {
      useScene: "professorEntranceRepeat",
    },
  },

  crowd_students: {
    firstMeeting: {
      useScene: "crowdStudentsTalk",
    },

    repeat: {
      useScene: "crowdStudentsTalk",
    },
  },

  Professor_audience: {
    firstMeeting: {
      useScene: "examTakeTicket",
    },

    repeat: {
      useScene: "needSitAtExamDesk",
    },
  },
};
