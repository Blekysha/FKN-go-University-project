import { dialogueUI } from "./dialogueUI.js";

export function createInteractionSystem(
  scene,
  {
    playerSprite,
    keyE,
    hint,
    inventory,
    levelManager,
    dialogueManager,
    state,
    story,
  }
) {
  let currentItem = null;
  let currentDoor = null;
  let currentNpc = null;
  let blackScreenActive = false;
  let miniGameActive = false;
  let miniGameCleanup = null;

  function showBlackScreen(
    text,
    { onComplete = null, minSkipDelayMs = 1200, lineDelayMs = 900 } = {}
  ) {
    const root = document.getElementById("blackScreen");
    const textEl = document.getElementById("blackScreenText");
    const hintEl = document.getElementById("blackScreenHint");

    if (!root || !textEl) {
      console.warn(
        "[interactionSystem] Не найден #blackScreen или #blackScreenText."
      );
      onComplete?.();
      return;
    }

    blackScreenActive = true;
    playerSprite.setVelocity(0);
    playerSprite.setVisible(false);
    if (playerSprite.body) {
      playerSprite.body.enable = false;
    }

    const lines = Array.isArray(text)
      ? text.map(String)
      : String(text).split("\n");
    const shownLines = [];
    let index = 0;
    let canClose = false;
    let closed = false;
    let timers = [];

    textEl.textContent = "";
    if (hintEl) {
      hintEl.textContent = "...";
      hintEl.style.opacity = "0.25";
    }

    root.style.display = "flex";
    root.setAttribute("aria-hidden", "false");

    const cleanupTimers = () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      timers = [];
    };

    const close = () => {
      if (!canClose || closed) return;
      closed = true;
      cleanupTimers();
      window.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("click", close);

      root.style.display = "none";
      root.setAttribute("aria-hidden", "true");
      textEl.textContent = "";
      if (hintEl) {
        hintEl.textContent = "Space / Enter — дальше";
        hintEl.style.opacity = "0.65";
      }

      playerSprite.setVisible(true);
      if (playerSprite.body) {
        playerSprite.body.enable = true;
      }

      blackScreenActive = false;
      onComplete?.();
    };

    const revealNextLine = () => {
      if (closed) return;

      if (index < lines.length) {
        shownLines.push(lines[index]);
        textEl.textContent = shownLines.join("\n");
        index += 1;
        timers.push(window.setTimeout(revealNextLine, lineDelayMs));
        return;
      }

      timers.push(
        window.setTimeout(() => {
          canClose = true;
          if (hintEl) {
            hintEl.textContent = "Space / Enter — дальше";
            hintEl.style.opacity = "0.65";
          }
        }, minSkipDelayMs)
      );
    };

    const onKeyDown = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    root.addEventListener("click", close);
    timers.push(window.setTimeout(revealNextLine, 250));
  }

  function getBestScore(gameType) {
    return Number(state?.getValue(`best_${gameType}_score`, 0) ?? 0);
  }

  function setBestScore(gameType, score) {
    const current = getBestScore(gameType);
    if (score > current) {
      state?.setValue(`best_${gameType}_score`, score);
    }
  }

  function applyComputerSessionEffects(session) {
    if (!session?.playedAny) return;

    state?.setFlag("played_computer_game");
    state?.setValue("currentGoal", "university");
    state?.setValue("computerGameStats", {
      snake: session.scores.snake,
      catch: session.scores.catch,
      pong: session.scores.pong,
      totalScore: session.totalScore,
    });

    // Игры разгружают голову, но съедают время и силы.
    state?.incCounter("anxiety", -1);
    state?.incCounter("fatigue", 2);

    if (session.scores.snake > 0) state?.incCounter("social", 1);
    if (session.scores.catch >= 5) state?.incCounter("luck", 1);
    if (session.scores.pong >= 5) state?.incCounter("anxiety", -1);
  }

  function openComputerMenu({ onComplete = null } = {}) {
    const root = document.getElementById("miniGameOverlay");
    const closeBtn = document.getElementById("miniGameClose");
    const titleEl = document.getElementById("computerTitle");
    const subtitleEl = document.getElementById("computerSubtitle");
    const menuEl = document.getElementById("computerMenu");
    const introEl = document.getElementById("computerGameIntro");
    const playEl = document.getElementById("computerGamePlay");
    const overEl = document.getElementById("computerGameOver");
    const gameTitleEl = document.getElementById("miniGameTitle");
    const bestEl = document.getElementById("miniGameBest");
    const startBtn = document.getElementById("miniGameStart");
    const backBtn = document.getElementById("miniGameBack");
    const retryBtn = document.getElementById("miniGameRetry");
    const toMenuBtn = document.getElementById("miniGameToMenu");
    const resultTitleEl = document.getElementById("miniGameResultTitle");
    const resultTextEl = document.getElementById("miniGameResultText");
    const canvas = document.getElementById("miniGameCanvas");
    const scoreEl = document.getElementById("miniGameScore");
    const livesEl = document.getElementById("miniGameLives");
    const infoEl = document.getElementById("miniGameInfo");

    if (
      !root ||
      !canvas ||
      !closeBtn ||
      !menuEl ||
      !introEl ||
      !playEl ||
      !overEl
    ) {
      console.warn(
        "[interactionSystem] Не найдены DOM-элементы компьютерного меню."
      );
      onComplete?.({ playedAny: false });
      return;
    }

    if (miniGameCleanup) miniGameCleanup();

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const titles = {
      snake: "Змейка",
      catch: "Ловля мячиков",
      pong: "Отбей мяч",
    };

    const session = {
      playedAny: false,
      totalScore: 0,
      scores: { snake: 0, catch: 0, pong: 0 },
    };

    let selectedGame = null;
    let gameStop = null;
    let lastScore = 0;
    let closed = false;

    miniGameActive = true;
    playerSprite.setVelocity(0);
    playerSprite.setVisible(false);
    if (playerSprite.body) playerSprite.body.enable = false;

    root.style.display = "flex";
    root.setAttribute("aria-hidden", "false");

    function setScreen(screen) {
      menuEl.hidden = screen !== "menu";
      introEl.hidden = screen !== "intro";
      playEl.hidden = screen !== "play";
      overEl.hidden = screen !== "over";
    }

    function setHeader(title, subtitle) {
      if (titleEl) titleEl.textContent = title;
      if (subtitleEl) subtitleEl.textContent = subtitle;
    }

    function drawBackground() {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    function updateHud(score, lives, hint) {
      if (scoreEl) scoreEl.textContent = `Очки: ${score}`;
      if (livesEl) {
        const full = Math.max(0, lives);
        const empty = Math.max(0, 3 - full);
        livesEl.textContent = "●".repeat(full) + "○".repeat(empty);
      }
      if (infoEl) infoEl.textContent = hint;
    }

    function stopCurrentGame() {
      if (typeof gameStop === "function") {
        gameStop();
        gameStop = null;
      }
    }

    function finishGame(reason, score) {
      stopCurrentGame();
      lastScore = score;
      session.playedAny = true;
      session.totalScore += score;
      session.scores[selectedGame] = Math.max(
        session.scores[selectedGame] ?? 0,
        score
      );
      setBestScore(selectedGame, score);

      setHeader(titles[selectedGame], "Раунд завершён");
      if (resultTitleEl)
        resultTitleEl.textContent =
          reason === "closed" ? "Игра остановлена" : "Игра окончена";
      if (resultTextEl) {
        resultTextEl.textContent = `Счёт: ${score}. Лучший счёт: ${getBestScore(
          selectedGame
        )}.`;
      }
      setScreen("over");
    }

    function showMenu() {
      stopCurrentGame();
      selectedGame = null;
      setHeader("Компьютер", "Выберите игру");
      setScreen("menu");
    }

    function showIntro(gameType) {
      stopCurrentGame();
      selectedGame = gameType;
      setHeader(titles[gameType], "Перед запуском");
      if (gameTitleEl) gameTitleEl.textContent = titles[gameType];
      if (bestEl) bestEl.textContent = `Лучший счёт: ${getBestScore(gameType)}`;
      setScreen("intro");
    }

    function closeComputer() {
      if (closed) return;
      closed = true;
      stopCurrentGame();
      closeBtn.removeEventListener("click", closeComputer);
      startBtn?.removeEventListener("click", startSelectedGame);
      backBtn?.removeEventListener("click", showMenu);
      retryBtn?.removeEventListener("click", startSelectedGame);
      toMenuBtn?.removeEventListener("click", showMenu);
      menuEl.querySelectorAll("[data-game]").forEach((btn) => {
        btn.removeEventListener("click", onGameCardClick);
      });

      root.style.display = "none";
      root.setAttribute("aria-hidden", "true");
      playerSprite.setVisible(true);
      if (playerSprite.body) playerSprite.body.enable = true;
      miniGameActive = false;
      miniGameCleanup = null;

      if (session.playedAny) {
        applyComputerSessionEffects(session);
        dialogueManager.startScene("afterComputerGame");
      }

      onComplete?.(session);
    }

    function onGameCardClick(e) {
      const gameType = e.currentTarget.dataset.game;
      showIntro(gameType);
    }

    function startSelectedGame() {
      if (!selectedGame) return;
      setHeader(titles[selectedGame], "Игра идёт");
      setScreen("play");
      if (selectedGame === "snake")
        gameStop = startSnake((reason, score) => finishGame(reason, score));
      else if (selectedGame === "catch")
        gameStop = startCatch((reason, score) => finishGame(reason, score));
      else gameStop = startPong((reason, score) => finishGame(reason, score));
    }

    function startSnake(done) {
      const cell = 15;
      const cols = Math.floor(W / cell);
      const rows = Math.floor(H / cell);
      let snake = [
        { x: 8, y: 8 },
        { x: 7, y: 8 },
        { x: 6, y: 8 },
      ];
      let dir = { x: 1, y: 0 };
      let queuedDir = { x: 1, y: 0 };
      let food = { x: 14, y: 9 };
      let score = 0;
      let stopped = false;
      let intervalId = null;

      const placeFood = () => {
        do {
          food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
          };
        } while (snake.some((part) => part.x === food.x && part.y === food.y));
      };

      const setDirection = (next) => {
        if (next.x + dir.x === 0 && next.y + dir.y === 0) return;
        queuedDir = next;
      };

      const onKeyDown = (e) => {
        if (
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "KeyW",
            "KeyA",
            "KeyS",
            "KeyD",
          ].includes(e.code)
        ) {
          e.preventDefault();
        }
        if (e.code === "ArrowLeft" || e.code === "KeyA")
          setDirection({ x: -1, y: 0 });
        if (e.code === "ArrowRight" || e.code === "KeyD")
          setDirection({ x: 1, y: 0 });
        if (e.code === "ArrowUp" || e.code === "KeyW")
          setDirection({ x: 0, y: -1 });
        if (e.code === "ArrowDown" || e.code === "KeyS")
          setDirection({ x: 0, y: 1 });
      };

      const draw = () => {
        drawBackground();
        ctx.fillStyle = "#f2d16b";
        ctx.fillRect(food.x * cell + 2, food.y * cell + 2, cell - 4, cell - 4);
        snake.forEach((part, idx) => {
          ctx.fillStyle = idx === 0 ? "#b8f28b" : "#7fcf75";
          ctx.fillRect(
            part.x * cell + 1,
            part.y * cell + 1,
            cell - 2,
            cell - 2
          );
        });
        updateHud(score, 1, "WASD / стрелки — повернуть змейку");
      };

      const tick = () => {
        dir = queuedDir;
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        const hitWall =
          head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
        const hitSelf = snake.some(
          (part) => part.x === head.x && part.y === head.y
        );
        if (hitWall || hitSelf) {
          done("lose", score);
          return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 1;
          placeFood();
        } else {
          snake.pop();
        }
        draw();
      };

      window.addEventListener("keydown", onKeyDown, { passive: false });
      draw();
      intervalId = window.setInterval(tick, 155);

      return () => {
        if (stopped) return;
        stopped = true;
        window.clearInterval(intervalId);
        window.removeEventListener("keydown", onKeyDown);
      };
    }

    function startCatch(done) {
      let basketX = W / 2 - 36;
      const basketW = 72;
      const basketY = H - 28;
      let lives = 3;
      let score = 0;
      const balls = [];
      let lastSpawn = 0;
      let animationId = null;
      let stopped = false;
      const keys = new Set();

      const onKeyDown = (e) => {
        if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(e.code))
          e.preventDefault();
        keys.add(e.code);
      };
      const onKeyUp = (e) => keys.delete(e.code);

      const loop = (time) => {
        if (stopped) return;
        if (keys.has("ArrowLeft") || keys.has("KeyA")) basketX -= 4.2;
        if (keys.has("ArrowRight") || keys.has("KeyD")) basketX += 4.2;
        basketX = Math.max(0, Math.min(W - basketW, basketX));

        if (time - lastSpawn > 900) {
          balls.push({
            x: 18 + Math.random() * (W - 36),
            y: -10,
            r: 8,
            vy: 1.8 + Math.random() * 1.1,
          });
          lastSpawn = time;
        }

        for (let i = balls.length - 1; i >= 0; i--) {
          const b = balls[i];
          b.y += b.vy;
          if (
            b.y + b.r >= basketY &&
            b.x >= basketX &&
            b.x <= basketX + basketW
          ) {
            score += 1;
            balls.splice(i, 1);
          } else if (b.y - b.r > H) {
            lives -= 1;
            balls.splice(i, 1);
            if (lives <= 0) {
              done("lose", score);
              return;
            }
          }
        }

        drawBackground();
        balls.forEach((b) => {
          ctx.fillStyle = "#f2d16b";
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = "#8fd1ff";
        ctx.fillRect(basketX, basketY, basketW, 12);
        ctx.fillRect(basketX + 8, basketY + 12, basketW - 16, 5);
        updateHud(score, lives, "A/D или стрелки — двигать корзинку");
        animationId = requestAnimationFrame(loop);
      };

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);
      animationId = requestAnimationFrame(loop);

      return () => {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(animationId);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
    }

    function startPong(done) {
      let paddleX = W / 2 - 46;
      const paddleW = 92;
      const paddleY = H - 25;
      let lives = 3;
      let score = 0;
      let ball = { x: W / 2, y: H / 2, vx: 2.4, vy: -2.6, r: 7 };
      const keys = new Set();
      let animationId = null;
      let stopped = false;

      const resetBall = () => {
        ball = {
          x: W / 2,
          y: H / 2,
          vx: Math.random() > 0.5 ? 2.4 : -2.4,
          vy: -2.6,
          r: 7,
        };
      };

      const onKeyDown = (e) => {
        if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(e.code))
          e.preventDefault();
        keys.add(e.code);
      };
      const onKeyUp = (e) => keys.delete(e.code);

      const loop = () => {
        if (stopped) return;
        if (keys.has("ArrowLeft") || keys.has("KeyA")) paddleX -= 4.8;
        if (keys.has("ArrowRight") || keys.has("KeyD")) paddleX += 4.8;
        paddleX = Math.max(0, Math.min(W - paddleW, paddleX));

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.r <= 0 || ball.x + ball.r >= W) ball.vx *= -1;
        if (ball.y - ball.r <= 0) ball.vy *= -1;

        if (
          ball.y + ball.r >= paddleY &&
          ball.x >= paddleX &&
          ball.x <= paddleX + paddleW &&
          ball.vy > 0
        ) {
          ball.vy *= -1;
          score += 1;
          const offset = (ball.x - (paddleX + paddleW / 2)) / (paddleW / 2);
          ball.vx = 2.6 * offset;
          if (score % 4 === 0) {
            ball.vx *= 1.08;
            ball.vy *= 1.08;
          }
        }

        if (ball.y - ball.r > H) {
          lives -= 1;
          if (lives <= 0) {
            done("lose", score);
            return;
          }
          resetBall();
        }

        drawBackground();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d1a8ff";
        ctx.fillRect(paddleX, paddleY, paddleW, 10);
        updateHud(score, lives, "A/D или стрелки — двигать платформу");
        animationId = requestAnimationFrame(loop);
      };

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);
      animationId = requestAnimationFrame(loop);

      return () => {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(animationId);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
    }

    menuEl.querySelectorAll("[data-game]").forEach((btn) => {
      btn.addEventListener("click", onGameCardClick);
    });
    closeBtn.addEventListener("click", closeComputer);
    startBtn?.addEventListener("click", startSelectedGame);
    backBtn?.addEventListener("click", showMenu);
    retryBtn?.addEventListener("click", startSelectedGame);
    toMenuBtn?.addEventListener("click", showMenu);

    miniGameCleanup = closeComputer;
    showMenu();
  }

  function openStudyDeskChoice() {
    dialogueUI.onChoice = (choice) => {
      if (choice.action === "study") {
        dialogueManager.startScene("studySession");
        return;
      }

      if (choice.action === "computer") {
        openComputerMenu();
      }
    };

    dialogueUI.show({
      speaker: "Васька",
      lines: [
        "Так... стол, конспекты и компьютер.",
        "Можно заняться подготовкой.",
        "А можно чуть-чуть отвлечься.",
      ],
      choices: [
        { text: "Готовиться к экзамену", action: "study" },
        { text: "Поиграть", action: "computer" },
      ],
    });
  }

  function findItem() {
    currentItem = null;

    const items = levelManager.getItems();
    if (!items) return;

    scene.physics.overlap(playerSprite, items, (_, it) => {
      currentItem = it;
    });
  }

  function findDoor() {
    currentDoor = null;

    const doors = levelManager.getDoors();
    if (!doors) return;

    scene.physics.overlap(playerSprite, doors, (_, doorZone) => {
      currentDoor = doorZone;
    });
  }

  function findNpc() {
    currentNpc = null;

    const npcs = levelManager.getNpcs();
    if (!npcs) return;

    scene.physics.overlap(playerSprite, npcs, (_, npcZone) => {
      currentNpc = npcZone;
    });
  }

  function updateHint() {
    if (currentItem) {
      hint.showAt(currentItem.x, currentItem.y - 14, "E");
      return;
    }

    if (currentDoor) {
      hint.showAt(
        currentDoor.x,
        currentDoor.y - currentDoor.height / 2 - 6,
        "E"
      );
      return;
    }

    if (currentNpc) {
      hint.showAt(currentNpc.x, currentNpc.y - currentNpc.height / 2 - 6, "E");
      return;
    }

    hint.hide();
  }

  function openSceneWithPlayerHidden(sceneId, { afterComplete = null } = {}) {
    if (dialogueUI.isOpen()) return;

    playerSprite.setVisible(false);
    if (playerSprite.body) {
      playerSprite.body.enable = false;
    }

    dialogueManager.startScene(sceneId, {
      onComplete: () => {
        playerSprite.setVisible(true);
        if (playerSprite.body) {
          playerSprite.body.enable = true;
        }

        afterComplete?.();
      },
    });
  }

  /* ===== ТУАЛЕТ ===== */

  function useToilet() {
    if (state.hasFlag("visited_toilet")) {
      dialogueManager.startScene("toiletAlreadyUsed");
      return;
    }

    openSceneWithPlayerHidden("toiletEvent", {
      afterComplete: () => {
        const goal = state.getValue("currentGoal");
        if (goal === "toilet") {
          dialogueManager.startScene("afterToiletChoice");
        }
      },
    });
  }

  /* ===== ДВЕРИ ===== */

  function handleDoor(d) {
    const doorId = d?.doorId ?? null;
    const currentMapKey = levelManager.getCurrentMapKey?.() ?? null;

    if (currentMapKey === "audience" && !state.hasFlag("exam_finished")) {
      dialogueManager.startScene("cannotLeaveAudienceYet");
      return;
    }

    if (doorId === "toiletDoor") {
      useToilet();
      return;
    }

    if (!state.hasFlag("met_Semyon")) {
      dialogueManager.startScene("needTalkToSemyonBeforeExit");
      return;
    }

    if (doorId === "svetaDoor") {
      const alreadyVisitedSveta = state.hasFlag("visited_sveta");
      const goal = state.getValue("currentGoal");

      if (!alreadyVisitedSveta && goal !== "sveta") {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Сейчас лучше заняться другим."],
        });
        return;
      }
    }

    if (doorId === "exitDormDoor") {
      const studied = state.hasFlag("studied_exam");
      const visitedSveta = state.hasFlag("visited_sveta");

      if (!studied && !visitedSveta) {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Надо сначала либо подготовиться, либо зайти к Свете."],
        });
        return;
      }
    }

    if (doorId === "audienceDoor") {
      if (!state.hasFlag("talked_professor_corridor")) {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Сначала надо поговорить с преподавателем."],
        });
        return;
      }

      dialogueManager.startScene("audienceTimeSkip", {
        onComplete: () => {
          state.setFlag("entered_audience");
          state.setValue("currentGoal", "exam");
          levelManager.load(d.targetMap, d.targetSpawn);
        },
      });

      return;
    }

    if (["wrongDoor", "stairsDoor", "leftDormDoor"].includes(doorId)) {
      dialogueManager.startScene("wrongDoor");
      return;
    }

    if (d.locked && !inventory.has(d.keyId)) {
      dialogueUI.show({
        speaker: "Система",
        lines: ["Заперто.", `Нужен ключ: ${d.keyId}`],
      });
      return;
    }

    levelManager.load(d.targetMap, d.targetSpawn);
  }

  /* ===== ПРЕДМЕТЫ ===== */

  function handleItem(item) {
    const id = item.itemData?.itemId;

    if (!state.hasFlag("met_Semyon")) {
      dialogueManager.startScene("needTalkToSemyonBeforeExit");
      return;
    }

    if (!id) return;

    if (id === "studyDesk") {
      if (state.hasFlag("played_computer_game")) {
        dialogueManager.startScene("studyDeskAfterComputerGame");
        return;
      }

      if (state.hasFlag("studied_exam")) {
        dialogueUI.show({
          speaker: "Васька",
          lines: ["Я уже позанимался."],
        });
        return;
      }

      openStudyDeskChoice();
      return;
    }

    if (id === "windowRest") {
      if (state.hasFlag("visited_window")) {
        dialogueManager.startScene("windowAlreadyUsed");
        return;
      }

      if (state.hasFlag("heard_sveta_no_sitting_advice")) {
        dialogueManager.startScene("windowRestWithSvetaAdvice");
        return;
      }

      dialogueManager.startScene("windowRestEvent");
      return;
    }

    if (id === "examDesk") {
      if (!state.hasFlag("got_exam_ticket")) {
        dialogueManager.startScene("needTakeTicketFirst");
        return;
      }

      if (state.hasFlag("exam_prepared_answer")) {
        dialogueManager.startScene("examDeskAlreadyUsed");
        return;
      }

      const deskLines = [
        ...(state.hasFlag("skipped_window_because_sveta")
          ? [
              "Ну и для чего я тогда не садился...",
              "Всё равно пришлось сесть за парту.",
            ]
          : []),
        "Васька садится за парту.",
        "Перед ним билет, черновик и несколько минут на подготовку.",
        "Мысли путаются, но постепенно ответ складывается в голове.",
      ];

      showBlackScreen(deskLines, {
        onComplete: () => {
          state.setFlag("exam_prepared_answer");
          dialogueManager.startScene("examAnswerPrepared");
        },
      });
      return;
    }

    inventory.add(id);

    item.destroy();
    currentItem = null;

    dialogueUI.show({
      speaker: "Система",
      lines: [`Получен предмет: ${id}`],
    });
  }

  // НПС
  function handleNpc(npcId) {
    if (npcId === "ProfessorEntrance") {
      dialogueManager.startNpc(npcId);
      return;
    }

    if (npcId === "crowd_students") {
      dialogueManager.startNpc(npcId);
      return;
    }

    if (npcId === "Professor_audience") {
      if (state.hasFlag("exam_finished")) {
        dialogueManager.startScene("examAlreadyFinished");
        return;
      }

      if (!state.hasFlag("got_exam_ticket")) {
        dialogueManager.startScene("examTakeTicket");
        return;
      }

      if (!state.hasFlag("exam_prepared_answer")) {
        dialogueManager.startScene("needSitAtExamDesk");
        return;
      }

      dialogueManager.startScene("examDefenseStart", {
        onComplete: () => {
          const result = story?.getExamOutcome?.() ?? null;
          if (!result) return;

          state.setFlag("exam_finished");

          dialogueManager.startScene(result.endingScene, {
            onComplete: () => {
              const grade = result.grade ?? "?";
              const resultLine =
                grade === 1
                  ? "Скрытый провал: знания Васьки приводят преподавателя в ужас."
                  : `Итоговая оценка: ${grade}.`;

              showBlackScreen(
                [
                  "Экзамен закончен.",
                  resultLine,
                  "Васька выходит из аудитории и наконец выдыхает.",
                  "Дальше здесь появятся финальные выводы по пройденному пути.",
                ],
                {
                  onComplete: () =>
                    dialogueManager.startScene("finalExamSummary"),
                  minSkipDelayMs: 1800,
                  lineDelayMs: 1000,
                }
              );
            },
          });
        },
      });
      return;
    }

    dialogueManager.startNpc(npcId);
  }

  /* ===== НАЖАТИЕ E ===== */

  function handleInteract() {
    if (!Phaser.Input.Keyboard.JustDown(keyE)) return;

    if (dialogueUI.isOpen() || blackScreenActive || miniGameActive) return;

    if (currentItem) {
      handleItem(currentItem);
      return;
    }

    if (currentDoor) {
      handleDoor(currentDoor.doorData);
      return;
    }

    if (currentNpc) {
      const npcId = currentNpc.npcData?.npcId;

      if (!npcId) {
        dialogueUI.show({
          speaker: "Система",
          lines: ["У NPC не задан npcId."],
        });
        return;
      }

      handleNpc(npcId);
    }
  }

  function update() {
    if (blackScreenActive || miniGameActive) {
      hint.hide();
      return;
    }

    findItem();
    findDoor();
    findNpc();

    updateHint();
    handleInteract();
  }

  return {
    update,
    isBusy() {
      return blackScreenActive || miniGameActive;
    },
  };
}
