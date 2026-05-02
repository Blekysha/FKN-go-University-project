/*
  storyData.js
  Сценарные сцены и NPC-диалоги — ЖИВАЯ ВЕРСИЯ (ПОЛНАЯ)
*/

export const STORY_SCENES = {
  /* ===== УТРО В КОМНАТЕ ===== */

  intro: {
    speaker: "Васька",
    lines: [
      "Блин... всю ночь кошмары снились.",
      "То ли экзамен, то ли меня поезд переехал.",
      "Ладно, надо вставать. Сегодня же экзамен, чёрт возьми."
    ],
  },

  SemyonExamTalk: {
    speaker: "Семён",
    lines: [
      "О, живой! А я думал, ты уже в коме.",
      "Ты чё, забыл? Экзамен в 16:00!",
      "Я вчера со Светой базарил.",
      "Она там картами машет, судьбу предсказывает.",
      "Может, завалишь к ней? А то вид у тебя... хм...",
      "Как будто ты уже тройку получил, даже не выходя из дома."
    ],

    onComplete: (state) => {
      state?.setFlag("met_Semyon");
    },

    choices: [
      {
        text: "Ладно, схожу к Свете, чё терять-то?",
        nextScene: "goToSveta",
        effects: [
          { type: "setValue", id: "currentGoal", value: "sveta" },
          { type: "setFlag", id: "choice_set" },
        ],
      },
      {
        text: "Сначала умоюсь, а то с утра страшный",
        nextScene: "washFirst",
        effects: [
          { type: "setValue", id: "currentGoal", value: "toilet" },
          { type: "setFlag", id: "choice_set" },
        ],
      },
      {
        text: "Да ну эту эзотерику. Сам подготовлюсь",
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
    lines: ["Семён же обидится, если молча уйду.", "Надо сначала с ним перетереть."],
  },

  /* ===== ТУАЛЕТ ===== */

  washFirst: {
    speaker: "Васька",
    lines: ["Так, водичка — наше всё.", "Пойду приведу себя в порядок."],
  },

  toiletEvent: {
    speaker: "Васька",
    lines: [
      "*открывает кран*",
      "У-у-у, холодная!..",
      "*фыркает*",
      "Ладно, зубы почистил, лицо умыл.",
      "Вроде полегчало. Как будто снова человек."
    ],
    onComplete: (state) => {
      state?.setFlag("visited_toilet");
      state?.incCounter("fatigue", -1);
      state?.incCounter("anxiety", -1);
    },
  },

  afterToiletChoice: {
    speaker: "Васька",
    lines: ["Так, окей. Жить можно. Что дальше?"],

    choices: [
      {
        text: "Пойду к Свете, раз уж обещал",
        nextScene: "goToSvetaAfterToilet",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta" }],
      },
      {
        text: "Вернусь, поучусь немного",
        nextScene: "studyAfterToilet",
        effects: [{ type: "setValue", id: "currentGoal", value: "study" }],
      },
    ],
  },

  toiletAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже умывался.", "Второй раз не поможет."],
  },

  /* ===== УЧЁБА ===== */

  studyYourself: {
    speaker: "Васька",
    lines: [
      "Сяду, полистаю конспекты.",
      "Света, конечно, хорошая, но экзамен сама за меня не сдаст.",
      "Ну... погнали."
    ],
  },

  studyAfterToilet: {
    speaker: "Васька",
    lines: [
      "Так, теперь голова свежая.",
      "Можно и позаниматься пару часиков."
    ],
  },

  studyAfterSveta: {
    speaker: "Васька",
    lines: [
      "Света, конечно, душевная, но время уже поджимает.",
      "Надо хоть что-то повторить.",
      "Лучше так, чем вообще ничего."
    ],
  },

  studySession: {
    speaker: "Васька",
    lines: [
      "Так... открываю конспект.",
      "*листает страницы*",
      "М-да... половины не помню.",
      "Но кое-что в голове осталось.",
      "Ладно, хоть что-то."
    ],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.incCounter("fatigue", 1);
      state?.setFlag("studied_exam");
    },
  },

  afterStudyChoice: {
    speaker: "Васька",
    lines: ["Так, часика два позанимался.", "Теперь пора собираться."],
    choices: [
      {
        text: "Сразу в универ, нечего тянуть",
        nextScene: "goToUniversity",
        effects: [{ type: "setValue", id: "currentGoal", value: "university" }],
      },
      {
        text: "Всё-таки забегу к Свете на пару минут",
        nextScene: "goToSvetaAfterStudy",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta" }],
      },
    ],
  },

  goToUniversity: {
    speaker: "Васька",
    lines: ["Рюкзак проверил, штаны надел.", "Погнали, судьба-индейка."],
  },

  /* ===== СВЕТА ===== */

  goToSveta: {
    speaker: "Васька",
    lines: ["Лады, зайду.", "Хуже не будет, а вдруг поможет."],
  },

  goToSvetaAfterToilet: {
    speaker: "Васька",
    lines: ["Так, чистенький, причесанный.", "Теперь можно и к Свете заявиться."],
  },

  goToSvetaAfterStudy: {
    speaker: "Васька",
    lines: [
      "Позанямался немного.",
      "Быстро заскочу к Свете, скажу спасибо и в универ.",
      "Без вариантов."
    ],
  },

  svetaFortuneTalk: {
  speaker: "Света",
  lines: [
    "Я ждала тебя. Садись напротив. Свечи сегодня ярко горят — знак.",
    "Ты выглядишь... потерянным. Как будто тень от экзамена уже накрыла тебя с головой.",
    "(пауза, смотрит на карты) Не бойся. Здесь не колдуют. Здесь просто... смотрят. Вглубь.",
  ],
  choices: [
    {
      text: "Погадай мне... страшно, если честно",
      effects: { anxiety: -2, sveta_relation: +2 },
      nextScene: "svetaFortuneReal"
    },
    {
      text: "Я вообще-то не верю в эту эзотерику",
      effects: { anxiety: +1, sveta_relation: -1 },
      nextScene: "svetaFortuneSkeptic"
    },
    {
      text: "Может, просто чаю попьём? Без карт",
      effects: { anxiety: -1, sveta_relation: +1 },
      nextScene: "svetaTea"
    },
  ],
},

svetaFortuneReal: {
  speaker: "Света",
  lines: [
    "(берёт карты, тасует странно — медленно, будто шепчет каждой)",
    "Закрой глаза. Не думай об экзамене. Думай о том, чего боишься больше всего.",
    "(выкладывает три карты) Хм... Старшие Арканы. Это серьёзно.",
    "Экзамен... ты сдашь. Но есть нюанс. Сегодня у тебя будет выбор.",
    "Если пойдёшь направо — получишь лёгкость. Если налево — знания. Если прямо — останешься один.",
    "(поднимает глаза) Что выберешь — то и будет. Я не говорю, что лучше. Карты не советуют, они показывают дороги.",
    "И ещё... Не бери билет с интегралами. Ты их не выучил. Бери графики. Там твоё.",
  ],
  onComplete: (state) => {
    state?.incCounter("anxiety", -2);
    state?.incCounter("fatigue", -1);
    state?.setFlag("visited_sveta");
    state?.setFlag("can_choose_exam_ticket");
    state?.setValue("currentGoal", "university");
  },
},

svetaFortuneSkeptic: {
  speaker: "Света",
  lines: [
    "(усмехается) Не веришь? А зря.",
    "Картам всё равно, веришь ты или нет. Они говорят правду. Просто ты не хочешь слышать.",
    "(быстро тасует, вытягивает одну карту) Шут. Перевёрнутый.",
    "Ну что ж... Значит, будешь учиться сам. Держись. Экзамен сдашь, но дорога будет длинной и уставшей.",
  ],
  onComplete: (state) => {
    state?.incCounter("anxiety", 1);
    state?.setFlag("visited_sveta");
    state?.setValue("currentGoal", "university");
  },
},

svetaTea: {
  speaker: "Света",
  lines: [
    "(наливает чай в глиняную кружку, пар поднимается причудливыми узорами)",
    "Держи. С ромашкой и мятой. Для нервов.",
    "Твоя тревога имеет запах. Как старая бумага и пыль. Чай это уберёт.",
    "(пауза, смотрит на кружку) Не торопись. Выдохни. Через час экзамен не убежит.",
    "Просто будь собой. Даже если очень хочется стать кем-то умнее.",
  ],
  onComplete: (state) => {
    state?.incCounter("anxiety", -3);
    state?.incCounter("fatigue", -1);
    state?.setFlag("visited_sveta");
    state?.setValue("currentGoal", "university");
  },
},

svetaFortuneTalkAfterStudy: {
  speaker: "Света",
  lines: [
    "(не поворачиваясь, смотрит на пламя свечи) А, это ты... По лицу вижу — учил.",
    "У тебя под глазами круги. И пахнет от тебя усталостью и кофеином.",
    "Второй раз за сегодня? Ну заходи. Но долго не сиди.",
    "Карты говорят: ты почти готов. Осталось только не наломать дров перед дверью.",
  ],
  choices: [
    {
      text: "Ещё чаю? На посошок",
      nextScene: "svetaTeaAfterStudy",
    },
    {
      text: "Пойду к Семёну, вместе веселее",
      nextScene: "goBackToSemyonAfterStudy",
    },
  ],
},

svetaTeaAfterStudy: {
  speaker: "Света",
  lines: [
    "(наливает чай, добавляет что-то из маленькой баночки) Это зверобой.",
    "Убирает тревожные мысли. И делает сны яркими.",
    "(подаёт кружку) Пей медленно. И помни: ты не дурак. Ты просто устал. Это лечится.",
  ],
  onComplete: (state) => {
    state?.incCounter("anxiety", -2);
    state?.incCounter("fatigue", -2);
    state?.setFlag("visited_sveta");
    state?.setValue("currentGoal", "university");
  },
},

  /* ===== СЕМЁН ПОСЛЕ СВЕТЫ ===== */

  goBackToSemyon: {
    speaker: "Васька",
    lines: ["Ладно, вернусь.", "Может, Семён ещё чего подскажет."],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.setValue("currentGoal", "semyon_after_sveta");
    },
  },

  goBackToSemyonAfterStudy: {
    speaker: "Васька",
    lines: ["Скажу Семёну, что всё пучком.", "И сразу в универ."],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.setValue("currentGoal", "semyon_after_sveta");
    },
  },

  SemyonAfterSveta: {
    speaker: "Семён",
    lines: [
      "О, вернулся! Ну чё?",
      "Светка много нагадала?",
      "Ладно, давай ближе к делу, а то уже реально время поджимает."
    ],

    onComplete: (state) => {
      state?.setFlag("talkedAfterSveta");
    },

    choices: [
      {
        text: "Давай просто поболтаем, отвлечёмся",
        nextScene: "SemyonFunTalk",
      },
      {
        text: "Может, по учёбе что подскажешь?",
        nextScene: "SemyonStudyTalk",
      },
    ],
  },

  SemyonFunTalk: {
    speaker: "Семён",
    lines: [
      "Да забей ты на этот экзамен.",
      "Главное — не ссы.",
      "Уверенность половину дела решает."
    ],
    onComplete: (state) => {
      state?.incCounter("social", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  SemyonStudyTalk: {
    speaker: "Семён",
    lines: [
      "Смотри, главное — если билет нормальный попадётся, не тупи.",
      "Говори уверенно, даже если не знаешь.",
      "Профессор блеф не всегда видит."
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
      "*садится на подоконник*",
      "Тихо здесь...",
      "Окно открыто, свежий воздух.",
      "Вроде даже голова прояснилась немного."
    ],
    onComplete: (state) => {
      state?.setFlag("visited_window");
      state?.incCounter("anxiety", -1);
    },
  },

  windowAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже отдыхал тут.", "Пора двигаться дальше."],
  },

  /* ===== КОРИДОР УНИВЕРСИТЕТА И ЭКЗАМЕН ===== */

  professorEntranceTalk: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*поправляет очки*",
      "Следующий.",
      "Готовьтесь. Заходить по одному, без паники.",
      "Когда будете готовы — заходите."
    ],
    onComplete: (state) => {
      state?.setFlag("talked_professor_corridor");
      state?.setFlag("talked_professor_entrance");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorEntranceRepeat: {
    speaker: "Александр Евгеньевич",
    lines: ["Не задерживайте очередь.", "Заходите уже."],
  },

  crowdStudentsTalk: {
    speaker: "Система",
    lines: [
      "В коридоре гул, как на вокзале.",
      "Кто-то зубрит последние билеты, кто-то ржёт над мемами.",
      "Кто-то нервно ходит туда-сюда.",
      "Разговоры только усиливают тревогу."
    ],
    choices: [
      {
        text: "Прислушаться, о чём говорят",
        nextScene: "crowdStudentsListen",
        effects: [{ type: "incCounter", id: "anxiety", delta: 1 }],
      },
      {
        text: "Отойти в сторону и не слушать",
        nextScene: "crowdStudentsIgnore",
        effects: [{ type: "incCounter", id: "anxiety", delta: -1 }],
      },
    ],
  },

  crowdStudentsListen: {
    speaker: "Васька",
    lines: [
      "*прислушивается*",
      "«Он говорит, если упасть с третьего этажа, то можно не сдавать...»",
      "«А мой сказал, что автоматом можно не надеяться».",
      "Бред какой-то. Лучше б я не слушал."
    ],
  },

  crowdStudentsIgnore: {
    speaker: "Васька",
    lines: [
      "Игнорирую толпу.",
      "Главное — своё не забыть.",
      "Буду слушать других — точно запаникую."
    ],
  },

  examTakeTicket: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*кивает на стол*",
      "Подойдите, возьмите билет.",
      "Садитесь вон туда. Готовьтесь. Тишина."
    ],
    onComplete: (state) => {
      state?.setFlag("got_exam_ticket");
      state?.setValue("currentGoal", "exam_prepare");
    },
  },

  needTakeTicketFirst: {
    speaker: "Васька",
    lines: ["Точно, сначала надо билет взять у препода.", "Профессор так просто не отпустит."],
  },

  needSitAtExamDesk: {
    speaker: "Александр Евгеньевич",
    lines: ["Вы что, правила забыли?", "Сначала готовитесь, потом отвечаете. Садитесь."],
  },

  examAnswerPrepared: {
    speaker: "Васька",
    lines: [
      "*смотрит на часы*",
      "Время вышло.",
      "Ладно, что есть — то есть.",
      "Пойду сдавать."
    ],
    onComplete: (state) => {
      state?.setValue("currentGoal", "exam_defense");
    },
  },

  examDeskAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже всё написал.", "Теперь только к преподавателю идти."],
  },

  examDefenseStart: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Начинайте, Петров.",
      "*слушает, иногда кивает*",
      "Хорошо, достаточно.",
      "Сейчас скажу результат."
    ],
    onComplete: (state) => {
      state?.setFlag("exam_defended");
    },
  },

  finalExamSummary: {
    speaker: "Система",
    lines: ["Экзамен завершён."],
  },

  /* ===== ПРОФЕССОР — УСЛОВНЫЕ ФРАЗЫ ===== */

  professorConditionalLowPrep: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*пристально смотрит*",
      "Я вижу этот взгляд.",
      "Вы даже не пытались подготовиться, да?",
      "Зачем тогда пришли? Адреналин ловить?"
    ],
  },

  professorConditionalHighPrep: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*поднимает бровь*",
      "Хм.",
      "Редкий случай.",
      "Студент, который реально готов.",
      "Не разочаруйте меня, Петров."
    ],
  },

  professorProgressionTalk2: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Вы часто попадаетесь мне на глаза.",
      "Это может быть хорошо...",
      "…а может — не очень."
    ],
  },

  professorProgressionTalk5: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Я наблюдаю за вами, Петров.",
      "И знаете...",
      "в вас есть что-то.",
      "Возможно, потенциал."
    ],
  },

  professorRareTalk: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*тихо, почти себе под нос*",
      "Знаете... иногда я сам ненавижу этот экзамен.",
      "Но мы оба здесь. Ничего не поделаешь."
    ],
  },

  /* ===== СВЕТА — УСЛОВНЫЕ ФРАЗЫ ===== */

  svetaConditionalHighAnxiety: {
    speaker: "Света",
    lines: [
      "Слушай, ты реально на грани срыва.",
      "Если так дальше пойдёшь — ты на экзамене всё забудешь.",
      "Даже то, что учил.",
      "Попробуй подышать. Серьёзно."
    ],
  },

  svetaConditionalHighPrep: {
    speaker: "Света",
    lines: [
      "Ты слишком спокоен для этого места.",
      "Это либо гениальность...",
      "...либо ты чего-то не договариваешь.",
      "Но мне кажется, ты справишься."
    ],
  },

  svetaProgressionTalk3: {
    speaker: "Света",
    lines: [
      "Ты снова ко мне?",
      "Это неожиданно...",
      "Но приятно. Честно."
    ],
  },

  svetaProgressionTalk6: {
    speaker: "Света",
    lines: [
      "Знаешь...",
      "Когда ты рядом, мне самой легче.",
      "Странно, да? Ты пришёл за гаданием, а получается взаимопомощь."
    ],
  },

  svetaRareTalk: {
    speaker: "Света",
    lines: [
      "*смотрит в окно*",
      "Иногда мне кажется, что этот день никогда не закончится.",
      "Но он закончится. Как и экзамен."
    ],
  },

  svetaRepeat1: {
    speaker: "Света",
    lines: [
      "Ты чего-то хотел?",
      "Или просто молча постоять рядом?"
    ],
  },

  svetaRepeat2: {
    speaker: "Света",
    lines: [
      "Время идёт, Вась.",
      "Экзамен сам себя не сдаст, ты же знаешь."
    ],
  },

  professorRepeat1: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Вы что-то хотели?",
      "Говорите по делу, я не на чаепитии."
    ],
  },

  professorRepeat2: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Время идёт.",
      "Вы его тратите, я тоже."
    ],
  },

  professorTalk: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*смотрит на часы, потом на Ваську*",
      "Опоздали.",
      "Впрочем, это никого не удивляет.",
      "Фамилия?"
    ],
    choices: [
      {
        text: "Назвать имя уверенно",
        effects: { confidence: +5 },
        nextScene: "professorHonest"
      },
      {
        text: "Запнуться",
        effects: { anxiety: +5 },
        nextScene: "professorLie"
      },
    ],
  },

  professorHonest: {
    speaker: "Васька",
    lines: ["Петров.", "Чётко и без дрожи."],
    onComplete: (state) => {
      state?.incCounter("anxiety", -1);
      state?.setFlag("talked_professor_corridor");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorLie: {
    speaker: "Васька",
    lines: ["Э-э-э... Петров...", "*кашляет* Петров."],
    onComplete: (state) => {
      state?.incCounter("anxiety", 1);
      state?.setFlag("talked_professor_corridor");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorCorridorRepeat: {
    speaker: "Александр Евгеньевич",
    lines: ["Чего стоите? Заходите, не задерживайте."],
  },

  audienceTimeSkip: {
    speaker: "Система",
    lines: [
      "Через несколько минут запускают в аудиторию.",
      "Васька садится на свободное место и ждёт очереди.",
      "*тихий гул, скрип стульев, шёпот*"
    ],
  },

  examStart: {
    speaker: "Александр Евгеньевич",
    lines: ["Фамилия?", "Садись.", "Тяни билет, время пошло."],
  },

  debugExamStats: {
    speaker: "Система",
    lines: ["Режим отладки..."],
  },

  examAlreadyFinished: {
    speaker: "Александр Евгеньевич",
    lines: ["Экзамен для вас закончился.", "Следующий, пожалуйста."],
  },

  /* ===== КОНЦОВКИ ===== */

  endingPerfect: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*пауза*",
      "Отлично, Петров.",
      "Редко вижу такой уверенный ответ.",
      "Пятёрка. Свободен."
    ],
  },

  endingGood: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Неплохо.",
      "Ошибки есть, но в целом хорошо.",
      "Четвёрка. Идите."
    ],
  },

  endingNormal: {
    speaker: "Александр Евгеньевич",
    lines: [
      "М-да... на троечку.",
      "Но старались, видно.",
      "Ладно, тройка. Следующий."
    ],
  },

  endingEdge: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Петров...",
      "Это прямо на грани.",
      "Ладно. Тройка. Идите и учите матчасть."
    ],
  },

  endingFail: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*молча смотрит*",
      "Пересдача.",
      "Следующий."
    ],
  },
};

