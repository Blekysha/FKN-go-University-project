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
    speaker: "Васька",
    lines: [
      "Васька остаётся сидеть у стола и открывает конспект.",
      "Семён всё так же валяется на кровати с телефоном.",
      "— Семён.",
      "— М?",
      "— У тебя бывает чувство, будто ты уже всё завалил, хотя ещё даже не вышел из комнаты?",
      "— Постоянно. Это называется стабильность.",
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
    speaker: "Семён",
    lines: [
      "— Ничего не помню вообще.",
      "— Отлично. Значит, мозг освободил место под новые знания.",
      "— Семён, это не помогает.",
      "— Зато звучит научно.",
      "Васька фыркает и всё-таки пролистывает пару страниц конспекта.",
      "Паника не исчезает полностью, но уже не давит так сильно.",
    ],
  },

  studyWithSemyonAdvice: {
    speaker: "Семён",
    lines: [
      "— Ты как обычно успокаиваешься перед важным?",
      "— Никак.",
      "— Супер совет.",
      "— Подожди. Я не закончил.",
      "— Я просто иду и страдаю. Но с уверенным лицом.",
      "— То есть стратегия — выглядеть так, будто всё под контролем?",
      "— Именно. Внутри пожар, снаружи студент.",
      "Васька невольно улыбается и делает пометку на полях конспекта.",
    ],
  },

  studyWithSemyonExplainTopic: {
    speaker: "Васька",
    lines: [
      "— Слушай. Я сейчас попробую объяснить тему вслух.",
      "— Я могу не слушать?",
      "— Можешь делать вид, что слушаешь.",
      "— Это я умею профессионально.",
      "Васька начинает объяснять тему простыми словами, сам себе спотыкаясь на формулировках.",
      "На середине становится ясно, где именно он путался.",
      "Семён поднимает палец, не отрываясь от телефона.",
      "— Вот сейчас звучало почти умно.",
      "— Почти?",
      "— Не наглей перед экзаменом.",
    ],
  },

  studyWithSemyonJoke: {
    speaker: "Васька",
    lines: [
      "— Если я не вернусь после экзамена, считай меня академически мёртвым.",
      "— Тогда можно я заберу твой чай?",
      "— Семён.",
      "— Что? Ты сам начал завещание.",
      "Васька смеётся, хотя до этого был уверен, что уже разучился.",
      "Учёбы от этого больше не становится, зато дышать становится легче.",
    ],
  },

  studyDeepTopic: {
    speaker: "Васька",
    lines: [
      "Ладно. Беру самую мерзкую тему.",
      "Если она попадётся — я хотя бы не умру сразу.",
      "*через несколько минут*",
      "Голова гудит, зато стало чуть понятнее.",
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
      { text: "Взяться за самую страшную тему", nextScene: "studyHardBreakdown" },
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
      "Пока побеждает она."
    ],
    choices: [
      {
        text: "Стиснуть зубы и продолжить",
        nextScene: "studyHardContinue",
        effects: [
          { type: "incCounter", id: "preparation", delta: 2 },
          { type: "incCounter", id: "fatigue", delta: 2 },
          { type: "incCounter", id: "anxiety", delta: 1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      { text: "Сдаться и включить компьютер", nextScene: "studyHardGiveUpComputer" },
      {
        text: "Поговорить с Семёном",
        nextScene: "studyHardTalkSemyon",
        effects: [
          { type: "incCounter", id: "social", delta: 1 },
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "setFlag", id: "studied_exam" },
          { type: "setValue", id: "currentGoal", value: "university" }
        ],
      },
      {
        text: "Сходить к Свете",
        nextScene: "studyHardGoSveta",
        effects: [{ type: "setValue", id: "currentGoal", value: "sveta" }],
      },
    ],
  },

  studyHardContinue: {
    speaker: "Васька",
    lines: [
      "Нет. Я хотя бы попробую.",
      "*через несколько минут*",
      "Понятнее не стало, но появились слова, которыми можно отбиваться.",
      "Если преподаватель будет милостив — этого хватит.",
      "Если нет — ну, я хотя бы страдал честно."
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
      state?.setValue("openComputerAfterDialogue", true);
    },
  },

  studyHardTalkSemyon: {
    speaker: "Васька",
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
      "Схожу к Свете.",
      "Она хотя бы говорит странно, но уверенно."
    ],
    nextScene: "goToSvetaAfterStudy",
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
      "Позанимался немного.",
      "Быстро заскочу к Свете, скажу спасибо и в универ.",
      "Без вариантов.",
    ],
  },

  svetaFortuneTalk: {
    speaker: "Света",
    lines: [
      "Впереди у стола стоит Света. В комнате пахнет чаем, свечами и чем-то травяным.",
      "О, Вась, привет! Подходи ко мне, чайник как раз вскипел.",
      "Васька подходит ближе и неловко оглядывается на стул.",
      "Васька: В общем, тут такое де...",
      "Стой. Не садись.",
      "Сегодня плохая примета. Лучше по возможности вообще не сидеть лишний раз.",
      "Звучит странно, я знаю. Но лучше не садись. По крайней мере не у меня.",
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
        text: "Спросить, какой билет брать",
        nextScene: "svetaTicketAdvice",
        effects: [
          { type: "incCounter", id: "preparation", delta: 1 },
          { type: "incCounter", id: "luck", delta: 1 },
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

  svetaTicketAdvice: {
    speaker: "Света",
    lines: [
      "Билет с интегралами не бери.",
      "Я не знаю, как это работает. Просто не бери.",
      "Если будет что-то с графиками или определениями — цепляйся за это.",
      "И не начинай ответ со слова «ну». Преподы это чувствуют, как акулы кровь.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.setFlag("can_choose_exam_ticket");
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("preparation", 1);
      state?.incCounter("anxiety", -1);
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
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("anxiety", -2);
      state?.incCounter("luck", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaJokeAfterFortune: {
    speaker: "Света",
    lines: [
      "Васька: То есть карты говорят, что я выживу?",
      "Света: Карты говорят, что ты драматизируешь.",
      "Васька: Это официальное заключение?",
      "Света: С печатью и свечкой.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
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
      state?.setFlag("heard_sveta_exam_advice");
      state?.incCounter("preparation", 1);
      state?.incCounter("confidence", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaHonestFear: {
    speaker: "Света",
    lines: [
      "Васька: Мне реально страшно.",
      "Света некоторое время молчит и уже без шутки смотрит на него.",
      "Света: Тогда не делай вид, что нет.",
      "Света: Страх не исчезает от понтов. Он просто становится громче.",
      "Света: Выпей чаю. Потом иди. Не победителем, не героем — просто собой.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("anxiety", -3);
      state?.incCounter("social", 1);
      state?.incCounter("sveta_relation", 2);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaLeaveFast: {
    speaker: "Света",
    lines: [
      "Света: Убегаешь?",
      "Васька: Тактическое отступление.",
      "Света: Тогда тактически не садись сегодня лишний раз.",
      "Васька: Опять это?",
      "Света: Особенно это.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.setValue("currentGoal", "university");
    },
  },

  svetaFortuneSkeptic: {
    speaker: "Света",
    lines: [
      "Света: Не веришь — нормально.",
      "Света: Приметы не обязаны нравиться, чтобы портить настроение.",
      "Васька: Очень убедительно.",
      "Света: Я старалась быть максимально раздражающей.",
      "Света: Но если без шуток — не накручивай себя у двери. Там все будут шуметь. Не впитывай чужую панику.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
      state?.incCounter("anxiety", 1);
      state?.incCounter("preparation", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaTea: {
    speaker: "Света",
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
      state?.setFlag("heard_sveta_no_sitting_advice");
      state?.incCounter("anxiety", -3);
      state?.incCounter("fatigue", -1);
      state?.incCounter("sveta_relation", 1);
      state?.setValue("currentGoal", "university");
    },
  },

  svetaFortuneTalkAfterStudy: {
    speaker: "Света",
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
    speaker: "Света",
    lines: [
      "Света: Чай быстрый. Без церемоний.",
      "Васька: Быстрый чай звучит подозрительно.",
      "Света: Быстрый чай — это когда ты пьёшь и не задаёшь вопросов.",
      "Света: Ты подготовился лучше, чем думаешь. Теперь главное — не спалить себя паникой.",
    ],
    onComplete: (state) => {
      state?.setFlag("visited_sveta");
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
    speaker: "Васька",
    lines: [
      "Можно посидеть пару минут на подоконнике.",
      "В коридоре тихо, за окном обычный день, которому вообще всё равно на экзамены.",
    ],
    choices: [
      {
        text: "Сесть и немного выдохнуть",
        nextScene: "windowRestSit",
        effects: [
          { type: "incCounter", id: "anxiety", delta: -1 },
          { type: "incCounter", id: "fatigue", delta: -1 },
        ],
      },
      {
        text: "Не задерживаться и идти дальше",
        nextScene: "windowRestSkip",
        effects: [{ type: "incCounter", id: "confidence", delta: 1 }],
      },
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

  /* ===== КОРИДОР УНИВЕРСИТЕТА И ЭКЗАМЕН ===== */

  professorEntranceTalk: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Александр Евгеньевич стоит у двери и запускает студентов по одному.",
      "Вокруг шумят, кто-то листает конспект, кто-то делает вид, что ему не страшно.",
      "Профессор замечает Ваську.",
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
    speaker: "Александр Евгеньевич",
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
    speaker: "Александр Евгеньевич",
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
    speaker: "Александр Евгеньевич",
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
    speaker: "Александр Евгеньевич",
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
    speaker: "Александр Евгеньевич",
    lines: [
      "Фамилия?",
      "Васька: Петров.",
      "Александр Евгеньевич кивает на стопку билетов.",
      "Берите билет. Потом садитесь за парту и готовьтесь.",
      "Только без разговоров и героических страданий вслух.",
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
    speaker: "Александр Евгеньевич",
    lines: [
      "Петров, вы билет взяли не для красоты.",
      "Сначала готовитесь за партой, потом отвечаете.",
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
    speaker: "Александр Евгеньевич",
    lines: [
      "Начинайте, Петров.",
      "Васька делает вдох и начинает отвечать.",
      "Где-то он говорит уверенно, где-то цепляется за формулировки, где-то спасается тем, что помнит чужие советы.",
      "Александр Евгеньевич слушает молча. Это хуже, чем если бы перебивал.",
      "Достаточно. Сейчас скажу результат.",
    ],
    onComplete: (state) => {
      state?.setFlag("exam_defended");
    },
  },

  finalExamSummary: {
    speaker: "Система",
    lines: ["Экзамен завершён.", "Дальше будет финальная сцена проекта."],
  },


  examStudentMoodGood: {
    speaker: "Студент",
    lines: [
      "Ты ещё ждёшь?",
      "Сегодня вроде можно выдохнуть.",
      "Александр Евгеньевич не то чтобы добрый, но хотя бы не кусается.",
      "Одного даже выслушал до конца. Это уже праздник."
    ],
    onComplete: (state) => {
      state?.setFlag("heard_teacher_mood_rumor");
    },
  },

  examStudentMoodNeutral: {
    speaker: "Студент",
    lines: [
      "Ну... как обычно.",
      "Не улыбается, но и молниями не стреляет.",
      "Если отвечать по делу — жить можно.",
      "Если начать нести чушь — он это быстро почувствует."
    ],
    onComplete: (state) => {
      state?.setFlag("heard_teacher_mood_rumor");
    },
  },

  examStudentMoodBad: {
    speaker: "Студент",
    lines: [
      "Я бы на твоём месте не расслаблялся.",
      "Он сегодня какой-то злой.",
      "Не орёт, но смотрит так, будто уже всё понял.",
      "Короче, лучше отвечай чётко и без воды."
    ],
    onComplete: (state) => {
      state?.setFlag("heard_teacher_mood_rumor");
      state?.incCounter("anxiety", 1);
    },
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
    speaker: "Александр Евгеньевич",
    lines: [
      "*пристально смотрит*",
      "Я вижу этот взгляд.",
      "Вы даже не пытались подготовиться, да?",
      "Зачем тогда пришли? Адреналин ловить?",
    ],
  },

  professorConditionalHighPrep: {
    speaker: "Александр Евгеньевич",
    lines: [
      "*поднимает бровь*",
      "Хм.",
      "Редкий случай.",
      "Студент, который реально готов.",
      "Не разочаруйте меня, Петров.",
    ],
  },

  professorProgressionTalk2: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Вы часто попадаетесь мне на глаза.",
      "Это может быть хорошо...",
      "…а может — не очень.",
    ],
  },

  professorProgressionTalk5: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Я наблюдаю за вами, Петров.",
      "И знаете...",
      "в вас есть что-то.",
      "Возможно, потенциал.",
    ],
  },

  professorRareTalk: {
    speaker: "Александр Евгеньевич",
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
    speaker: "Александр Евгеньевич",
    lines: ["Вы что-то хотели?", "Говорите по делу, я не на чаепитии."],
  },

  professorRepeat2: {
    speaker: "Александр Евгеньевич",
    lines: ["Время идёт.", "Вы его тратите, я тоже."],
  },

  professorTalk: {
    speaker: "Александр Евгеньевич",
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
    speaker: "Александр Евгеньевич",
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
      "Пауза длится так долго, что Васька успевает мысленно умереть два раза.",
      "Отлично, Петров.",
      "Ответ уверенный, структура есть, лишнего почти нет.",
      "Пятёрка. Свободны.",
    ],
  },

  endingGood: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Неплохо.",
      "Были неточности, но вы не потерялись и по существу ответили.",
      "Четвёрка. Идите.",
    ],
  },

  endingNormal: {
    speaker: "Александр Евгеньевич",
    lines: [
      "На троечку, Петров.",
      "Местами путались, но видно, что хоть за что-то держались.",
      "Тройка. Следующий.",
    ],
  },

  endingEdge: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Петров...",
      "Это слабый ответ.",
      "Очень слабый.",
      "Двойка. На пересдачу подготовьтесь уже по-настоящему.",
    ],
  },

  endingFail: {
    speaker: "Александр Евгеньевич",
    lines: ["Пересдача.", "Следующий."],
  },

  endingDisaster: {
    speaker: "Александр Евгеньевич",
    lines: [
      "Петров...",
      "Я даже не знаю, как это комментировать.",
      "Это не ответ. Это крик о помощи.",
      "Единица. Идите готовиться заново.",
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
      useScene: "examStudentMoodByState",
    },
    repeat: {
      useScene: "examStudentRepeat",
    },
  },

  Professor_audience: {
    firstMeeting: {
      useScene: "examTakeTicket",
    },
    repeat: {
      speaker: "Александр Евгеньевич",
      lines: ["Берите билет и садитесь.", "Время не резиновое."],
    },
  },
};
