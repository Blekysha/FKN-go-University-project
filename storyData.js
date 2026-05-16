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
      "Ладно, надо вставать. Сегодня же экзамен, чёрт возьми.",
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
      "Как будто ты уже с незачетом, хотя даже не выходил из дома.",
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

  needChooseStudyBeforeStudyDesk: {
    speaker: "Васька",
    lines: [
      "Сейчас не время садиться за стол.",
      "Я уже решил заняться другим.",
    ],
  },

  needGoToSvetaBeforeStudyDesk: {
    speaker: "Васька",
    lines: [
      "Я же сам решил сходить к Свете.",
      "Если сейчас сяду за комп, то точно никуда не дойду.",
    ],
  },

  needTalkToSemyonBeforeStudyDesk: {
    speaker: "Васька",
    lines: [
      "Сначала надо поговорить с Семёном.",
      "А то он уже что-то там про экзамен начал, а я сразу к компу полез.",
    ],
  },

  needTalkToSemyonBeforeExit: {
    speaker: "Васька",
    lines: [
      "Семён же обидится, если молча уйду.",
      "Надо сначала с ним перетереть.",
    ],
  },

  wrongDoor: {
    speaker: "Васька",
    lines: [
      "Не туда.",
      "Если сейчас начну бродить по общаге, на экзамен точно не попаду.",
    ],
  },

  cannotLeaveAudienceYet: {
    speaker: "Васька",
    lines: [
      "Сейчас нельзя выйти.",
      "Сначала надо закончить экзамен.",
    ],
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
      "Вроде полегчало. Как будто снова человек.",
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
      "Ну... погнали.",
    ],
  },

  studyAfterToilet: {
    speaker: "Васька",
    lines: ["Так, теперь голова свежая.", "Можно и позаниматься пару часиков."],
  },

  studyAfterSveta: {
    speaker: "Васька",
    lines: [
      "Света, конечно, душевная, но время уже поджимает.",
      "Надо хоть что-то повторить.",
      "Лучше так, чем вообще ничего.",
    ],
  },


  studyDeskAfterComputerGame: {
    speaker: "Васька",
    lines: [
      "Я уже наигрался.",
      "Если снова сяду за комп — точно никуда не уйду.",
      "И нормально готовиться уже поздно. Пора двигаться дальше.",
    ],
  },

  afterComputerGame: {
    speaker: "Васька",
    lines: [
      "Так... хватит.",
      "Игры закончились, а экзамен почему-то нет.",
      "Время ушло быстрее, чем я думал. Теперь уже надо выдвигаться.",
    ],
    onComplete: (state) => {
      state?.setFlag("played_computer_game");
      state?.setValue("currentGoal", "university");
    },
  },



  studyWithSemyon: {
    speaker: "",
    lines: [
      "Васька остаётся сидеть у стола и открывает конспект.",
      "Семён всё так же валяется на кровати с телефоном.",
      "Васька: Семён.",
      "Семён: М?",
      "Васька: У тебя бывает чувство, будто ты уже всё завалил, хотя ещё даже не вышел из комнаты?",
      "Семён: Постоянно. Это называется стабильность.",
    ],
    choices: [
      {
        text: "Пожаловаться, что всё вылетело из головы",
        nextScene: "studyWithSemyonComplain",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -2 },
          { type: "incCounter", id: "fatigue", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" },
        ],
      },
      {
        text: "Спросить, как он вообще успокаивается",
        nextScene: "studyWithSemyonAdvice",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "confidence", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" },
        ],
      },
      {
        text: "Попробовать объяснить тему вслух",
        nextScene: "studyWithSemyonExplainTopic",
        effects: [
          { type: "incCounter", id: "preparation", delta: 2 },
          { type: "incCounter", id: "confidence", delta: 1 },
          { type: "incCounter", id: "fatigue", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" },
        ],
      },
      {
        text: "Пошутить, чтобы хоть немного выдохнуть",
        nextScene: "studyWithSemyonJoke",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -2 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" },
        ],
      },
    ],
  },

  studyWithSemyonComplain: {
    speaker: "",
    lines: [
      "Васька: Ничего не помню вообще.",
      "Семён: Отлично. Значит, мозг освободил место под новые знания.",
      "Васька: Семён, это не помогает.",
      "Семён: Зато звучит научно.",
      "Васька фыркает и всё-таки пролистывает пару страниц конспекта.",
      "Паника не исчезает полностью, но уже не давит так сильно.",
    ],
  },

  studyWithSemyonAdvice: {
    speaker: "",
    lines: [
      "Васька: Ты как обычно успокаиваешься перед важным?",
      "Семён: Никак.",
      "Васька: Супер совет.",
      "Семён: Подожди. Я не закончил.",
      "Семён: Я просто иду и страдаю. Но с уверенным лицом.",
      "Васька: То есть стратегия — выглядеть так, будто всё под контролем?",
      "Семён: Именно. Внутри пожар, снаружи студент.",
      "Васька невольно улыбается и делает пометку на полях конспекта.",
    ],
  },

  studyWithSemyonExplainTopic: {
    speaker: "",
    lines: [
      "Васька: Слушай. Я сейчас попробую объяснить тему вслух.",
      "Семён: Я могу не слушать?",
      "Васька: Можешь делать вид, что слушаешь.",
      "Семён: Это я умею профессионально.",
      "Васька начинает объяснять тему простыми словами, сам себе спотыкаясь на формулировках.",
      "На середине становится ясно, где именно он путался.",
      "Семён поднимает палец, не отрываясь от телефона.",
      "Семён: Вот сейчас звучало почти умно.",
      "Васька: Почти?",
      "Семён: Не наглей перед экзаменом.",
    ],
  },

  studyWithSemyonJoke: {
    speaker: "",
    lines: [
      "Васька: Если я не вернусь после экзамена, считай меня академически мёртвым.",
      "Семён: Тогда можно я заберу твой чай?",
      "Васька: Семён.",
      "Семён: Что? Ты сам начал завещание.",
      "Васька смеётся, хотя до этого был уверен, что уже разучился.",
      "Учёбы от этого больше не становится, зато дышать становится легче.",
    ],
  },








  studySelfChoice: {
    speaker: "Васька",
    lines: [
      "Ладно. Без героизма.",
      "Сейчас надо хотя бы понять, что я вообще знаю.",
      "С чего начать?"
    ],
    choices: [
      { text: "Выбрать простую тему", nextScene: "studySimpleTopicChoice" },
      {
        text: "Взяться за самую страшную тему",
        nextScene: "studyHardBreakdown",
      },
      {
        text: "Составить план ответа наугад",
        nextScene: "studySelfConspiracy",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "social", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
    ],
  },

  studySimpleTopicChoice: {
    speaker: "Васька",
    lines: [
      "Начну с простого.",
      "Не потому что я трус.",
      "Просто надо с чего-то вылезать."
    ],
    choices: [
      {
        text: "Повторить определения",
        nextScene: "studySimpleDefinition",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 }
        ],
      },
      {
        text: "Разобрать схему из конспекта",
        nextScene: "studySimpleScheme",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "fatigue", delta: 1 }
        ],
      },
      {
        text: "Придумать пример для ответа",
        nextScene: "studySimpleExample",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "social", delta: 1 }
        ],
      },
    ],
  },

  studySimpleDefinition: {
    speaker: "Васька",
    lines: [
      "Определения хотя бы можно выучить словами.",
      "Если спросят глубже — буду страдать уже по ситуации.",
      "Но база в голове немного появилась."
    ],
    nextScene: "studySimpleAfterOneTopic",
  },

  studySimpleScheme: {
    speaker: "Васька",
    lines: [
      "Схема выглядит как карта метро, которую рисовал человек без сна.",
      "Но если читать слева направо, вроде становится логично.",
      "Почти."
    ],
    nextScene: "studySimpleAfterOneTopic",
  },

  studySimpleExample: {
    speaker: "Васька",
    lines: [
      "Пример — это спасательный круг.",
      "Даже если теория поплывёт, можно будет начать с него.",
      "Главное — не забыть, что я сам сейчас придумал."
    ],
    nextScene: "studySimpleAfterOneTopic",
  },

  studySimpleAfterOneTopic: {
    speaker: "Васька",
    lines: [
      "Одну тему вроде зацепил.",
      "Но до ощущения «я готов» ещё как до стипендии.",
      "Голова уже просит паузу."
    ],
    choices: [
      {
        text: "Продолжить учиться",
        nextScene: "studySimpleContinue",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "fatigue", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      { text: "Поиграть за компьютером", nextScene: "studyHardGiveUpComputer" },
      {
        text: "Окликнуть Семёна",
        nextScene: "studyHardTalkSemyon",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Зайти к Свете",
        nextScene: "studyHardGoSveta",
        effects: [
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "sveta" }
        ],
      },
    ],
  },

  studySimpleContinue: {
    speaker: "Васька",
    lines: [
      "Ладно, ещё немного.",
      "Не до идеала, но хотя бы без полного позора.",
      "В какой-то момент конспект перестаёт выглядеть как проклятие.",
      "Это уже победа."
    ],
  },















  studyHardBreakdown: {
    speaker: "Васька",
    lines: [
      "Так. Самая страшная тема.",
      "Я смотрю на неё.",
      "Она смотрит на меня.",
      "Пока побеждает она.",
      "Ладно. Не надо понимать всё сразу.",
      "Надо хотя бы понять, с какой стороны к ней подойти."
    ],
    choices: [
      {
        text: "Разобрать структуру темы",
        nextScene: "studyHardTryStructure",
        effects: [
          { type: "incCounter", id: "timeSpent", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: 1 }
        ],
      },
      {
        text: "Открыть конспект и читать подряд",
        nextScene: "studyHardPanic",
        effects: [
          { type: "incCounter", id: "timeSpent", delta: 1 },
          { type: "incCounter", id: "fatigue", delta: 1 }
        ],
      },
      {
        text: "Сразу сдаться и включить компьютер",
        nextScene: "studyHardComputerRiskWarning",
      },
      {
        text: "Позвать Семёна, чтобы не умереть морально",
        nextScene: "studyHardTalkSemyon",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
    ],
  },

  studyHardTryStructure: {
    speaker: "Васька",
    lines: [
      "Окей. Сначала заголовки.",
      "Потом подзаголовки.",
      "Потом вот эта страшная формула, которую я делаю вид, что не вижу.",
      "Если разложить тему на куски, она хотя бы перестаёт выглядеть как один большой монстр."
    ],
    choices: [
      {
        text: "Продолжить в тишине",
        nextScene: "studyHardSilentContinue",
        effects: [
          { type: "incCounter", id: "preparation", delta: 2 },
          { type: "incCounter", id: "fatigue", delta: 2 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Включить фоновый шум и учить так",
        nextScene: "studyHardBackgroundNoise",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -2 },
          { type: "incCounter", id: "fatigue", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Сделать паузу и открыть телефон",
        nextScene: "studyHardOpenPhone",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "timeSpent", delta: 1 }
        ],
      },
      {
        text: "Пойти к Свете, пока голова не взорвалась",
        nextScene: "studyHardGoSveta",
        effects: [
          { type: "setValue", id: "currentGoal", value: "sveta" }
        ],
      },
    ],
  },

  studyHardPanic: {
    speaker: "Васька",
    lines: [
      "Я читаю первый абзац.",
      "Потом второй.",
      "Потом понимаю, что первый уже выпал из головы.",
      "Гениально.",
      "Так можно до вечера читать и всё равно остаться на уровне «что-то где-то было»."
    ],
    choices: [
      {
        text: "Остановиться и составить мини-план ответа",
        nextScene: "studyHardTryStructure",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 }
        ],
      },
      {
        text: "Всё-таки дочитать через силу",
        nextScene: "studyHardSilentContinue",
        effects: [
          { type: "incCounter", id: "preparation", delta: 2 },
          { type: "incCounter", id: "fatigue", delta: 2 },
          { type: "incCounter", id: "anxiety", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Сорваться в компьютер",
        nextScene: "studyHardComputerRiskWarning",
      },
    ],
  },

  studyHardBackgroundNoise: {
    speaker: "Васька",
    lines: [
      "Я включаю что-то фоном.",
      "Не музыку даже. Просто шум, чтобы мысли не грызли мозг слишком громко.",
      "Стало спокойнее.",
      "Правда, часть темы прошла мимо меня, как маршрутка без остановки."
    ],
    nextScene: "studyHardFinalDecision",
  },

  studyHardSilentContinue: {
    speaker: "Васька",
    lines: [
      "Тишина давит, но зато я хотя бы вижу строчки.",
      "Медленно, криво, с внутренними торгами — но тема начинает собираться.",
      "Не вся.",
      "Но теперь я могу сказать хотя бы первые две фразы и не умереть сразу."
    ],
    nextScene: "studyHardFinalDecision",
  },

  studyHardOpenPhone: {
    speaker: "Васька",
    lines: [
      "Одна минута.",
      "Просто посмотреть время.",
      "...",
      "Почему я уже читаю комментарии под мемом про сессию?"
    ],
    choices: [
      {
        text: "Закрыть телефон и продолжить",
        nextScene: "studyHardSilentContinue",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "fatigue", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Уже всё равно — включить компьютер",
        nextScene: "studyHardComputerRiskWarning",
      },
      {
        text: "Окликнуть Семёна",
        nextScene: "studyHardTalkSemyon",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
    ],
  },

  studyHardFinalDecision: {
    speaker: "Васька",
    lines: [
      "Самую страшную тему я не победил.",
      "Но хотя бы перестал от неё бегать.",
      "До экзамена всё ещё страшно.",
      "Зато теперь страшно с парой заготовленных фраз."
    ],
    choices: [
      {
        text: "Хватит, идти в универ",
        nextScene: "goToUniversity",
        effects: [
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Зайти к Свете перед выходом",
        nextScene: "goToSvetaAfterStudy",
        effects: [
          { type: "setValue", id: "currentGoal", value: "sveta" }
        ],
      },
      {
        text: "Поговорить с Семёном, чтобы выдохнуть",
        nextScene: "studyHardTalkSemyon",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
    ],
  },

  studyHardComputerRiskWarning: {
    speaker: "Васька",
    lines: [
      "Компьютер стоит слишком близко.",
      "Это нечестно.",
      "Если я сейчас сяду играть, время точно исчезнет.",
      "Но мозг уже машет белым флагом."
    ],
    choices: [
      {
        text: "Нет, вернуться к теме",
        nextScene: "studyHardTryStructure",
        effects: [
          { type: "incCounter", id: "anxiety", delta: 1 }
        ],
      },
      {
        text: "Всё равно поиграть",
        nextScene: "studyHardGiveUpComputer",
      },
    ],
  },

  studyHardGiveUpComputer: {
    speaker: "Васька",
    lines: [
      "Нет.",
      "Мозг официально подал заявление на увольнение.",
      "Я просто на пару минут включу комп.",
      "На пару. Минут."
    ],
    onComplete: (state) => {
      state?.incCounter("timeSpent", 2);
      state?.setValue("openComputerAfterDialogue", true);
    },
  },

  studyHardTalkSemyon: {
    speaker: "",
    lines: [
      "Семён.",
      "Скажи что-нибудь нормальное, а то я сейчас вступлю в академический траур."
    ],
    nextScene: "studyWithSemyon",
  },

  studyHardGoSveta: {
    speaker: "Васька",
    lines: [
      "Нет, мне надо сменить воздух.",
      "Схожу к Свете, а потом сразу в универ.",
      "Главное — не зависнуть там надолго."
    ],
  },

  studySelfConspiracy: {
    speaker: "Васька",
    lines: [
      "План ответа: сначала уверенно сказать умное слово.",
      "Потом привести пример.",
      "Потом сделать вид, что так и было задумано.",
      "Странно, но это даже звучит как стратегия."
    ],
    nextScene: "afterStudySelfDecision",
  },

  afterStudySelfDecision: {
    speaker: "Васька",
    lines: [
      "Так. Немного в голове уложилось.",
      "Времени всё равно мало.",
      "Что дальше?"
    ],
    choices: [
      {
        text: "Сразу идти в универ",
        nextScene: "goToUniversity",
        effects: [{ type: "setValue", id: "currentGoal", value: "university" }],
      },
      {
        text: "Зайти к Свете перед экзаменом",
        nextScene: "goToSvetaAfterStudy",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta" }],
      },
    ],
  },

  afterComputerGameDecision: {
    speaker: "Васька",
    lines: [
      "Блин.",
      "Я действительно зашёл «на пару минут».",
      "И почему-то эти пару минут закончились вместе с моей совестью."
    ],
    choices: [
      {
        text: "Панически дочитать хотя бы одну тему",
        nextScene: "panicStudyAfterComputer",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: 2 },
          { type: "incCounter", id: "fatigue", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Смириться и идти в универ",
        nextScene: "afterComputerGoUniversity",
        effects: [{ type: "setValue", id: "currentGoal", value: "university" }],
      },
      {
        text: "Зайти к Свете, пока не поздно",
        nextScene: "goToSvetaAfterStudy",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta" }],
      },
    ],
  },

  panicStudyAfterComputer: {
    speaker: "Васька",
    lines: [
      "Так. Всё. Теперь реально.",
      "Открываю конспект на случайной странице.",
      "Читаю быстро, почти без дыхания.",
      "Половина не запомнилась, но одна мысль всё-таки зацепилась.",
      "Лучше, чем ничего. Наверное."
    ],
  },

  afterComputerGoUniversity: {
    speaker: "Васька",
    lines: [
      "Ладно.",
      "Будем считать, что я морально подготовился.",
      "Очень сомнительная формулировка, но другой уже нет."
    ],
  },

  studySession: {
    speaker: "Васька",
    lines: [
      "Так... открываю конспект.",
      "*листает страницы*",
      "М-да... половины не помню.",
      "Но кое-что в голове осталось.",
      "Ладно, хоть что-то.",
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
    lines: [
      "Так, чистенький, причесанный.",
      "Теперь можно и к Свете заявиться.",
    ],
  },

  goToSvetaAfterStudy: {
    speaker: "Васька",
    lines: [
      "Зайду к Свете ненадолго.",
      "А потом сразу в универ.",
    ],
  },

  svetaFortuneTalk: {
    speaker: "",
    lines: [
      "Света: О, Вась, привет! Подходи ко мне, чайник как раз вскипел.",
      "Васька подходит ближе и неловко оглядывается на стул.",
      "Васька: В общем, тут такое де...",
      "Света: Стой. Не садись.",
      "Света: Сегодня плохая примета. Лучше по возможности вообще не сидеть лишний раз.",
      "Света: Звучит странно, я знаю. Но лучше не садись. По крайней мере не у меня.",
      "Васька: ...Ладно. Теперь мне даже страшнее спрашивать про экзамен.",
    ],
    onComplete: (state) => {
      state?.setFlag("heard_sveta_no_sitting_advice");
    },
    choices: [
      {
        text: "Попросить погадать",
        nextScene: "svetaAskFortune",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "sveta_relation", delta: 1 },
        ],
      },
      {
        text: "Спросить про экзамен по-человечески",
        nextScene: "svetaAskExamStory",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "sveta_relation", delta: 1 },
        ],
      },
      {
        text: "Попросить чай без мистики",
        nextScene: "svetaTea",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "sveta_relation", delta: 1 },
        ],
      },
      {
        text: "Сказать, что в приметы не веришь",
        nextScene: "svetaFortuneSkeptic",
        effects: [
          { type: "incCounter", id: "anxiety", delta: 1 },
          { type: "incCounter", id: "sveta_relation", delta: -1 },
        ],
      },
    ],
  },

  svetaAskFortune: {
    speaker: "Васька",
    lines: [
      "Ладно... погадай.",
      "Только без фраз типа «дорога будет тяжёлой». Я это и так знаю.",
    ],
    choices: [
      {
        text: "Спросить, сдаст ли он экзамен",
        nextScene: "svetaFortuneReal",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "luck", delta: 1 },
        ],
      },
      {
        text: "Спросить, какой сегодня Семяниный",
        nextScene: "svetaTeacherMoodByState",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
      {
        text: "Передумать и просто поговорить",
        nextScene: "svetaAskExamStory",
        effects: [{ type: "incCounter", id: "social", delta: 1 }],
      },
    ],
  },

  svetaFortuneReal: {
    speaker: "Света",
    lines: [
      "Света медленно тасует карты, будто каждая карта тяжелее учебника.",
      "Первая карта — тревога. Ну, неожиданность века.",
      "Вторая — дорога. Значит, до аудитории ты всё-таки дойдёшь.",
      "Третья... смешная.",
      "Она говорит, что ты сдашь не потому, что всё знаешь.",
      "А потому что в нужный момент перестанешь изображать, что тебе всё равно.",
    ],
    choices: [
      {
        text: "Поверить Свете",
        nextScene: "svetaTrustAdvice",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -2 },
          { type: "incCounter", id: "sveta_relation", delta: 2 },
          { type: "setFlag", id: "trusted_sveta_prediction" },
        ],
      },
      {
        text: "Отшутиться",
        nextScene: "svetaJokeAfterFortune",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
    ],
  },

  svetaTeacherMoodGood: {
    speaker: "",
    lines: [
      "Света: Мм...",
      "Света: Сегодня от него как будто не так сильно веет проверкой посещаемости.",
      "Васька: Это хороший знак?",
      "Света: Для Семяниного — почти праздник.",
      "Света: Но всё равно не расслабляйся. Он добрый только относительно себя самого.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("confidence", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaTeacherMoodNeutral: {
    speaker: "",
    lines: [
      "Света: Сегодня он обычный.",
      "Васька: То есть?",
      "Света: То есть если знаешь — сдашь.",
      "Света: Если начнёшь сочинять новую математику на месте — он это почувствует.",
      "Света: И да, не болтай по дороге. Ты уже слишком долго собираешься.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("confidence", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaTeacherMoodBad: {
    speaker: "",
    lines: [
      "Света щурится, будто прислушивается к чему-то за стеной.",
      "Света: Ой.",
      "Васька: Что «ой»?",
      "Света: Не знаю, но ощущение такое, будто Семяниный сегодня уже с утра злой.",
      "Света: Если опоздаешь, он тебе это точно не простит.",
      "Света: Так что не стой ни с кем болтать. Сразу иди.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("anxiety", 1);
      state?.setValue("currentGoal", "university");
    },
  },


  svetaTrustAdvice: {
    speaker: "Света",
    lines: [
      "Вот так лучше.",
      "Бояться можно. Главное — не давать страху рулить вместо тебя.",
      "И помни про посадку. Сегодня лучше лишний раз не садиться.",
      "Да, звучит тупо. Нет, объяснять не буду.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("anxiety", -2);
      state?.incCounter("luck", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaJokeAfterFortune: {
    speaker: "",
    lines: [
      "Васька: То есть карты говорят, что я выживу?",
      "Света: Карты говорят, что ты драматизируешь.",
      "Васька: Это официальное заключение?",
      "Света: С печатью и свечкой.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.incCounter("social", 1);
      state?.incCounter("anxiety", -1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaAskExamStory: {
    speaker: "Васька",
    lines: [
      "А ты вообще знаешь, как этот экзамен проходит?",
      "Не в смысле картами. Нормально.",
    ],
    choices: [
      {
        text: "Выслушать историю про старший курс",
        nextScene: "svetaSeniorStory",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "social", delta: 1 },
        ],
      },
      {
        text: "Признаться, что страшно",
        nextScene: "svetaHonestFear",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -2 },
          { type: "incCounter", id: "sveta_relation", delta: 2 },
        ],
      },
      {
        text: "Свернуть разговор и пойти дальше",
        nextScene: "svetaLeaveFast",
        effects: [{ type: "incCounter", id: "anxiety", delta: 1 }],
      },
    ],
  },

  svetaSeniorStory: {
    speaker: "Света",
    lines: [
      "У меня подруга с курса старше сдавала у него прошлой зимой.",
      "Она готовилась идеально, а на первом вопросе зависла и сказала: «можно я начну заново как человек?»",
      "И знаешь что? Он разрешил.",
      "Он не любит, когда выдумывают. Но если честно признать, что сбился, он иногда даёт собраться.",
      "Так что не строй из себя камень. Камни тоже тонут, если их кинуть в сессию.",
    ],
    choices: [
      {
        text: "Запомнить совет",
        nextScene: "svetaSeniorStoryAdvice",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "confidence", delta: 1 },
        ],
      },
      {
        text: "Попросить чай после такой истории",
        nextScene: "svetaTea",
        effects: [{ type: "incCounter", id: "anxiety", delta: -1 }],
      },
    ],
  },

  svetaSeniorStoryAdvice: {
    speaker: "Света",
    lines: [
      "И ещё: если не знаешь точное определение, не начинай с фантазии.",
      "Скажи то, в чём уверен. Потом аккуратно расширяй.",
      "Преподаватели не всегда злые. Иногда они просто устали слушать уверенную чушь.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("preparation", 1);
      state?.incCounter("confidence", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaHonestFear: {
    speaker: "",
    lines: [
      "Васька: Мне реально страшно.",
      "Света некоторое время молчит и уже без шутки смотрит на него.",
      "Света: Тогда не делай вид, что нет.",
      "Света: Страх не исчезает от понтов. Он просто становится громче.",
      "Света: Выпей чаю. Потом иди. Не победителем, не героем — просто собой.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.incCounter("anxiety", -3);
      state?.incCounter("social", 1);
      state?.incCounter("sveta_relation", 2);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaLeaveFast: {
    speaker: "",
    lines: [
      "Света: Убегаешь?",
      "Васька: Тактическое отступление.",
      "Света: Тогда тактически не садись сегодня лишний раз.",
      "Васька: Опять это?",
      "Света: Особенно это.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaFortuneSkeptic: {
    speaker: "",
    lines: [
      "Света: Не веришь — нормально.",
      "Света: Приметы не обязаны нравиться, чтобы портить настроение.",
      "Васька: Очень убедительно.",
      "Света: Я старалась быть максимально раздражающей.",
      "Света: Но если без шуток — не накручивай себя у двери. Там все будут шуметь. Не впитывай чужую панику.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.incCounter("anxiety", 1);
      state?.incCounter("preparation", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaTea: {
    speaker: "",
    lines: [
      "Света наливает чай в глиняную кружку.",
      "Пар поднимается так красиво, будто он тоже пытается сдать экзамен и улететь.",
      "Света: С ромашкой и мятой. Для нервов.",
      "Васька: А если не поможет?",
      "Света: Тогда хотя бы будет вкусно.",
      "Света: И да. Сегодня лучше не садиться лишний раз. Странный день.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setFlag("heard_sveta_no_sitting_advice");
      state?.incCounter("anxiety", -3);
      state?.incCounter("fatigue", -1);
      state?.incCounter("sveta_relation", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaFortuneTalkAfterStudy: {
    speaker: "",
    lines: [
      "Света смотрит на Ваську и щурится.",
      "Света: Учился.",
      "Васька: Это вопрос?",
      "Света: Это диагноз. У тебя лицо конспекта.",
      "Света: Заходи, но быстро. Тебе уже не мистика нужна, а не развалиться перед дверью.",
    ],
    choices: [
      {
        text: "Попросить короткий совет",
        nextScene: "svetaSeniorStoryAdvice",
        effects: [
          { type: "incCounter", id: "confidence", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
      {
        text: "Выпить чай на посошок",
        nextScene: "svetaTeaAfterStudy",
        effects: [{ type: "incCounter", id: "anxiety", delta: -1 }],
      },
      {
        text: "Пойти к Семёну",
        nextScene: "goBackToSemyonAfterStudy",
        effects: [{ type: "incCounter", id: "social", delta: 1 }],
      },
    ],
  },

  svetaTeaAfterStudy: {
    speaker: "",
    lines: [
      "Света: Чай быстрый. Без церемоний.",
      "Васька: Быстрый чай звучит подозрительно.",
      "Света: Быстрый чай — это когда ты пьёшь и не задаёшь вопросов.",
      "Света: Ты подготовился лучше, чем думаешь. Теперь главное — не спалить себя паникой.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setFlag("heard_sveta_no_sitting_advice");
      state?.incCounter("anxiety", -2);
      state?.incCounter("fatigue", -1);
      state?.incCounter("confidence", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  /* ===== СЕМЁН ПОСЛЕ СВЕТЫ ===== */

  goBackToSemyon: {
    speaker: "Васька",
    lines: ["Ладно, вернусь.", "Может, Семён ещё чего подскажет."],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setValue("currentGoal", "semyon_after_sveta");
    },
  },

  goBackToSemyonAfterStudy: {
    speaker: "Васька",
    lines: ["Скажу Семёну, что всё пучком.", "И сразу в универ."],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("timeSpent", 2);
      state?.setValue("currentGoal", "semyon_after_sveta");
    },
  },

  SemyonAfterSveta: {
    speaker: "Семён",
    lines: [
      "О, вернулся! Ну чё?",
      "Светка много нагадала?",
      "Ладно, давай ближе к делу, а то уже реально время поджимает.",
    ],

    onComplete: (state) => {
      state?.setFlag("talkedAfterSveta");
    },

    choices: [
      {
        text: "Давай просто поболтаем, отвлечёмся",
        nextScene: "SemyonFunTalk",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
      {
        text: "Может, по учёбе что подскажешь?",
        nextScene: "SemyonStudyTalk",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "confidence", delta: 1 },
        ],
      },
    ],
  },

  SemyonFunTalk: {
    speaker: "Семён",
    lines: [
      "Да забей ты на этот экзамен.",
      "Главное — не ссы.",
      "Уверенность половину дела решает.",
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
      "Профессор блеф не всегда видит.",
    ],
    onComplete: (state) => {
      state?.incCounter("preparation", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  /* ===== ПОДОКОННИК ===== */

  windowRestEvent: {
    speaker: "",
    lines: [
      "За окном серо.",
      "Кто-то спешит на пары. Кто-то уже идёт домой.",
      "А Васька всё ещё стоит здесь.",
    ],
    choices: [
      {
        text: "Собраться и идти дальше",
        nextScene: "windowRestLeave",
        effects: [
          { type: "incCounter", id: "confidence", delta: 1 }
        ],
      },
      {
        text: "Посидеть ещё немного",
        nextScene: "windowRestStay",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "timeSpent", delta: 1 }
        ],
      },
      {
        text: "Залипнуть в мысли",
        nextScene: "windowRestThoughts",
        effects: [
          { type: "incCounter", id: "anxiety", delta: 1 },
          { type: "incCounter", id: "fatigue", delta: 1 },
          { type: "incCounter", id: "timeSpent", delta: 2 }
        ],
      },
      {
        text: "Посмотреть на людей снаружи",
        nextScene: "windowRestPeople",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "timeSpent", delta: 1 }
        ],
      },
    ],
  },

  windowRestLeave: {
    speaker: "",
    lines: [
      "Васька глубоко выдыхает.",
      "Ладно.",
      "Чем дольше тяну — тем хуже будет потом."
    ],
  },

  windowRestStay: {
    speaker: "",
    lines: [
      "Васька ещё немного сидит у окна.",
      "В коридоре кто-то проходит мимо, хлопает дверь.",
      "На секунду становится даже спокойно."
    ],
  },

  windowRestThoughts: {
    speaker: "",
    lines: [
      "Если бы я начал готовиться раньше...",
      "Если бы не отвлекался...",
      "Если бы вообще не доводил всё до такого состояния...",
      "Васька резко мотает головой.",
      "Нет. Сейчас уже поздно об этом думать."
    ],
  },

  windowRestPeople: {
    speaker: "",
    lines: [
      "Кто-то смеётся у входа.",
      "Кто-то спорит про пары.",
      "Удивительно.",
      "Как будто у людей жизнь существует не только между дедлайнами и пересдачами."
    ],
  },

  windowRestWithSvetaAdvice: {
    speaker: "Васька",
    lines: [
      "Подоконник выглядит слишком заманчиво.",
      "Но Света же сказала сегодня лишний раз не садиться.",
      "Вот теперь я стою и реально думаю над советом человека со свечами.",
    ],
    choices: [
      {
        text: "Сесть. Да ну эти приметы",
        nextScene: "windowRestSitAfterSveta",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "fatigue", delta: -1 },
          { type: "incCounter", id: "luck", delta: -1 },
          { type: "setFlag", id: "sat_window_after_sveta_advice" },
        ],
      },
      {
        text: "Не садиться. Вдруг она права",
        nextScene: "windowRestSkipBecauseSveta",
        effects: [
          { type: "incCounter", id: "sveta_relation", delta: 1 },
          { type: "incCounter", id: "luck", delta: 1 },
          { type: "setFlag", id: "skipped_window_because_sveta" },
        ],
      },
    ],
  },

  windowRestSit: {
    speaker: "Васька",
    lines: [
      "Васька садится на подоконник.",
      "Пара минут тишины неожиданно помогают больше, чем половина советов за утро.",
      "Ладно. Пора идти.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_window");
    },
  },

  windowRestSitAfterSveta: {
    speaker: "Васька",
    lines: [
      "Васька садится.",
      "Никакая молния с потолка не бьёт.",
      "Хотя где-то внутри всё равно неприятно шевелится мысль: а вдруг зря?",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_window");
    },
  },

  windowRestSkip: {
    speaker: "Васька",
    lines: [
      "Нет. Если сяду, то ещё сильнее расслаблюсь.",
      "Лучше дойти до аудитории, пока ноги сами идут.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_window");
    },
  },

  windowRestSkipBecauseSveta: {
    speaker: "Васька",
    lines: [
      "Ладно. Не сяду.",
      "Если Света потом спросит — смогу честно сказать, что послушал её странную примету.",
      "Господи, во что превращает людей сессия.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_window");
    },
  },

  windowAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже тут останавливался.", "Если ещё задержусь, экзамен начнётся без меня."],
  },


  /* ===== АВТОСЦЕНЫ ПУТИ И УНИВЕРА ===== */










  transitionAcquaintanceIntro: {
    speaker: "",
    lines: [
      "Знакомая: О, Васька?",
      "Знакомая: Ты куда такой убитый?",
      "Васька оборачивается.",
      "Навстречу идёт знакомая с курса Светы. Кажется, она как раз возвращается в общагу."
    ],
    choices: [
      {
        text: "Остановиться и поговорить",
        nextScene: "transitionAcquaintanceTalk",
        effects: [
          { type: "setFlag", id: "met_transition_acquaintance" }
        ],
      },
      {
        text: "Сразу сказать, что спешишь",
        nextScene: "transitionAcquaintanceHurry",
        effects: [
          { type: "setFlag", id: "met_transition_acquaintance" }
        ],
      },
    ],
  },

  transitionAcquaintanceTalk: {
    speaker: "",
    lines: [
      "Знакомая: Экзамен?",
      "Знакомая: Поняла по лицу.",
      "Знакомая: У вас сегодня Семяниный, да?",
      "Знакомая: Сочувствую. Он даже посещаемость проверяет так, будто ищет преступников.",
      "Знакомая: А вообще как ты? Давно тебя не видела.",
      "Знакомая: Света говорила, ты опять что-то делаешь с игрой или сайтом?"
    ],
    choices: [
      {
        text: "Аккуратно перебить и уйти",
        nextScene: "transitionAcquaintanceShortTalk",
        effects: [
          { type: "incCounter", id: "timeSpent", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 }
        ],
      },
      {
        text: "Дослушать её болтовню",
        nextScene: "transitionAcquaintanceLongTalk",
        effects: [
          { type: "incCounter", id: "timeSpent", delta: 3 },
          { type: "incCounter", id: "anxiety", delta: -2 },
          { type: "incCounter", id: "social", delta: 1 }
        ],
      },
      {
        text: "Дослушать и самому втянуться в разговор",
        nextScene: "transitionAcquaintanceVeryLongTalk",
        effects: [
          { type: "incCounter", id: "timeSpent", delta: 5 },
          { type: "incCounter", id: "anxiety", delta: -3 },
          { type: "incCounter", id: "social", delta: 2 }
        ],
      },
    ],
  },

  transitionAcquaintanceShortTalk: {
    speaker: "",
    lines: [
      "Васька: Я живой, но у меня экзамен.",
      "Васька: Если я сейчас остановлюсь, то морально останусь тут навсегда.",
      "Знакомая: Тогда беги, студент.",
      "Знакомая кивает и уходит дальше в сторону общаги.",
      "Васька ускоряет шаг."
    ],
  },

  transitionAcquaintanceLongTalk: {
    speaker: "",
    lines: [
      "Знакомая быстро перескакивает с экзамена на общагу, потом на Свету, потом на какую-то историю с парой.",
      "Васька сначала только кивает.",
      "Потом ловит себя на том, что уже несколько минут стоит на месте.",
      "Васька: Слушай, мне правда пора.",
      "Знакомая: Ой, точно. Всё, беги.",
      "Васька уходит с чуть более спокойной головой и с неприятным ощущением, что время куда-то делось."
    ],
  },

  transitionAcquaintanceVeryLongTalk: {
    speaker: "",
    lines: [
      "Разговор неожиданно становится почти нормальным.",
      "Знакомая рассказывает, как кто-то с её группы опоздал на зачёт и потом весь день выглядел как призрак.",
      "Васька зачем-то начинает рассказывать про свой проект.",
      "Потом вспоминает, что у него вообще-то экзамен.",
      "Васька: Блин. Всё. Я побежал.",
      "Знакомая: Давай, только реально беги.",
      "Васька срывается с места, уже понимая, что задержался слишком сильно."
    ],
  },

  transitionAcquaintanceHurry: {
    speaker: "",
    lines: [
      "Васька: Я бы поболтал, но у меня экзамен.",
      "Васька: Если я сейчас остановлюсь, то морально останусь тут навсегда.",
      "Знакомая усмехается и машет рукой.",
      "Знакомая: Тогда беги, студент."
    ],
  },

  transitionAcquaintanceReturn: {
    speaker: "",
    lines: [
      "Знакомая: Ты опять тут?",
      "Васька: Я просто... передумал на секунду.",
      "Знакомая: Перед экзаменом лучше не делать слишком много кругов.",
      "Васька: Логично."
    ],
  },

  transitionAcquaintanceGone: {
    speaker: "",
    lines: [
      "Знакомой уже нет.",
      "Наверное, ушла в общагу."
    ],
  },

  universityCorridorArrival: {
    speaker: "",
    lines: [
      "Ну вот.",
      "Университет.",
      "Чем ближе аудитория, тем сильнее кажется, что я забыл вообще всё."
    ],
  },

  universityCorridorLateArrival: {
    speaker: "",
    lines: [
      "Тихо.",
      "Слишком тихо.",
      "Чёрт... кажется, я реально затянул.",
      "Толпа уже почти рассосалась."
    ],
  },


  universityCorridorVeryLateArrival: {
    speaker: "",
    lines: [
      "Вроде никого не вижу...",
      "Чёрт.",
      "Я походу опоздал.",
      "У аудитории остался только ассистент преподавателя.",
      "Остальные уже либо сдали, либо хотя бы успели войти вовремя."
    ],
  },

  examTakeTicketLate: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Петров.",
      "Семяниный Владимир Василькович: Вы всё-таки решили появиться.",
      "Семяниный Владимир Василькович: Берите билет и садитесь.",
      "Семяниный Владимир Василькович: Времени на подготовку у вас, разумеется, меньше.",
    ],
    onComplete: (state) => {
      state?.setFlag("got_exam_ticket");
      state?.setValue("currentGoal", "exam_prepare");
      state?.incCounter("anxiety", 1);
    },
  },



  examRefusedVeryLateBadMood: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Петров.",
      "Семяниный Владимир Василькович: Время закончилось.",
      "Семяниный Владимир Василькович: Я и так задержался достаточно.",
      "Семяниный Владимир Василькович: На сегодня всё. Идите готовиться к пересдаче."
    ],
  },
  examTakeTicketVeryLate: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Петров.",
      "Семяниный Владимир Василькович: Это уже не опоздание, это отдельный жанр.",
      "Семяниный Владимир Василькович: Я вас приму, но на высокий балл даже не рассчитывайте.",
      "Семяниный Владимир Василькович: Берите билет. Быстро.",
    ],
    onComplete: (state) => {
      state?.setFlag("got_exam_ticket");
      state?.setValue("currentGoal", "exam_prepare");
      state?.incCounter("anxiety", 2);
      state?.incCounter("confidence", -1);
    },
  },

  audienceLateEntry: {
    speaker: "",
    lines: [
      "Васька заходит позже остальных.",
      "В коридоре уже почти пусто.",
      "Семяниный Владимир Василькович смотрит поверх очков.",
      "Очень нехороший знак."
    ],
  },

  tetruDoorMemory: {
    speaker: "",
    lines: [
      "Бр-р-р...",
      "Тетру...",
      "...",
      "Нет. Даже вспоминать страшно."
    ],
  },

  universityStairsNoNeed: {
    speaker: "",
    lines: [
      "Нет.",
      "Мне сейчас точно не нужно на лестницу.",
      "Один неверный поворот — и я психологически уже на пересдаче."
    ],
  },

  universityScheduleBoard: {
    speaker: "",
    lines: [
      "Расписание висит так уверенно,",
      "будто оно не рушило людям планы всю неделю.",
      "Я смотрю на него и всё равно надеюсь, что экзамен исчезнет."
    ],
  },

  coffeeMachineBroken: {
    speaker: "",
    lines: [
      "Автомат с кофе опять не работает.",
      "Стабильность.",
      "Жаль, не та, которая мне нужна."
    ],
  },


  /* ===== КОРИДОР УНИВЕРСИТЕТА И ЭКЗАМЕН ===== */

  professorEntranceVeryLate: {
    speaker: "",
    lines: [
      "Ассистент преподавателя: Петров?",
      "Ассистент преподавателя: Вы где были?",
      "Ассистент преподавателя: Идите быстрее, он уже собирается уходить.",
      "Ассистент преподавателя: Все уже всё сдали.",
      "Ассистент преподавателя: Следующих больше нет, так что не задерживайте ещё сильнее."
    ],
    onComplete: (state) => {
      state?.setFlag("talked_professor_corridor");
      state?.setFlag("talked_professor_entrance");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorEntranceVeryLateRepeat: {
    speaker: "Ассистент преподавателя",
    lines: [
      "Петров, не стойте в коридоре.",
      "Идите внутрь. Владимир Василькович уже ждёт.",
      "Следующих больше нет."
    ],
  },

  professorEntranceTalk: {
    speaker: "Ассистент преподавателя",
    lines: [
      "Ассистент преподавателя стоит у двери и запускает студентов по одному.",
      "Вокруг шумят, кто-то листает конспект, кто-то делает вид, что ему не страшно.",
      "Ассистент замечает Ваську.",
      "Вы бледный, Петров. Экзамена боитесь?",
    ],
    choices: [
      {
        text: "Честно признаться",
        nextScene: "professorEntranceHonest",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "confidence", delta: 1 },
        ],
      },
      {
        text: "Сказать, что всё нормально",
        nextScene: "professorEntranceLie",
        effects: [
          { type: "incCounter", id: "anxiety", delta: 1 },
          { type: "incCounter", id: "confidence", delta: -1 },
        ],
      },
      {
        text: "Попросить совет перед входом",
        nextScene: "professorEntranceAdvice",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
        ],
      },
    ],
  },

  professorEntranceHonest: {
    speaker: "Ассистент преподавателя",
    lines: [
      "Бояться нормально.",
      "Ненормально — молчать, если не понимаете вопрос.",
      "Зайдёте, возьмёте билет, сядете и спокойно подготовитесь.",
      "Без геройства. По существу.",
    ],
    onComplete: (state) => {
      state?.setFlag("talked_professor_corridor");
      state?.setFlag("talked_professor_entrance");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorEntranceLie: {
    speaker: "Ассистент преподавателя",
    lines: [
      "Ну-ну.",
      "У меня за годы работы глаз намётан: «всё нормально» обычно значит «я сейчас умру». ",
      "Ладно, Петров. Только не устраивайте спектакль у доски.",
    ],
    onComplete: (state) => {
      state?.setFlag("talked_professor_corridor");
      state?.setFlag("talked_professor_entrance");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorEntranceAdvice: {
    speaker: "Ассистент преподавателя",
    lines: [
      "Совет простой.",
      "Если знаете — отвечайте коротко и точно.",
      "Если не знаете — не сочиняйте новую науку на месте.",
      "И не начинайте каждый ответ со слова «ну». Это не аргумент.",
    ],
    onComplete: (state) => {
      state?.setFlag("talked_professor_corridor");
      state?.setFlag("talked_professor_entrance");
      state?.setValue("currentGoal", "exam");
    },
  },

  professorEntranceRepeat: {
    speaker: "Ассистент преподавателя",
    lines: ["Петров, не задерживайте очередь.", "Готовы — заходите."],
  },

  crowdStudentsTalk: {
    speaker: "Система",
    lines: [
      "Толпа перед аудиторией живёт отдельной жизнью.",
      "Кто-то шепчет билеты, кто-то спорит, кто-то уже мысленно пересдаёт.",
      "Если прислушаться, можно услышать полезное. Или окончательно добить себе нервы.",
    ],
    choices: [
      {
        text: "Прислушаться к разговорам",
        nextScene: "crowdStudentsListen",
        effects: [
          { type: "incCounter", id: "anxiety", delta: 1 },
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "setFlag", id: "listened_students" },
        ],
      },
      {
        text: "Отойти и не слушать",
        nextScene: "crowdStudentsIgnore",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "confidence", delta: 1 },
          { type: "setFlag", id: "ignored_students" },
        ],
      },
    ],
  },

  crowdStudentsListen: {
    speaker: "Васька",
    lines: [
      "«Он в прошлом году спрашивал определения, не задачи». ",
      "«Да не, он любит графики». ",
      "«А если молчать — сразу пересдача». ",
      "Васька перестаёт слушать на слове «пересдача». Полезно, но неприятно.",
    ],
  },

  crowdStudentsIgnore: {
    speaker: "Васька",
    lines: [
      "Нет. Чужая паника заразная.",
      "Я лучше останусь со своей. Она хотя бы родная.",
    ],
  },

  examTakeTicket: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Фамилия?",
      "Васька: Петров.",
      "Семяниный Владимир Василькович кивает на стопку билетов.",
      "Семяниный Владимир Василькович: Берите билет. Потом садитесь за парту и готовьтесь.",
      "Семяниный Владимир Василькович: Только без разговоров и героических страданий вслух.",
    ],
    onComplete: (state) => {
      state?.setFlag("got_exam_ticket");
      state?.setValue("currentGoal", "exam_prepare");
      if (state?.hasFlag("heard_sveta_exam_advice")) {
        state?.incCounter("confidence", 1);
      }
    },
  },

  needTakeTicketFirst: {
    speaker: "Васька",
    lines: [
      "Точно, сначала надо билет взять у препода.",
      "Профессор так просто не отпустит.",
    ],
  },

  needSitAtExamDesk: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Петров, вы билет взяли не для красоты.",
      "Семяниный Владимир Василькович: Сначала готовитесь за партой, потом отвечаете.",
    ],
  },

  examAnswerPrepared: {
    speaker: "Васька",
    lines: [
      "Время вышло.",
      "Черновик выглядит так, будто его писал человек на грани просветления и паники одновременно.",
      "Ладно. Что есть — то есть.",
      "Пойду сдавать.",
    ],
    onComplete: (state) => {
      state?.setValue("currentGoal", "exam_defense");
    },
  },

  examDeskAlreadyUsed: {
    speaker: "Васька",
    lines: ["Я уже подготовился.", "Дальше тянуть бессмысленно. Надо идти отвечать."],
  },

  examDefenseStart: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Начинайте, Петров.",
      "Васька делает вдох и начинает отвечать.",
      "Где-то он говорит уверенно, где-то цепляется за формулировки, где-то спасается тем, что помнит чужие советы.",
      "Семяниный Владимир Василькович слушает молча. Это хуже, чем если бы перебивал.",
      "Семяниный Владимир Василькович: Достаточно. Сейчас скажу результат.",
    ],
    onComplete: (state) => {
      state?.setFlag("exam_defended");
    },
  },

  finalExamSummary: {
    speaker: "Система",
    lines: ["Экзамен завершён.", "Дальше будет финальная сцена проекта."],
  },



  examStudentIntro: {
    speaker: "Васька",
    lines: [
      "Стоит рядом, но даже не в очереди.",
      "Может, уже сдал.",
      "Или просто пытается прийти в себя.",
      "Может, подойти спросить что-нибудь..."
    ],
    choices: [
      {
        text: "Подойти поговорить",
        nextScene: "examStudentTalkStart",
      },
      {
        text: "Не лезть",
        nextScene: "examStudentDontTalk",
      },
    ],
  },

  examStudentDontTalk: {
    speaker: "Васька",
    lines: [
      "Да ну.",
      "И так голова шумит.",
      "Ещё один разговор — и я сам себя накручу."
    ],
  },

  examStudentTalkStart: {
    speaker: "Васька",
    lines: [
      "Эм... привет?",
      "Ты с этого экзамена?"
    ],
    nextScene: "examStudentMoodByState",
  },

  examStudentEndTalk: {
    speaker: "Васька",
    lines: [
      "Ладно. Спасибо.",
      "Надеюсь, я тоже выживу."
    ],
  },

  examStudentAdvice: {
    speaker: "Студент",
    lines: [
      "Главное — не зависай слишком долго.",
      "Семяниный Владимир Василькович это не любит.",
      "Если начал отвечать — отвечай уверенно.",
      "Даже если внутри уже умер."
    ],
  },

  examStudentTickets: {
    speaker: "Студент",
    lines: [
      "Билеты как билеты.",
      "Но если он внезапно вспоминает интегралы — всё.",
      "Можешь морально прощаться с жизнью.",
      "Я до сих пор не понял, зачем он их вообще приплёл."
    ],
  },

  examStudentMoodGood: {
    speaker: "Студент",
    lines: [
      "А? Да, только вышел.",
      "Сегодня вроде нормально прошло.",
      "Семяниный Владимир Василькович даже не душил дополнительными.",
      "Хотя одному человеку интегралы всё-таки вспомнил.",
      "Не знаю, за какие грехи."
    ],
    choices: [
      {
        text: "Спросить про билеты",
        nextScene: "examStudentTickets",
      },
      {
        text: "Попросить совет",
        nextScene: "examStudentAdvice",
      },
      {
        text: "Закончить разговор",
        nextScene: "examStudentEndTalk",
      },
    ],
  },

  examStudentMoodNeutral: {
    speaker: "Студент",
    lines: [
      "А? Да, только вышел.",
      "Ну... сегодня он обычный.",
      "Если отвечать по делу — жить можно.",
      "Но если поплывёшь — Семяниный это сразу чувствует."
    ],
    choices: [
      {
        text: "Спросить про билеты",
        nextScene: "examStudentTickets",
      },
      {
        text: "Попросить совет",
        nextScene: "examStudentAdvice",
      },
      {
        text: "Закончить разговор",
        nextScene: "examStudentEndTalk",
      },
    ],
  },

  examStudentMoodBad: {
    speaker: "Студент",
    lines: [
      "Да. Только вышел.",
      "Если честно — сегодня он какой-то злой.",
      "Смотрит так, будто уже заранее знает, кто готовился.",
      "И кому сейчас станет очень грустно.",
      "Он ещё интегралы кому-то вспомнил.",
      "Я думал, это уже городская легенда."
    ],
    choices: [
      {
        text: "Спросить про билеты",
        nextScene: "examStudentTickets",
      },
      {
        text: "Попросить совет",
        nextScene: "examStudentAdvice",
      },
      {
        text: "Закончить разговор",
        nextScene: "examStudentEndTalk",
      },
    ],
  },

  examStudentRepeat: {
    speaker: "Студент",
    lines: [
      "Я уже всё сказал.",
      "Не накручивай себя слишком сильно.",
      "Хотя да, звучит бесполезно перед экзаменом."
    ],
  },


  /* ===== ПРОФЕССОР — УСЛОВНЫЕ ФРАЗЫ ===== */

  professorConditionalLowPrep: {
    speaker: "Семяниный Владимир Василькович",
    lines: [
      "*пристально смотрит*",
      "Я вижу этот взгляд.",
      "Вы даже не пытались подготовиться, да?",
      "Зачем тогда пришли? Адреналин ловить?",
    ],
  },

  professorConditionalHighPrep: {
    speaker: "Семяниный Владимир Василькович",
    lines: [
      "*поднимает бровь*",
      "Хм.",
      "Редкий случай.",
      "Студент, который реально готов.",
      "Не разочаруйте меня, Петров.",
    ],
  },

  professorProgressionTalk2: {
    speaker: "Семяниный Владимир Василькович",
    lines: [
      "Вы часто попадаетесь мне на глаза.",
      "Это может быть хорошо...",
      "…а может — не очень.",
    ],
  },

  professorProgressionTalk5: {
    speaker: "Семяниный Владимир Василькович",
    lines: [
      "Я наблюдаю за вами, Петров.",
      "И знаете...",
      "в вас есть что-то.",
      "Возможно, потенциал.",
    ],
  },

  professorRareTalk: {
    speaker: "Семяниный Владимир Василькович",
    lines: [
      "*тихо, почти себе под нос*",
      "Знаете... иногда я сам ненавижу этот экзамен.",
      "Но мы оба здесь. Ничего не поделаешь.",
    ],
  },

  /* ===== СВЕТА — УСЛОВНЫЕ ФРАЗЫ ===== */

  svetaConditionalHighAnxiety: {
    speaker: "Света",
    lines: [
      "Слушай, ты реально на грани срыва.",
      "Если так дальше пойдёшь — ты на экзамене всё забудешь.",
      "Даже то, что учил.",
      "Попробуй подышать. Серьёзно.",
    ],
  },

  svetaConditionalHighPrep: {
    speaker: "Света",
    lines: [
      "Ты слишком спокоен для этого места.",
      "Это либо гениальность...",
      "...либо ты чего-то не договариваешь.",
      "Но мне кажется, ты справишься.",
    ],
  },

  svetaProgressionTalk3: {
    speaker: "Света",
    lines: ["Ты снова ко мне?", "Это неожиданно...", "Но приятно. Честно."],
  },

  svetaProgressionTalk6: {
    speaker: "Света",
    lines: [
      "Знаешь...",
      "Когда ты рядом, мне самой легче.",
      "Странно, да? Ты пришёл за гаданием, а получается взаимопомощь.",
    ],
  },

  svetaRareTalk: {
    speaker: "Света",
    lines: [
      "*смотрит в окно*",
      "Иногда мне кажется, что этот день никогда не закончится.",
      "Но он закончится. Как и экзамен.",
    ],
  },

  svetaRepeat1: {
    speaker: "Света",
    lines: ["Ты чего-то хотел?", "Или просто молча постоять рядом?"],
  },

  svetaRepeat2: {
    speaker: "Света",
    lines: ["Время идёт, Вась.", "Экзамен сам себя не сдаст, ты же знаешь."],
  },

  professorRepeat1: {
    speaker: "Семяниный Владимир Василькович",
    lines: ["Вы что-то хотели?", "Говорите по делу, я не на чаепитии."],
  },

  professorRepeat2: {
    speaker: "Семяниный Владимир Василькович",
    lines: ["Время идёт.", "Вы его тратите, я тоже."],
  },

  professorTalk: {
    speaker: "Семяниный Владимир Василькович",
    lines: [
      "*смотрит на часы, потом на Ваську*",
      "Опоздали.",
      "Впрочем, это никого не удивляет.",
      "Фамилия?",
    ],
    choices: [
      {
        text: "Назвать имя уверенно",
        effects: { confidence: +5 },
        nextScene: "professorHonest",
      },
      {
        text: "Запнуться",
        effects: { anxiety: +5 },
        nextScene: "professorLie",
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
    speaker: "Семяниный Владимир Василькович",
    lines: ["Чего стоите? Заходите, не задерживайте."],
  },

  audienceTimeSkip: {
    speaker: "Система",
    lines: [
      "Через несколько минут дверь открывается.",
      "В аудиторию запускают по одному.",
      "Васька заходит один, стараясь не смотреть на толпу за спиной.",
      "Внутри тише, чем в коридоре. От этого почему-то ещё тревожнее.",
    ],
  },

  examStart: {
    speaker: "Семяниный Владимир Василькович",
    lines: ["Фамилия?", "Садись.", "Тяни билет, время пошло."],
  },

  debugExamStats: {
    speaker: "Система",
    lines: ["Режим отладки..."],
  },

  examAlreadyFinished: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Экзамен для вас закончился.",
      "Семяниный Владимир Василькович: Следующий, пожалуйста.",
    ],
  },

  /* ===== КОНЦОВКИ ===== */

  endingPerfect: {
    speaker: "",
    lines: [
      "Пауза длится так долго, что Васька успевает мысленно умереть два раза.",
      "Семяниный Владимир Василькович: Отлично, Петров.",
      "Семяниный Владимир Василькович: Ответ уверенный, структура есть, лишнего почти нет.",
      "Семяниный Владимир Василькович: Пятёрка. Свободны.",
    ],
  },

  endingGood: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Неплохо.",
      "Семяниный Владимир Василькович: Были неточности, но вы не потерялись и по существу ответили.",
      "Семяниный Владимир Василькович: Четвёрка. Идите.",
    ],
  },

  endingNormal: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: На троечку, Петров.",
      "Семяниный Владимир Василькович: Местами путались, но видно, что хоть за что-то держались.",
      "Семяниный Владимир Василькович: Тройка. Следующий.",
    ],
  },

  endingEdge: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Петров...",
      "Семяниный Владимир Василькович: Это слабый ответ.",
      "Семяниный Владимир Василькович: Очень слабый.",
      "Семяниный Владимир Василькович: Двойка. На пересдачу подготовьтесь уже по-настоящему.",
    ],
  },

  endingFail: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Пересдача.",
      "Семяниный Владимир Василькович: Следующий.",
    ],
  },

  endingDisaster: {
    speaker: "",
    lines: [
      "Семяниный Владимир Василькович: Петров...",
      "Семяниный Владимир Василькович: Я даже не знаю, как это комментировать.",
      "Семяниный Владимир Василькович: Это не ответ. Это крик о помощи.",
      "Семяниный Владимир Василькович: Единица. Идите готовиться заново.",
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
      lines: ["Ну чё, надумал чего?", "Время тикает, братан."],
    },
  },

  Sveta: {
    firstMeeting: {
      useScene: "svetaFortuneTalk",
    },

    conditional: [
      {
        condition: (state) => (state?.getValue("anxiety") ?? 0) > 70,
        dialogue: { useScene: "svetaConditionalHighAnxiety" },
      },
      {
        condition: (state) => (state?.getValue("preparation") ?? 0) > 80,
        dialogue: { useScene: "svetaConditionalHighPrep" },
      },
    ],

    progression: [
      {
        minTalks: 3,
        dialogue: { useScene: "svetaProgressionTalk3" },
      },
      {
        minTalks: 6,
        dialogue: { useScene: "svetaProgressionTalk6" },
      },
    ],

    repeat: [{ useScene: "svetaRepeat1" }, { useScene: "svetaRepeat2" }],

    rare: [
      {
        chance: 0.12,
        dialogue: { useScene: "svetaRareTalk" },
      },
    ],
  },

  Professor: {
    firstMeeting: {
      useScene: "professorTalk",
    },

    conditional: [
      {
        condition: (state) => (state?.getValue("preparation") ?? 0) < 30,
        dialogue: { useScene: "professorConditionalLowPrep" },
      },
      {
        condition: (state) => (state?.getValue("preparation") ?? 0) > 80,
        dialogue: { useScene: "professorConditionalHighPrep" },
      },
    ],

    progression: [
      {
        minTalks: 2,
        dialogue: { useScene: "professorProgressionTalk2" },
      },
      {
        minTalks: 5,
        dialogue: { useScene: "professorProgressionTalk5" },
      },
    ],

    repeat: [
      { useScene: "professorRepeat1" },
      { useScene: "professorRepeat2" },
    ],

    rare: [
      {
        chance: 0.08,
        dialogue: { useScene: "professorRareTalk" },
      },
    ],
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
      lines: ["Вокруг всё так же шумят.", "Все ждут своей участи."],
    },
  },

  exam_student: {
    firstMeeting: {
      useScene: "examStudentIntro",
    },
    repeat: {
      useScene: "examStudentRepeat",
    },
  },

  transition_girl: {
    firstMeeting: {
      useScene: "transitionAcquaintanceIntro",
    },
    repeat: {
      useScene: "transitionAcquaintanceReturn",
    },
  },

  Professor_audience: {
    firstMeeting: {
      useScene: "examTakeTicket",
    },
    repeat: {
      speaker: "Семяниный Владимир Василькович",
      lines: ["Берите билет и садитесь.", "Время не резиновое."],
    },
  },
};