/* ===== NPC_DIALOGUES — ПОЛНАЯ ЖИВАЯ ВЕРСИЯ ===== */

export const NPC_DIALOGUES = {
  Semyon: {
    firstMeeting: {
      useScene: "SemyonExamTalk",
    },
    repeat: {
      speaker: "Семён",
      lines: [
        "Ну чё, надумал чего?",
        "Время тикает, братан."
      ],
    },
  },

  Sveta: {
    firstMeeting: {
      useScene: "svetaFortuneTalk",
    },

    conditional: [
      {
        condition: (state) => (state?.getValue("anxiety") ?? 0) > 70,
        dialogue: { useScene: "svetaConditionalHighAnxiety" }
      },
      {
        condition: (state) => (state?.getValue("preparation") ?? 0) > 80,
        dialogue: { useScene: "svetaConditionalHighPrep" }
      }
    ],

    progression: [
      {
        minTalks: 3,
        dialogue: { useScene: "svetaProgressionTalk3" }
      },
      {
        minTalks: 6,
        dialogue: { useScene: "svetaProgressionTalk6" }
      }
    ],

    repeat: [
      { useScene: "svetaRepeat1" },
      { useScene: "svetaRepeat2" }
    ],

    rare: [
      {
        chance: 0.12,
        dialogue: { useScene: "svetaRareTalk" }
      }
    ]
  },

  Professor: {
    firstMeeting: {
      useScene: "professorTalk",
    },

    conditional: [
      {
        condition: (state) => (state?.getValue("preparation") ?? 0) < 30,
        dialogue: { useScene: "professorConditionalLowPrep" }
      },
      {
        condition: (state) => (state?.getValue("preparation") ?? 0) > 80,
        dialogue: { useScene: "professorConditionalHighPrep" }
      }
    ],

    progression: [
      {
        minTalks: 2,
        dialogue: { useScene: "professorProgressionTalk2" }
      },
      {
        minTalks: 5,
        dialogue: { useScene: "professorProgressionTalk5" }
      }
    ],

    repeat: [
      { useScene: "professorRepeat1" },
      { useScene: "professorRepeat2" }
    ],

    rare: [
      {
        chance: 0.08,
        dialogue: { useScene: "professorRareTalk" }
      }
    ]
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
      speaker: "Система",
      lines: [
        "Вокруг всё так же шумят.",
        "Все ждут своей участи."
      ],
    },
  },

  Professor_audience: {
    firstMeeting: {
      useScene: "examTakeTicket",
    },
    repeat: {
      speaker: "Александр Евгеньевич",
      lines: [
        "Берите билет и садитесь.",
        "Время не резиновое."
      ],
    },
  },
};