/*
  storyData.js
  Сценарные сцены и NPC-диалоги
  Обновлено: живые диалоги, Света и Семён, все параметры
*/

export const STORY_SCENES = {
  /* ===== УТРО В КОМНАТЕ — СЦЕНА 1 ===== */

  intro: {
    speaker: "Васька",
    lines: [
      "Блин... Семён орёт с утра пораньше.",
      "Сегодня экзамен в 16:00.",
      "Надо вставать.",
    ],
  },

  SemyonExamTalk: {
    speaker: "Семён",
    lines: [
      "(не оборачиваясь) О, живучий! А я думал, ты уже экзамен во сне провалил и решил не просыпаться.",
      "Кстати — напоминаю: сегодня 16:00. Трусы погладил?",
      "Слушай... Я вчера со Светой с лестницы болтал.",
      "Она сказала: если кому хреново — заходите, она картами посмотрит. Типа судьбу чистит.",
      "Может, сходишь? А то вид у тебя — как будто ты уже на пересдаче.",
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
        text: "Сначала в туалет",
        nextScene: "washFirst",
        effects: [
          { type: "setValue", id: "currentGoal", value: "toilet" },
          { type: "setFlag", id: "choice_set" },
        ],
      },
      {
        text: "Забить, учиться самому",
        nextScene: "studyYourself",
        effects: [
          { type: "setValue", id: "currentGoal", value: "study" },
          { type: "setFlag", id: "choice_set" },
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: 2 },
        ],
      },
      {
        text: "Спросить, а что сам Семён думает",
        nextScene: "askSemyonOpinion",
        effects: [
          { type: "setValue", id: "currentGoal", value: "ask_semyon" },
          { type: "setFlag", id: "choice_set" },
        ],
      },
    ],
  },

  askSemyonOpinion: {
    speaker: "Васька",
    lines: ["А ты бы пошёл к ней?"],
    choices: [
      {
        text: "Ладно, уговорил. Пойду к Свете",
        nextScene: "goToSveta",
        effects: [
          { type: "setValue", id: "currentGoal", value: "sveta" },
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
      {
        text: "Не, я лучше сам позанимаюсь",
        nextScene: "studyYourself",
        effects: [
          { type: "setValue", id: "currentGoal", value: "study" },
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: 1 },
        ],
      },
    ],
  },

  SemyonResponseOpinion: {
    speaker: "Семён",
    lines: [
      "Я? Я уже всё сдал, мне пофиг.",
      "Но если бы я был на твоём месте… (чешет затылок) …наверное, сходил бы. Хотя бы прикола ради.",
      "Не, брат. Там моя бывшая стенд нарисовала. Не хочу пересекаться. Сам.",
    ],
  },

  needTalkToSemyonBeforeExit: {
    speaker: "Васька",
    lines: ["Сначала надо поговорить с Семёном."],
  },

  /* ===== ТУАЛЕТ — СЦЕНА 1Б ===== */

  washFirst: {
    speaker: "Васька",
    lines: ["Блин, я сначала в туалет. А то у меня во рту кошки ночевали."],
  },

  SemyonToiletResponse: {
    speaker: "Семён",
    lines: ["Иди, иди. Там кстати горячей воды нет, но и холодная бодрит."],
  },

  toiletEvent: {
    speaker: "Система",
    lines: [
      "Коридор. Васька идёт, зевающий охранник кивает.",
      "Туалет воняет хлоркой. Васька умывается холодной водой, смотрит в разбитое зеркало.",
      "(про себя) Боже, на кого я похож… Как будто меня вчера Семён в «Доту» на всю ночь затянул… А, нет, это я сам.",
      "Пьёт воду из-под крана, чистит зубы.",
      "(выходя, свежее) Окей. Я — человек. Почти.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_toilet");
      state?.incCounter("fatigue", -2);
      state?.incCounter("anxiety", -1);
    },
  },

  afterToiletChoice: {
    speaker: "Васька",
    lines: ["Так, полегчало. Что дальше? Появляется мысль: может, Света и не дура?"],

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
      {
        text: "Просто постоять у окна в коридоре",
        nextScene: "windowRestEvent",
        effects: [
          { type: "setValue", id: "currentGoal", value: "window" },
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
    ],
  },

  toiletAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже умывался."],
  },

  /* ===== УЧЁБА — СЦЕНА 1В ===== */

  studyYourself: {
    speaker: "Васька",
    lines: ["Да ну эту магию. Я лучше конспекты почитаю."],
  },

  SemyonStudyResponse: {
    speaker: "Семён",
    lines: ["(пожимает плечами) Ну-ну. Тогда хоть носки поменяй, а то воняешь."],
  },

  VasyaResponseStudy: {
    speaker: "Васька",
    lines: ["Сам ты воняешь."],
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
      "Васька сидит над конспектом. Ручка засохла. Он рисует на полях чертика.",
      "Семён, не стучи по клаве, а?",
      "(Семён) Я вообще-то с девушкой переписываюсь.",
      "(Васька) Судя по звуку, ты там в World of Tanks.",
      "(Семён) Это она любит тяжёлую технику… Ладно, извини.",
      "Васька пытается читать. Глаза слипаются.",
      "(вслух) Нихрена не понимаю. Теорема Коши… бля… это тот, который с усами?",
    ],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.incCounter("fatigue", 1);
      state?.setFlag("studied_exam");
    },
  },

  afterStudyChoice: {
    speaker: "Семён",
    lines: [
      "Слушай, ну сходи к Свете. Что ты мучаешься?",
      "Худший вариант — она скажет, что ты умрёшь. А ты всё равно умрёшь, но после экзамена.",
    ],
    choices: [
      {
        text: "Остаться учиться ещё 30 минут",
        nextScene: "studyMore",
        effects: [
          { type: "incCounter", id: "preparation", delta: 2 },
          { type: "incCounter", id: "fatigue", delta: 2 },
          { type: "incCounter", id: "anxiety", delta: 1 },
        ],
      },
      {
        text: "Пойти к Свете",
        nextScene: "goToSvetaAfterStudy",
        effects: [
          { type: "setValue", id: "currentGoal", value: "sveta" },
        ],
      },
      {
        text: "Попросить Семёна помочь повторить",
        nextScene: "askSemyonHelp",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
    ],
  },

  vasyaResponseToSemyon: {
    speaker: "Васька",
    lines: ["Спасибо, обнадёжил."],
  },

  studyMore: {
    speaker: "Васька",
    lines: [
      "Ладно, ещё полчасика.",
      "(через 30 минут) Блин, голова уже не варит.",
      "Так, ключ... потерялся среди носков. Ага, вот он.",
    ],
    onComplete: (state) => {
      state?.setFlag("found_key");
      state?.setValue("currentGoal", "university");
    },
  },

  askSemyonHelp: {
    speaker: "Семён",
    lines: [
      "Чел, я на первом курсе интегралы прогулял.",
      "Я могу тебе только сказать, что профессор ненавидит, когда говорят «ну это же очевидно».",
    ],
    onComplete: (state) => {
      state?.setValue("currentGoal", "study_choice");
    },
  },

  goToUniversity: {
    speaker: "Васька",
    lines: ["Ладно. Пора идти в универ."],
  },

  /* ===== СВЕТА — СЦЕНА 2А ===== */

  goToSveta: {
    speaker: "Васька",
    lines: ["Ладно, уговорил. Где там дверь? С глазом?"],
  },

  SemyonSvetaResponse: {
    speaker: "Семён",
    lines: ["Ага, третья налево. Только не стучи как мент — она не любит."],
  },

  goToSvetaAfterToilet: {
    speaker: "Васька",
    lines: ["Ладно, теперь можно и к Свете зайти."],
  },

  goToSvetaAfterStudy: {
    speaker: "Васька",
    lines: ["Ладно, уболтал. Только если она скажет что-то про прошлую жизнь — я уйду."],
  },

  svetaFortuneTalk: {
    speaker: "Света",
    lines: [
      "(не оборачиваясь) Заходи, Васька. Я знала, что ты переобуешься.",
      "Семён сказал?",
      "Садись вон туда, на подушку. Кофе или чай?",
      "Чай. С ромашкой. Для нервов.",
      "Не бойся. Я не буду говорить, что ты встретишь высокого брюнета.",
      "Твой вопрос — экзамен. Третий человек сегодня. Все на ФКН трясутся.",
    ],
    onComplete: (state) => {
      state?.setFlag("met_sveta");
    },
    choices: [
      {
        text: "Въехать в эзотерику — попросить погадать",
        nextScene: "svetaFortuneSerious",
      },
      {
        text: "Скептик, но вежливый",
        nextScene: "svetaFortuneSkeptic",
      },
      {
        text: "Подколоть Свету",
        nextScene: "svetaFortuneJoke",
      },
      {
        text: "Остаться на чай и поболтать (не про экзамен)",
        nextScene: "svetaTeaChat",
      },
    ],
  },

  svetaFortuneSerious: {
    speaker: "Васька",
    lines: ["А можешь… ну, на картах посмотреть?"],
    onComplete: (state) => {
      state?.incCounter("sveta_relation", 2);
      state?.incCounter("anxiety", -2);
      state?.incCounter("fatigue", -1);
      state?.setFlag("got_sveta_advice");
      state?.setFlag("can_choose_exam_ticket");
    },
  },

  svetaFortuneSeriousResponse: {
    speaker: "Света",
    lines: [
      "(улыбается) Наконец-то адекват. Дай руку.",
      "Не лезь в билеты с интегралами, ты их не выучил. Бери тот, где графики.",
    ],
  },

  svetaFortuneSkeptic: {
    speaker: "Васька",
    lines: ["Ну… давай, только без колдовства."],
    onComplete: (state) => {
      state?.incCounter("sveta_relation", 0);
      state?.incCounter("anxiety", -1);
      state?.setFlag("met_sveta");
    },
  },

  svetaFortuneSkepticResponse: {
    speaker: "Света",
    lines: ["Ладно, но тогда результат так себе. Расслабься и не тупи."],
  },

  svetaFortuneJoke: {
    speaker: "Васька",
    lines: ["А можно мне выиграть в лотерею? И чтоб экзамен принял робот."],
    onComplete: (state) => {
      state?.incCounter("sveta_relation", -2);
      state?.incCounter("anxiety", 2);
    },
  },

  svetaFortuneJokeResponse: {
    speaker: "Света",
    lines: ["(холодно) Тогда сам и отвечай."],
  },

  svetaTeaChat: {
    speaker: "Васька",
    lines: ["Слушай, а эта ромашка… она правда успокаивает?"],
    onComplete: (state) => {
      state?.incCounter("sveta_relation", 1);
      state?.incCounter("fatigue", -2);
      state?.incCounter("anxiety", -2);
      state?.incCounter("preparation", -1);
      state?.setFlag("met_sveta");
    },
  },

  svetaTeaChatResponse: {
    speaker: "Света",
    lines: [
      "(меняет тему) О, а ты заметил!",
      "Давай я тебе про травы расскажу, а карты потом.",
    ],
  },

  afterSvetaChoice: {
    speaker: "Васька",
    lines: ["Так, что дальше?"],
    choices: [
      {
        text: "Пойти к Семёну",
        nextScene: "goBackToSemyon",
        effects: [{ type: "setValue", id: "currentGoal", value: "semyon_after_sveta" }],
      },
      {
        text: "Пойти учиться",
        nextScene: "studyAfterSveta",
        effects: [{ type: "setValue", id: "currentGoal", value: "study" }],
      },
      {
        text: "Попросить у Светы талисман",
        nextScene: "askSvetaTalisman",
        effects: [
          { type: "incCounter", id: "sveta_relation", delta: -1 },
        ],
      },
    ],
  },

  askSvetaTalisman: {
    speaker: "Васька",
    lines: ["Слушай, а талисман какой-нибудь дашь?"],
    onComplete: (state) => {
      state?.setFlag("got_talisman");
    },
  },

  askSvetaTalismanResponse: {
    speaker: "Света",
    lines: ["(вздыхает) Держи. Только не потеряй."],
  },

  /* ===== СЕМЁН ПОСЛЕ СВЕТЫ — СЦЕНА 2Б ===== */

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
      "О, вернулся! Ну чё, нагадала тебе Светка пересдачу?",
      "(Васька) Сказала, сдам. Но выбор будет.",
      "Глубокая мысль. Может, вместе пойдём в универ?",
      "А то я один на экзамене как-то грустно.",
      "(Васька) Ты тоже сегодня сдаёшь?",
      "(Семён) Нет, я за компанию. Просто поржу.",
    ],

    onComplete: (state) => {
      state?.setFlag("talkedAfterSveta");
    },

    choices: [
      {
        text: "Пойти вместе",
        nextScene: "goToUniversityTogether",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -2 },
          { type: "incCounter", id: "social", delta: 1 },
        ],
      },
      {
        text: "Пойти одному",
        nextScene: "goToUniversity",
        effects: [
          { type: "incCounter", id: "anxiety", delta: 1 },
          { type: "incCounter", id: "independence", delta: 1 },
        ],
      },
      {
        text: "Пойдём, но ты помолчи про Свету при преподе",
        nextScene: "goToUniversitySilent",
        effects: [],
      },
    ],
  },

  goToUniversityTogether: {
    speaker: "Семён",
    lines: ["Обижаешь, я дипломат."],
    onComplete: (state) => {
      state?.setValue("currentGoal", "university");
    },
  },

  goToUniversitySilent: {
    speaker: "Семён",
    lines: ["Обижаешь, я дипломат."],
    onComplete: (state) => {
      state?.setValue("currentGoal", "university");
    },
  },

  /* ===== КОРИДОР И ПУТЬ — СЦЕНА 3 ===== */

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
      state?.setFlag("was_late");
    },
  },

  windowAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже сидел тут.", "Пора идти дальше."],
  },

  corridorChoice: {
    speaker: "Васька",
    lines: ["(думает) Правая — универ. Левая — Света. Или посидеть…"],
    choices: [
      {
        text: "Правая дверь — сразу в универ",
        nextScene: "goToUniversity",
        effects: [{ type: "setValue", id: "currentGoal", value: "university" }],
      },
      {
        text: "Левая дверь — ещё раз к Свете",
        nextScene: "goToSvetaAgain",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta_again" }],
      },
      {
        text: "Сесть на подоконник",
        nextScene: "windowRestEvent",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "setFlag", id: "was_late", value: true },
        ],
      },
      {
        text: "Зайти в соседнюю дверь",
        nextScene: "neighborDoor",
        effects: [{ type: "incCounter", id: "anxiety", delta: 1 }],
      },
    ],
  },

  goToSvetaAgain: {
    speaker: "Система",
    lines: [],
    onComplete: (state) => {
      const svetaRelation = state?.getCounter("sveta_relation") || 0;
      if (svetaRelation >= 1) {
        state?.incCounter("fatigue", -1);
        state?.setFlag("sveta_gave_cookie");
      } else {
        state?.setFlag("sveta_refused");
      }
      state?.setValue("currentGoal", "sveta_second_visit");
    },
  },

  svetaSecondVisitHigh: {
    speaker: "Света",
    lines: ["А, опять ты. Заходи, печенье как раз испекла."],
  },

  svetaSecondVisitLow: {
    speaker: "Света",
    lines: ["(из-за двери) Занята. И вообще, ты мне не нравишься."],
  },

  neighborDoor: {
    speaker: "Старшекурсники",
    lines: ["(бурчат) Иди учись, малыш..."],
  },

  /* ===== КОРИДОР УНИВЕРСИТЕТА — СЦЕНА 4 ===== */

  professorEntranceTalk: {
    speaker: "Александр Евгеньевич",
    lines: [
      "(строго) Так, студенты.",
      "Через 10 минут начинаем экзамен.",
      "Опоздавшие — марш домой.",
      "(видит Ваську) Вы чего такой зелёный? Экзамен не выучили?",
    ],
    onComplete: (state) => {
      state?.setFlag("talked_professor_corridor");
      state?.setValue("currentGoal", "professor_response");
    },
    choices: [
      {
        text: "Честно признаться",
        nextScene: "professorHonest",
      },
      {
        text: "Соврать",
        nextScene: "professorLie",
      },
      {
        text: "Попросить совет",
        nextScene: "professorAdvice",
      },
      {
        text: "Пошутить",
        nextScene: "professorJoke",
      },
      {
        text: "Спросить про туалет",
        nextScene: "professorAskToilet",
      },
    ],
  },

  professorHonest: {
    speaker: "Васька",
    lines: ["Боюсь, профессор. Очень."],
    onComplete: (state) => {
      state?.incCounter("teacher_relation", 1);
      state?.incCounter("anxiety", -1);
      state?.setValue("currentGoal", "exam");
    },
  },

  professorHonestResponse: {
    speaker: "Александр Евгеньевич",
    lines: ["Трус, но честный. Ладно, проходите."],
  },

  professorLie: {
    speaker: "Васька",
    lines: ["Да не, всё норм. Готов."],
    onComplete: (state) => {
      state?.incCounter("teacher_relation", -2);
      state?.incCounter("anxiety", 2);
      state?.setValue("currentGoal", "exam");
    },
  },

  professorLieResponse: {
    speaker: "Александр Евгеньевич",
    lines: ["Ну-ну, посмотрим."],
  },

  professorAdvice: {
    speaker: "Васька",
    lines: ["Что посоветуете, профессор?"],
    onComplete: (state) => {
      state?.incCounter("teacher_relation", 1);
      state?.incCounter("preparation", 1);
      state?.incCounter("anxiety", -1);
      state?.setValue("currentGoal", "exam");
    },
  },

  professorAdviceResponse: {
    speaker: "Александр Евгеньевич",
    lines: ["Отвечай по существу. Если не знаешь — не выдумывай."],
  },

  professorJoke: {
    speaker: "Васька",
    lines: ["Да я ночь не спал, всё учил. Даже проспал."],
    onComplete: (state) => {
      state?.incCounter("teacher_relation", 0);
      state?.incCounter("anxiety", -1);
      state?.setValue("currentGoal", "exam");
    },
  },

  professorJokeResponse: {
    speaker: "Александр Евгеньевич",
    lines: ["Шутники плохо отвечают. Проходите."],
  },

  professorAskToilet: {
    speaker: "Васька",
    lines: ["Можно в туалет?"],
    onComplete: (state) => {
      state?.incCounter("fatigue", -1);
      state?.incCounter("teacher_relation", -1);
      state?.setValue("currentGoal", "exam");
    },
  },

  professorAskToiletResponse: {
    speaker: "Александр Евгеньевич",
    lines: ["Идите сейчас, на экзамене не выпущу."],
  },

  crowdStudentsTalk: {
    speaker: "Система",
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

  /* ===== ЭКЗАМЕН — СЦЕНА 5 ===== */

  audienceTimeSkip: {
    speaker: "Система",
    lines: [
      "Через несколько минут студентов запускают в аудиторию.",
      "Васька садится и ждёт своей очереди.",
    ],
  },

  examStart: {
    speaker: "Профессор",
    lines: ["Фамилия?", "Петров.", "Садись. Тяни билет."],
  },

  examTakeTicket: {
    speaker: "Профессор",
    lines: ["Подойдите к столу.", "Возьмите билет и садитесь готовиться."],
    onComplete: (state) => {
      state?.setFlag("got_exam_ticket");
      state?.setValue("currentGoal", "exam_prepare");
    },
  },

  examTicketChoice: {
    speaker: "Система",
    lines: ["У Светы был спецбонус? Выбери билет:"],
    choices: [
      {
        text: "Взять билет №3 (на всякий случай)",
        nextScene: "examPrepare",
        effects: [{ type: "setFlag", id: "chosen_ticket_3" }],
      },
      {
        text: "Взять билет №7",
        nextScene: "examPrepare",
        effects: [{ type: "setFlag", id: "chosen_ticket_7" }],
      },
    ],
  },

  examPrepare: {
    speaker: "Васька",
    lines: [
      "Васька садится за парту. Билет сложный.",
      "Нужно собраться с мыслями.",
    ],
    onComplete: (state) => {
      state?.setValue("currentGoal", "exam_defense");
    },
  },

  examDefenseStart: {
    speaker: "Профессор",
    lines: ["Петров, определение интеграла. Начинайте ответ."],
    choices: [
      {
        text: "Чётко формулирую",
        nextScene: "examDefenseGood",
        condition: (state) => (state?.getCounter("preparation") || 0) >= 5,
      },
      {
        text: "Чётко формулирую",
        nextScene: "examDefenseBad",
        condition: (state) => (state?.getCounter("preparation") || 0) < 5,
      },
      {
        text: "Мычу, пытаюсь вспомнить",
        nextScene: "examDefenseBad",
        effects: [],
      },
      {
        text: "Спрашиваю: «Можно на примере?»",
        nextScene: "examDefenseExample",
        effects: [],
      },
    ],
  },

  examDefenseGood: {
    speaker: "Васька",
    lines: ["(чётко формулирует определение) Интеграл — это...", "Профессор кивает."],
    onComplete: (state) => {
      state?.setFlag("exam_passed_well");
    },
  },

  examDefenseBad: {
    speaker: "Васька",
    lines: ["Эээ... ну... это...", "Профессор хмурится."],
    onComplete: (state) => {
      state?.setFlag("exam_passed_badly");
    },
  },

  examDefenseExample: {
    speaker: "Васька",
    lines: ["Можно на примере объяснить?", "Профессор вздыхает."],
    onComplete: (state) => {
      const teacherRelation = state?.getCounter("teacher_relation") || 0;
      if (teacherRelation >= 2) {
        state?.setFlag("exam_passed_normal");
      } else {
        state?.incCounter("exam_score", -1);
        state?.setFlag("exam_passed_badly");
      }
    },
  },

  /* ===== ФИНАЛЫ ===== */

  finalExamSummary: {
    speaker: "Система",
    lines: ["Экзамен завершён."],
  },

  endingPerfect: {
    speaker: "Профессор",
    lines: ["Отлично, Петров! Редко вижу такой уверенный ответ.", "Пятёрка."],
    onComplete: (state) => {
      state?.setValue("exam_grade", 5);
    },
  },

  endingGood: {
    speaker: "Профессор",
    lines: ["Неплохо, Петров. Есть мелкие огрехи, но в целом хорошо.", "Четвёрка."],
    onComplete: (state) => {
      state?.setValue("exam_grade", 4);
    },
  },

  endingNormal: {
    speaker: "Профессор",
    lines: ["На троечку. Но видно, что старался.", "Свободен."],
    onComplete: (state) => {
      state?.setValue("exam_grade", 3);
    },
  },

  endingEdge: {
    speaker: "Профессор",
    lines: ["Петров... На грани.", "Ладно, тройка. Иди."],
    onComplete: (state) => {
      state?.setValue("exam_grade", 3);
    },
  },

  endingFail: {
    speaker: "Профессор",
    lines: ["Пересдача. Следующий!"],
    onComplete: (state) => {
      state?.setValue("exam_grade", 2);
    },
  },

  endingSuccessScene: {
    speaker: "Семён",
    lines: ["Ну?", "(Васька, широкая улыбка) Четыре!"],
  },

  endingSuccessScene2: {
    speaker: "Семён",
    lines: ["Да лааадно? А я спорил со Светой на шоколадку, что ты три получишь."],
  },

  endingSuccessScene3: {
    speaker: "Света",
    lines: ["А я говорила — сдаст. Пошли, у меня чай с мятой."],
  },

  endingSuccessScene4: {
    speaker: "Васька",
    lines: ["Ребята, я вас люблю. Особенно твои карты, Света."],
  },

  endingSuccessScene5: {
    speaker: "Света",
    lines: ["Это не карты, это ты молодец."],
  },

  endingFailScene: {
    speaker: "Семён",
    lines: ["(обнимает) Ничего, брат. Пересдача — это просто второй шанс подрочить перед экзаменом."],
  },

  endingFailScene2: {
    speaker: "Света",
    lines: ["Я на тебя раскину. Звезда выпала. Звезда — это к удаче. В следующий раз."],
  },

  endingFailScene3: {
    speaker: "Васька",
    lines: ["Спасибо… Накидайте мне в чат конспектов."],
  },
