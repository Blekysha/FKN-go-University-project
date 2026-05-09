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
    { onComplete = null, minSkipDelayMs = 450, charDelayMs = 55, linePauseMs = 320, showRestartButton = false } = {}
  ) {
    const root = document.getElementById("blackScreen");
    const textEl = document.getElementById("blackScreenText");
    const hintEl = document.getElementById("blackScreenHint");
    const restartBtn = document.getElementById("restartGameBtn");

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

    let lineIndex = 0;
    let charIndex = 0;
    let canClose = false;
    let closed = false;
    let timerId = null;
    const renderedLines = [];
    const canFastForwardAt = Date.now() + 1000;

    textEl.textContent = "";
    if (restartBtn) {
      restartBtn.hidden = true;
      restartBtn.onclick = null;
    }
    if (hintEl) {
      hintEl.textContent = "...";
      hintEl.style.opacity = "0.25";
    }

    root.style.display = "flex";
    root.setAttribute("aria-hidden", "false");

    const clearTimer = () => {
      if (timerId != null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    };

    const render = () => {
      const currentLine = lines[lineIndex] ?? "";
      const currentVisible = currentLine.slice(0, charIndex);
      textEl.textContent = [...renderedLines, currentVisible].join("\n");
    };

    const revealControls = () => {
      canClose = true;
      if (showRestartButton && restartBtn) {
        restartBtn.hidden = false;
        restartBtn.onclick = () => window.location.reload();
      }
      if (hintEl) {
        hintEl.textContent = showRestartButton ? "Начать заново?" : "Space / Enter — дальше";
        hintEl.style.opacity = "0.65";
      }
    };

    const finishTyping = () => {
      clearTimer();
      textEl.textContent = lines.join("\n");
      lineIndex = lines.length;
      charIndex = 0;
      revealControls();
    };

    const close = () => {
      if (!canClose || closed) return;
      closed = true;
      clearTimer();
      window.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("click", close);

      root.style.display = "none";
      root.setAttribute("aria-hidden", "true");
      root.classList.remove("is-playing", "is-focused-game");
      textEl.textContent = "";
      if (restartBtn) {
        restartBtn.hidden = true;
        restartBtn.onclick = null;
      }
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

    const tick = () => {
      if (closed) return;

      if (lineIndex >= lines.length) {
        timerId = window.setTimeout(revealControls, minSkipDelayMs);
        return;
      }

      const currentLine = lines[lineIndex];
      charIndex += 1;
      render();

      if (charIndex >= currentLine.length) {
        renderedLines.push(currentLine);
        lineIndex += 1;
        charIndex = 0;
        timerId = window.setTimeout(tick, linePauseMs);
        return;
      }

      timerId = window.setTimeout(tick, charDelayMs);
    };

    const onKeyDown = (e) => {
      if (e.code !== "Space" && e.code !== "Enter") return;
      e.preventDefault();

      if (Date.now() < canFastForwardAt) {
        return;
      }

      if (!canClose) {
        finishTyping();
        return;
      }

      close();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    root.addEventListener("click", close);
    timerId = window.setTimeout(tick, 300);
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
    const pauseEl = document.getElementById("computerGamePause");
    const overEl = document.getElementById("computerGameOver");
    const gameTitleEl = document.getElementById("miniGameTitle");
    const bestEl = document.getElementById("miniGameBest");
    const startBtn = document.getElementById("miniGameStart");
    const backBtn = document.getElementById("miniGameBack");
    const pauseBackBtn = document.getElementById("miniGamePauseBack");
    const resumeBtn = document.getElementById("miniGameResume");
    const pauseToMenuBtn = document.getElementById("miniGamePauseToMenu");
    const retryBtn = document.getElementById("miniGameRetry");
    const toMenuBtn = document.getElementById("miniGameToMenu");
    const resultTitleEl = document.getElementById("miniGameResultTitle");
    const resultTextEl = document.getElementById("miniGameResultText");
    const canvas = document.getElementById("miniGameCanvas");
    const scoreEl = document.getElementById("miniGameScore");
    const livesEl = document.getElementById("miniGameLives");
    const infoEl = document.getElementById("miniGameInfo");

    if (!root || !canvas || !closeBtn || !menuEl || !introEl || !playEl || !overEl) {
      console.warn("[interactionSystem] Не найдены DOM-элементы компьютерного меню.");
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

    const subtitles = {
      snake: "Ешь точки и не врезайся",
      catch: "Лови падающие мячики",
      pong: "Отбивай мяч платформой",
    };

    const session = {
      playedAny: false,
      totalScore: 0,
      scores: { snake: 0, catch: 0, pong: 0 },
    };

    let selectedGame = null;
    let gameStop = null;
    let gameController = null;
    let closed = false;
    let lastScore = 0;

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
      if (pauseEl) pauseEl.hidden = screen !== "pause";
      overEl.hidden = screen !== "over";

      root.classList.toggle("is-playing", screen === "play");
      root.classList.toggle("is-focused-game", screen === "intro" || screen === "play" || screen === "pause" || screen === "over");
    }

    function setHeader(title, subtitle) {
      if (titleEl) titleEl.textContent = title;
      if (subtitleEl) subtitleEl.textContent = subtitle;
    }

    function updateHud(score, lives, hint) {
      if (scoreEl) scoreEl.textContent = `Очки: ${score}`;

      if (livesEl) {
        livesEl.innerHTML = "";

        if (lives == null) {
          livesEl.style.display = "none";
        } else {
          livesEl.style.display = "flex";
          const full = Math.max(0, lives);
          for (let i = 0; i < 3; i += 1) {
            const dot = document.createElement("span");
            dot.className = i < full ? "life-dot" : "life-dot empty";
            livesEl.appendChild(dot);
          }
        }
      }

      if (infoEl) infoEl.textContent = hint;
    }

    function drawBackground() {
      ctx.fillStyle = "#050509";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;

      for (let x = 0; x < W; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      for (let y = 0; y < H; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    function stopCurrentGame({ saveScore = false } = {}) {
      if (gameController && saveScore) {
        lastScore = gameController.getScore?.() ?? lastScore;
      }

      if (typeof gameStop === "function") {
        gameStop();
      }

      gameStop = null;
      gameController = null;
    }

    function recordScore(gameType, score) {
      session.playedAny = true;
      session.totalScore += score;
      session.scores[gameType] = Math.max(session.scores[gameType] ?? 0, score);
      setBestScore(gameType, score);
    }

    function finishGame(score) {
      const gameType = selectedGame;
      stopCurrentGame();

      lastScore = score;
      recordScore(gameType, score);

      setHeader(titles[gameType], "Раунд завершён");
      if (resultTitleEl) resultTitleEl.textContent = "Игра окончена";
      if (resultTextEl) {
        resultTextEl.textContent = `Счёт: ${score}. Лучший счёт: ${getBestScore(gameType)}.`;
      }

      setScreen("over");
    }

    function showMenu() {
      stopCurrentGame({ saveScore: false });
      selectedGame = null;
      setHeader("Компьютер", "Выберите игру");
      setScreen("menu");
    }

    function showIntro(gameType) {
      stopCurrentGame({ saveScore: false });
      selectedGame = gameType;
      lastScore = 0;

      setHeader(titles[gameType], "");
      if (gameTitleEl) gameTitleEl.textContent = titles[gameType];
      if (bestEl) bestEl.textContent = `Лучший счёт: ${getBestScore(gameType)}`;

      setScreen("intro");
    }

    function pauseGameToAsk() {
      if (!gameController) return;
      gameController.pause?.();
      setHeader(titles[selectedGame], "Пауза");
      setScreen("pause");
    }

    function resumeGame() {
      if (!gameController) return;
      setHeader(titles[selectedGame], "");
      setScreen("play");
      gameController.resume?.();
    }

    function returnToMenuFromPause() {
      stopCurrentGame({ saveScore: false });
      showMenu();
    }

    function startSelectedGame() {
      if (!selectedGame) return;

      stopCurrentGame({ saveScore: false });
      setHeader(titles[selectedGame], "");
      setScreen("play");

      if (selectedGame === "snake") {
        gameStop = runSnake();
      } else if (selectedGame === "catch") {
        gameStop = runCatch();
      } else if (selectedGame === "pong") {
        gameStop = runPong();
      }
    }

    function closeComputer() {
      if (closed) return;
      closed = true;

      stopCurrentGame({ saveScore: false });

      root.style.display = "none";
      root.setAttribute("aria-hidden", "true");
      root.classList.remove("is-playing", "is-focused-game");

      miniGameActive = false;
      miniGameCleanup = null;

      playerSprite.setVisible(true);
      if (playerSprite.body) playerSprite.body.enable = true;

      menuEl.querySelectorAll("[data-game]").forEach((btn) => {
        btn.removeEventListener("click", onGameCardClick);
      });

      closeBtn.removeEventListener("click", closeComputer);
      startBtn?.removeEventListener("click", startSelectedGame);
      backBtn?.removeEventListener("click", showMenu);
      pauseBackBtn?.removeEventListener("click", pauseGameToAsk);
      resumeBtn?.removeEventListener("click", resumeGame);
      pauseToMenuBtn?.removeEventListener("click", returnToMenuFromPause);
      retryBtn?.removeEventListener("click", startSelectedGame);
      toMenuBtn?.removeEventListener("click", showMenu);

      applyComputerSessionEffects(session);
      onComplete?.(session);
    }

    function onGameCardClick(e) {
      const gameType = e.currentTarget.dataset.game;
      showIntro(gameType);
    }

    function runSnake() {
      const cell = 20;
      let snake = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
      let dir = { x: 1, y: 0 };
      let nextDir = { x: 1, y: 0 };
      let food = { x: 14, y: 8 };
      let score = 0;
      let lives = 1;
      let paused = false;
      let stopped = false;
      let stepTimer = null;
      let lastInputAt = 0;

      function spawnFood() {
        const cols = Math.floor(W / cell);
        const rows = Math.floor(H / cell);

        do {
          food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
          };
        } while (snake.some((p) => p.x === food.x && p.y === food.y));
      }

      function resetPositionAfterHit() {
        snake = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
        dir = { x: 1, y: 0 };
        nextDir = { x: 1, y: 0 };
      }

      function onKeyDown(e) {
        const code = e.code;
        const now = performance.now();
        if (now - lastInputAt < 28) return;
        lastInputAt = now;

        let candidate = null;

        if (code === "ArrowLeft" || code === "KeyA") candidate = { x: -1, y: 0 };
        if (code === "ArrowRight" || code === "KeyD") candidate = { x: 1, y: 0 };
        if (code === "ArrowUp" || code === "KeyW") candidate = { x: 0, y: -1 };
        if (code === "ArrowDown" || code === "KeyS") candidate = { x: 0, y: 1 };

        if (!candidate) return;

        e.preventDefault();

        if (candidate.x === -dir.x && candidate.y === -dir.y) return;
        nextDir = candidate;
      }

      function draw() {
        drawBackground();

        ctx.fillStyle = "#67d17a";
        for (const part of snake) {
          ctx.fillRect(part.x * cell + 2, part.y * cell + 2, cell - 4, cell - 4);
        }

        ctx.fillStyle = "#f0c45d";
        ctx.beginPath();
        ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, 7, 0, Math.PI * 2);
        ctx.fill();

        updateHud(score, null, "WASD / стрелки — поворот змейки");
      }

      function tick() {
        if (stopped) return;

        if (paused) {
          stepTimer = window.setTimeout(tick, 90);
          return;
        }

        dir = nextDir;

        const cols = Math.floor(W / cell);
        const rows = Math.floor(H / cell);
        const head = {
          x: snake[0].x + dir.x,
          y: snake[0].y + dir.y,
        };

        const hitWall =
          head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
        const hitSelf = snake.some((p) => p.x === head.x && p.y === head.y);

        if (hitWall || hitSelf) {
          finishGame(score);
          return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          score += 1;
          spawnFood();
        } else {
          snake.pop();
        }

        draw();
        stepTimer = window.setTimeout(tick, 135);
      }

      window.addEventListener("keydown", onKeyDown, { passive: false });
      spawnFood();
      draw();
      tick();

      gameController = {
        pause() {
          paused = true;
        },
        resume() {
          paused = false;
        },
        getScore() {
          return score;
        },
      };

      return () => {
        stopped = true;
        if (stepTimer != null) window.clearTimeout(stepTimer);
        window.removeEventListener("keydown", onKeyDown);
      };
    }

    function runCatch() {
      let basketX = W / 2 - 38;
      let score = 0;
      let lives = 3;
      let balls = [];
      let keys = {};
      let stopped = false;
      let paused = false;
      let lastSpawn = 0;
      let animationId = null;

      function onKeyDown(e) {
        if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(e.code)) {
          e.preventDefault();
          keys[e.code] = true;
        }
      }

      function onKeyUp(e) {
        keys[e.code] = false;
      }

      function spawnBall() {
        balls.push({
          x: 20 + Math.random() * (W - 40),
          y: -12,
          r: 8,
          speed: 1.7 + Math.random() * 1.4,
        });
      }

      function loop(t) {
        if (stopped) return;

        if (paused) {
          animationId = requestAnimationFrame(loop);
          return;
        }

        if (keys.ArrowLeft || keys.KeyA) basketX -= 4;
        if (keys.ArrowRight || keys.KeyD) basketX += 4;
        basketX = Math.max(0, Math.min(W - 76, basketX));

        if (t - lastSpawn > 760) {
          spawnBall();
          lastSpawn = t;
        }

        drawBackground();

        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.fillRect(basketX, H - 28, 76, 12);
        ctx.fillRect(basketX + 8, H - 18, 60, 8);

        ctx.fillStyle = "rgba(255,255,255,0.54)";
        for (const b of balls) {
          b.y += b.speed;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        }

        balls = balls.filter((b) => {
          const caught =
            b.y + b.r >= H - 30 &&
            b.x >= basketX &&
            b.x <= basketX + 76;

          if (caught) {
            score += 1;
            return false;
          }

          if (b.y - b.r > H) {
            lives -= 1;
            return false;
          }

          return true;
        });

        updateHud(score, lives, "A/D или стрелки — двигать корзинку");

        if (lives <= 0) {
          finishGame(score);
          return;
        }

        animationId = requestAnimationFrame(loop);
      }

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);
      animationId = requestAnimationFrame(loop);

      gameController = {
        pause() {
          paused = true;
        },
        resume() {
          paused = false;
        },
        getScore() {
          return score;
        },
      };

      return () => {
        stopped = true;
        cancelAnimationFrame(animationId);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
    }

    function runPong() {
      let paddleX = W / 2 - 42;
      let ballX = W / 2;
      let ballY = H / 2;
      let vx = 2.4;
      let vy = -2.8;
      let score = 0;
      let lives = 3;
      let keys = {};
      let stopped = false;
      let paused = false;
      let animationId = null;

      function onKeyDown(e) {
        if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(e.code)) {
          e.preventDefault();
          keys[e.code] = true;
        }
      }

      function onKeyUp(e) {
        keys[e.code] = false;
      }

      function resetBall() {
        ballX = 24 + Math.random() * (W - 48);
        ballY = 28 + Math.random() * 36;
        vx = Math.random() > 0.5 ? 2.4 : -2.4;
        vy = 2.8;
      }

      function loop() {
        if (stopped) return;

        if (paused) {
          animationId = requestAnimationFrame(loop);
          return;
        }

        if (keys.ArrowLeft || keys.KeyA) paddleX -= 4.5;
        if (keys.ArrowRight || keys.KeyD) paddleX += 4.5;
        paddleX = Math.max(0, Math.min(W - 84, paddleX));

        ballX += vx;
        ballY += vy;

        if (ballX <= 8 || ballX >= W - 8) vx *= -1;
        if (ballY <= 8) vy *= -1;

        const hitPaddle =
          ballY >= H - 34 &&
          ballY <= H - 20 &&
          ballX >= paddleX &&
          ballX <= paddleX + 84 &&
          vy > 0;

        if (hitPaddle) {
          vy *= -1.04;
          vx += (ballX - (paddleX + 42)) / 42;
          score += 1;
        }

        if (ballY > H + 12) {
          lives -= 1;
          if (lives <= 0) {
            finishGame(score);
            return;
          }
          resetBall();
        }

        drawBackground();

        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(paddleX, H - 24, 84, 10);

        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();

        updateHud(score, lives, "A/D или стрелки — двигать платформу");
        animationId = requestAnimationFrame(loop);
      }

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);
      resetBall();
      animationId = requestAnimationFrame(loop);

      gameController = {
        pause() {
          paused = true;
        },
        resume() {
          paused = false;
        },
        getScore() {
          return score;
        },
      };

      return () => {
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
    pauseBackBtn?.addEventListener("click", pauseGameToAsk);
    resumeBtn?.addEventListener("click", resumeGame);
    pauseToMenuBtn?.addEventListener("click", returnToMenuFromPause);
    retryBtn?.addEventListener("click", startSelectedGame);
    toMenuBtn?.addEventListener("click", showMenu);

    miniGameCleanup = closeComputer;
    showMenu();
  }

  function openStudyDeskChoice() {
    dialogueUI.onChoice = (choice) => {
      story?.applyEffects(choice.effects);

      if (choice.action === "study") {
        dialogueManager.startScene("studySelfChoice");
        return;
      }

      if (choice.action === "studyWithSemyon") {
        dialogueManager.startScene("studyWithSemyon");
        return;
      }

      if (choice.action === "studyDeepTopic") {
        dialogueManager.startScene("studyDeepTopic");
        return;
      }

      if (choice.action === "computer") {
        openComputerMenu({
          onComplete: (session) => {
            if (session?.playedAny) {
              dialogueManager.startScene("afterComputerGame");
            }
          },
        });
      }
    };

    dialogueUI.show({
      speaker: "Васька",
      lines: [
        "Так... стол, конспекты и компьютер.",
        "Если уж садиться, надо решить, как тратить время.",
      ],
      choices: [
        { text: "Учиться самому", action: "study" },
        {
          text: "Окликнуть Семёна и поговорить, пока учишься",
          action: "studyWithSemyon",
        },
        {
          text: "Углубиться в самую сложную тему",
          action: "studyDeepTopic",
          effects: [
            { type: "incCounter", id: "preparation", delta: 2 },
            { type: "incCounter", id: "fatigue", delta: 2 },
            { type: "incCounter", id: "anxiety", delta: 1 },
            { type: "setFlag", id: "studied_exam" },
            { type: "setValue", id: "currentGoal", value: "university" },
          ],
        },
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
      const playedComputer = state.hasFlag("played_computer_game");

      if (!studied && !visitedSveta && !playedComputer) {
        dialogueUI.show({
          speaker: "Васька",
          lines: [
            "Надо сначала что-то решить.",
            "Либо подготовиться, либо зайти к Свете, либо хотя бы отвлечься за компом.",
          ],
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

    if (!id) return;

    if (id === "studyDesk") {
      if (!state.hasFlag("met_Semyon")) {
        dialogueManager.startScene("needTalkToSemyonBeforeStudyDesk");
        return;
      }

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

      if (state.getValue("currentGoal") !== "study") {
        dialogueManager.startScene("needChooseStudyBeforeStudyDesk");
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
        minSkipDelayMs: 500,
        lineDelayMs: 450,
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
              const toneLines = {
                5: [
                  "Экзамен закончен.",
                  "Оценка: 5.",
                  "Васька выходит из аудитории почти спокойно.",
                  "Не потому что день был лёгким. Потому что он выдержал его до конца.",
                ],
                4: [
                  "Экзамен закончен.",
                  "Оценка: 4.",
                  "Ошибки были, но ответ получился живым.",
                  "Васька выходит с ощущением, что всё было не зря.",
                ],
                3: [
                  "Экзамен закончен.",
                  "Оценка: 3.",
                  "Не красиво. Не уверенно. Но сдано.",
                  "Иногда этого достаточно, чтобы наконец выдохнуть.",
                ],
                2: [
                  "Экзамен закончен.",
                  "Оценка: 2.",
                  "Васька выходит из аудитории и смотрит в пол.",
                  "День оказался честнее, чем хотелось.",
                ],
                1: [
                  "Экзамен закончен.",
                  "Скрытый провал.",
                  "Преподаватель видел разное, но к такому ответу готов не был.",
                  "Васька выходит с мыслью, что пересдача — это ещё мягко сказано.",
                ],
              };

              const finalLines = [
                ...(toneLines[grade] ?? toneLines[3]),
                "",
                "Вот так и закончился экзамен.",
                "Конец игры",
              ];

              showBlackScreen(finalLines, {
                onComplete: null,
                minSkipDelayMs: 1600,
                charDelayMs: 26,
                linePauseMs: 520,
                showRestartButton: true,
              });
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
