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
  let lastAutoSceneMapKey = null;
  let previousAutoSceneMapKey = null;

  function spendTime(amount = 1) {
    state?.incCounter("timeSpent", amount);
  }

  function getAdvanceHintText(action = "дальше") {
    return window.isMobileControlsDevice
      ? `Тап — ${action}`
      : `Space / Enter — ${action}`;
  }

  function showBlackScreen(
    text,
    {
      onComplete = null,
      minSkipDelayMs = 180,
      charDelayMs = 75,
      linePauseMs = 260,
      showRestartButton = false,
    } = {}
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
    let isTypingLine = false;
    let nextInputAllowedAt = Date.now() + 500;
    const renderedLines = [];

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
        hintEl.textContent = showRestartButton
          ? "Начать заново?"
          : getAdvanceHintText("дальше");
        hintEl.style.opacity = "0.65";
      }
    };

    const finishCurrentLine = () => {
      clearTimer();

      const currentLine = lines[lineIndex] ?? "";
      if (lineIndex < lines.length) {
        if (renderedLines[renderedLines.length - 1] !== currentLine) {
          renderedLines.push(currentLine);
        }

        lineIndex += 1;
      }

      charIndex = 0;
      isTypingLine = false;
      textEl.textContent = renderedLines.join("\n");
      nextInputAllowedAt = Date.now() + 250;

      if (lineIndex >= lines.length) {
        timerId = window.setTimeout(revealControls, minSkipDelayMs);
      } else if (hintEl) {
        hintEl.textContent = getAdvanceHintText("дальше");
        hintEl.style.opacity = "0.65";
      }
    };

    const close = () => {
      if (showRestartButton) return;
      if (!canClose || closed) return;

      closed = true;
      clearTimer();
      window.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("pointerdown", onPointerAdvance);
      root.removeEventListener("touchstart", onPointerAdvance);
      root.removeEventListener("click", onPointerAdvance);

      root.style.display = "none";
      root.setAttribute("aria-hidden", "true");
      root.classList.remove("is-playing", "is-focused-game");
      textEl.textContent = "";
      if (restartBtn) {
        restartBtn.hidden = true;
        restartBtn.onclick = null;
      }
      if (hintEl) {
        hintEl.textContent = getAdvanceHintText("дальше");
        hintEl.style.opacity = "0.65";
      }

      playerSprite.setVisible(true);
      if (playerSprite.body) {
        playerSprite.body.enable = true;
      }

      blackScreenActive = false;
      onComplete?.();
    };

    const typeLine = () => {
      if (closed) return;

      if (lineIndex >= lines.length) {
        revealControls();
        return;
      }

      isTypingLine = true;
      canClose = false;
      if (hintEl) {
        hintEl.textContent = getAdvanceHintText("допечатать");
        hintEl.style.opacity = "0.45";
      }

      const currentLine = lines[lineIndex] ?? "";

      // Пустой абзац сразу добавляется как пауза/разделитель.
      if (currentLine.length === 0) {
        renderedLines.push("");
        lineIndex += 1;
        charIndex = 0;
        isTypingLine = false;
        render();
        nextInputAllowedAt = Date.now() + 180;
        if (lineIndex >= lines.length) {
          timerId = window.setTimeout(revealControls, minSkipDelayMs);
        } else {
          timerId = window.setTimeout(typeLine, linePauseMs);
        }
        return;
      }

      const step = () => {
        if (closed) return;

        const line = lines[lineIndex] ?? "";
        charIndex += 1;
        render();

        if (charIndex >= line.length) {
          finishCurrentLine();
          return;
        }

        let delay = charDelayMs;
        const lastChar = line[charIndex - 1];
        if (lastChar === "." || lastChar === "!" || lastChar === "?")
          delay += 55;
        if (lastChar === "," || lastChar === "—") delay += 25;
        if (lastChar === "…") delay += 80;

        timerId = window.setTimeout(step, delay);
      };

      timerId = window.setTimeout(step, charDelayMs);
    };

    const advance = () => {
      if (Date.now() < nextInputAllowedAt) return;

      if (isTypingLine) {
        finishCurrentLine();
        return;
      }

      if (lineIndex < lines.length) {
        clearTimer();
        typeLine();
        return;
      }

      if (showRestartButton) return;

      close();
    };

    const onKeyDown = (e) => {
      if (e.code !== "Space" && e.code !== "Enter") return;
      e.preventDefault();
      advance();
    };

    const onPointerAdvance = (e) => {
      if (e.target === restartBtn) return;
      e.preventDefault?.();
      advance();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    root.addEventListener("pointerdown", onPointerAdvance);
    root.addEventListener("touchstart", onPointerAdvance, { passive: false });
    root.addEventListener("click", onPointerAdvance);

    timerId = window.setTimeout(typeLine, 250);
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
    state?.incCounter("timeSpent", 2);

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

    let mobileGameControlsEl = document.getElementById(
      "mobileMiniGameControls"
    );
    if (!mobileGameControlsEl) {
      mobileGameControlsEl = document.createElement("div");
      mobileGameControlsEl.id = "mobileMiniGameControls";
      mobileGameControlsEl.innerHTML = `
        <button type="button" data-dir="up" aria-label="Вверх">↑</button>
        <button type="button" data-dir="left" aria-label="Влево">←</button>
        <button type="button" data-dir="down" aria-label="Вниз">↓</button>
        <button type="button" data-dir="right" aria-label="Вправо">→</button>
      `;
      playEl?.appendChild(mobileGameControlsEl);
    }

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

    function getCanvasX(event) {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches?.[0] ?? event.changedTouches?.[0] ?? event;
      const ratio = W / rect.width;
      return (touch.clientX - rect.left) * ratio;
    }

    function getCanvasSwipe(event, start) {
      const rect = canvas.getBoundingClientRect();
      const touch = event.changedTouches?.[0] ?? event;
      const ratioX = W / rect.width;
      const ratioY = H / rect.height;

      return {
        dx: (touch.clientX - start.x) * ratioX,
        dy: (touch.clientY - start.y) * ratioY,
      };
    }

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
      root.classList.toggle(
        "is-focused-game",
        screen === "intro" ||
          screen === "play" ||
          screen === "pause" ||
          screen === "over"
      );

      if (mobileGameControlsEl) {
        mobileGameControlsEl.hidden = !(
          window.isMobileControlsDevice &&
          screen === "play" &&
          selectedGame === "snake"
        );
      }
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
        resultTextEl.textContent = `Счёт: ${score}. Лучший счёт: ${getBestScore(
          gameType
        )}.`;
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
      let snake = [
        { x: 8, y: 7 },
        { x: 7, y: 7 },
        { x: 6, y: 7 },
      ];
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
        snake = [
          { x: 8, y: 7 },
          { x: 7, y: 7 },
          { x: 6, y: 7 },
        ];
        dir = { x: 1, y: 0 };
        nextDir = { x: 1, y: 0 };
      }

      function setSnakeDirection(candidate) {
        const now = performance.now();
        if (now - lastInputAt < 28) return;
        lastInputAt = now;

        if (!candidate) return;
        if (candidate.x === -dir.x && candidate.y === -dir.y) return;

        nextDir = candidate;
      }

      function onKeyDown(e) {
        const code = e.code;
        let candidate = null;

        if (code === "ArrowLeft" || code === "KeyA")
          candidate = { x: -1, y: 0 };
        if (code === "ArrowRight" || code === "KeyD")
          candidate = { x: 1, y: 0 };
        if (code === "ArrowUp" || code === "KeyW") candidate = { x: 0, y: -1 };
        if (code === "ArrowDown" || code === "KeyS") candidate = { x: 0, y: 1 };

        if (!candidate) return;
        e.preventDefault();
        setSnakeDirection(candidate);
      }

      let touchStart = null;

      function onTouchStart(e) {
        const touch = e.touches?.[0];
        if (!touch) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        touchStart = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }

      function onTouchMove(e) {
        e.preventDefault();
      }

      function onTouchEnd(e) {
        if (!touchStart) return;
        e.preventDefault();

        const swipe = getCanvasSwipe(e, touchStart);
        touchStart = null;

        if (Math.max(Math.abs(swipe.dx), Math.abs(swipe.dy)) < 5) return;

        if (Math.abs(swipe.dx) > Math.abs(swipe.dy)) {
          setSnakeDirection({ x: swipe.dx > 0 ? 1 : -1, y: 0 });
        } else {
          setSnakeDirection({ x: 0, y: swipe.dy > 0 ? 1 : -1 });
        }
      }

      function onMobileControl(e) {
        const dirName = e.currentTarget?.dataset?.dir;
        if (!dirName) return;

        e.preventDefault();
        e.stopPropagation();

        const dirs = {
          left: { x: -1, y: 0 },
          right: { x: 1, y: 0 },
          up: { x: 0, y: -1 },
          down: { x: 0, y: 1 },
        };

        setSnakeDirection(dirs[dirName]);
      }

      function draw() {
        drawBackground();

        for (let i = snake.length - 1; i >= 0; i -= 1) {
          const part = snake[i];
          const t = snake.length <= 1 ? 0 : i / (snake.length - 1);

          // Голова темнее, хвост светлее: так легче понять направление.
          const r = Math.round(42 + t * 70);
          const g = Math.round(132 + t * 92);
          const b = Math.round(72 + t * 48);

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(
            part.x * cell + 2,
            part.y * cell + 2,
            cell - 4,
            cell - 4
          );

          if (i === 0) {
            ctx.fillStyle = "rgba(0,0,0,0.28)";
            ctx.fillRect(
              part.x * cell + 5,
              part.y * cell + 5,
              cell - 10,
              cell - 10
            );
          }
        }

        ctx.fillStyle = "#f0c45d";
        ctx.beginPath();
        ctx.arc(
          food.x * cell + cell / 2,
          food.y * cell + cell / 2,
          7,
          0,
          Math.PI * 2
        );
        ctx.fill();

        updateHud(
          score,
          null,
          window.isMobileControlsDevice
            ? "Управление — стрелками"
            : "WASD / стрелки — поворот змейки"
        );
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
      canvas.addEventListener("touchstart", onTouchStart, { passive: false });
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
      canvas.addEventListener("touchend", onTouchEnd, { passive: false });
      mobileGameControlsEl?.querySelectorAll("[data-dir]")?.forEach((btn) => {
        btn.addEventListener("click", onMobileControl);
        btn.addEventListener("touchstart", onMobileControl, { passive: false });
      });
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
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);
        mobileGameControlsEl?.querySelectorAll("[data-dir]")?.forEach((btn) => {
          btn.removeEventListener("click", onMobileControl);
          btn.removeEventListener("touchstart", onMobileControl);
        });
      };
    }

    function runCatch() {
      let basketX = W / 2 - 38;
      let targetBasketX = basketX;
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

      function moveBasketToCanvasX(x) {
        targetBasketX = Math.max(0, Math.min(W - 76, x - 38));
      }

      function onTouchMove(e) {
        e.preventDefault();
        moveBasketToCanvasX(getCanvasX(e));
      }

      function onTouchStart(e) {
        e.preventDefault();
        moveBasketToCanvasX(getCanvasX(e));
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

        if (keys.ArrowLeft || keys.KeyA) targetBasketX -= 4;
        if (keys.ArrowRight || keys.KeyD) targetBasketX += 4;
        targetBasketX = Math.max(0, Math.min(W - 76, targetBasketX));

        // На телефоне корзинка плавно догоняет палец, а не телепортируется.
        basketX += (targetBasketX - basketX) * 0.28;

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
            b.y + b.r >= H - 30 && b.x >= basketX && b.x <= basketX + 76;

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

        updateHud(
          score,
          lives,
          window.isMobileControlsDevice
            ? "Веди пальцем по полю — двигать корзинку"
            : "A/D или стрелки — двигать корзинку"
        );

        if (lives <= 0) {
          finishGame(score);
          return;
        }

        animationId = requestAnimationFrame(loop);
      }

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);
      canvas.addEventListener("touchstart", onTouchStart, { passive: false });
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
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
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
      };
    }

    function runPong() {
      let paddleX = W / 2 - 42;
      let targetPaddleX = paddleX;
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

      function movePaddleToCanvasX(x) {
        targetPaddleX = Math.max(0, Math.min(W - 84, x - 42));
      }

      function onTouchMove(e) {
        e.preventDefault();
        movePaddleToCanvasX(getCanvasX(e));
      }

      function onTouchStart(e) {
        e.preventDefault();
        movePaddleToCanvasX(getCanvasX(e));
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

        if (keys.ArrowLeft || keys.KeyA) targetPaddleX -= 4.5;
        if (keys.ArrowRight || keys.KeyD) targetPaddleX += 4.5;
        targetPaddleX = Math.max(0, Math.min(W - 84, targetPaddleX));

        // На телефоне платформа плавно догоняет палец, а не телепортируется.
        paddleX += (targetPaddleX - paddleX) * 0.3;

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

        updateHud(
          score,
          lives,
          window.isMobileControlsDevice
            ? "Веди пальцем по полю — двигать платформу"
            : "A/D или стрелки — двигать платформу"
        );
        animationId = requestAnimationFrame(loop);
      }

      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.addEventListener("keyup", onKeyUp);
      canvas.addEventListener("touchstart", onTouchStart, { passive: false });
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
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
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
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
        dialogueManager.startScene("studyHardBreakdown");
        return;
      }

      if (choice.action === "computer") {
        openComputerMenu({
          onComplete: (session) => {
            if (session?.playedAny) {
              dialogueManager.startScene("afterComputerGameDecision");
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
        },
        { text: "Поиграть", action: "computer" },
      ],
    });
  }

  function updateExamLatenessFlags() {
    const timeSpent = state.getCounter("timeSpent");

    if (timeSpent >= 7) {
      state.setFlag("very_late_to_exam");
      state.setFlag("late_to_exam");
      return;
    }

    if (timeSpent >= 4) {
      state.setFlag("late_to_exam");
    }
  }

  function hideLateCorridorNpcs() {
    const npcs = levelManager.getNpcs?.();
    const zones = npcs?.zones?.getChildren?.() ?? [];

    zones.forEach((zone) => {
      const npcId = zone?.npcData?.npcId ?? "";
      const objectName = zone?.npcData?.objectName ?? "";
      const textureKey = zone?.npcData?.sprite?.texture?.key ?? "";

      const isExamStudent =
        npcId === "exam_student" ||
        npcId === "npc_exam_student" ||
        objectName === "exam_student" ||
        objectName === "npc_exam_student" ||
        textureKey === "npc_exam_student";

      const isCrowdStudents =
        npcId === "crowd_students" ||
        npcId === "npc_crowd_students" ||
        objectName === "crowd_students" ||
        objectName === "npc_crowd_students" ||
        textureKey === "npc_crowd_students";

      if (
        (state.hasFlag("very_late_to_exam") &&
          (isExamStudent || isCrowdStudents)) ||
        (state.hasFlag("late_to_exam") && isExamStudent)
      ) {
        zone.npcData?.sprite?.destroy?.();
        zone.destroy?.();
      }
    });
  }

  function checkMapAutoScenes() {
    const mapKey = levelManager.getCurrentMapKey?.() ?? null;
    if (!mapKey || mapKey === lastAutoSceneMapKey) return;

    previousAutoSceneMapKey = lastAutoSceneMapKey;
    lastAutoSceneMapKey = mapKey;

    if (mapKey === "room_Sveta") {
      if (!state.hasFlag("sveta_room_intro_seen")) {
        state.setFlag("sveta_room_intro_seen");
        dialogueUI.show({
          speaker: "",
          lines: [
            "Впереди у стола стоит Света.",
            "В комнате пахнет чаем, свечами и чем-то травяным.",
            "Кажется, она сразу заметила Ваську.",
          ],
        });
        return;
      }
    }

    if (mapKey === "perehod") {
      if (state.hasFlag("transition_acquaintance_left")) return;

      if (!state.hasFlag("met_transition_acquaintance")) {
        dialogueManager.startScene("transitionAcquaintanceIntro");
        return;
      }

      if (
        previousAutoSceneMapKey === "corridor" &&
        state.hasFlag("met_transition_acquaintance") &&
        !state.hasFlag("transition_acquaintance_return_seen")
      ) {
        state.setFlag("transition_acquaintance_return_seen");
        dialogueManager.startScene("transitionAcquaintanceReturn");
        return;
      }
    }

    if (mapKey === "university_corridor") {
      state.setFlag("transition_acquaintance_left");
      updateExamLatenessFlags();

      const timeSpent = state.getCounter("timeSpent");

      if (!state.hasFlag("entered_university_corridor_once")) {
        state.setFlag("entered_university_corridor_once");

        if (state.hasFlag("very_late_to_exam")) {
          hideLateCorridorNpcs();
          dialogueManager.startScene("universityCorridorVeryLateArrival");
          return;
        }

        if (state.hasFlag("late_to_exam")) {
          hideLateCorridorNpcs();
          dialogueManager.startScene("universityCorridorLateArrival");
          return;
        }

        dialogueManager.startScene("universityCorridorArrival");
        return;
      }

      if (state.hasFlag("late_to_exam")) {
        hideLateCorridorNpcs();
      }
    }
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

    const goesToSvetaRoom =
      doorId === "svetaDoor" || d?.targetMap === "room_Sveta";

    if (goesToSvetaRoom) {
      const goal = state.getValue("currentGoal");

      if (goal !== "sveta") {
        dialogueUI.show({
          speaker: "",
          lines: [
            "Сейчас лучше не идти к Свете.",
            "Васька уже решил заняться другим.",
          ],
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

      dialogueManager.startScene(
        state.hasFlag("late_to_exam")
          ? "audienceLateEntry"
          : "audienceTimeSkip",
        {
          onComplete: () => {
            state.setFlag("entered_audience");
            state.setValue("currentGoal", "exam");
            if (d?.targetMap === "university_corridor") {
              updateExamLatenessFlags();
            }

            levelManager.load(d.targetMap, d.targetSpawn);
          },
        }
      );

      return;
    }

    if (["wrongDoor", "stairsDoor", "leftDormDoor"].includes(doorId)) {
      dialogueManager.startScene("wrongDoor");
      return;
    }

    if (d.locked && !inventory.has(d.keyId)) {
      dialogueUI.show({
        speaker: "Система",
        lines: ["Заперто. Нужно найти ключ."],
      });
      return;
    }

    if (d?.targetMap === "university_corridor") {
      updateExamLatenessFlags();
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

    if (id === "tetruDoor") {
      dialogueManager.startScene("tetruDoorMemory");
      return;
    }

    if (id === "universityStairs") {
      dialogueManager.startScene("universityStairsNoNeed");
      return;
    }

    if (id === "universitySchedule") {
      dialogueManager.startScene("universityScheduleBoard");
      return;
    }

    if (id === "coffeeMachine") {
      dialogueManager.startScene("coffeeMachineBroken");
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
        ...(state.hasFlag("very_late_to_exam")
          ? [
              "Времени почти не осталось.",
              "Семяниный Владимир Василькович уже явно ждёт, когда это закончится.",
              "Васька торопливо смотрит в билет и цепляется за первые знакомые слова.",
              "Ответ складывается наспех — не так, как хотелось, но лучше, чем молчать.",
            ]
          : state.hasFlag("late_to_exam")
          ? [
              "Времени меньше, чем должно быть.",
              "Васька быстро пробегает глазами билет.",
              "Мысли путаются сильнее обычного, но постепенно ответ всё-таки собирается.",
            ]
          : [
              "Перед ним билет, черновик и несколько минут на подготовку.",
              "Мысли путаются, но постепенно ответ складывается в голове.",
            ]),
      ];

      showBlackScreen(deskLines, {
        minSkipDelayMs: 220,
        linePauseMs: 360,
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

    if (
      item.itemData?.type === "key" ||
      id.toLowerCase().includes("key") ||
      id.toLowerCase().includes("ключ")
    ) {
      dialogueUI.show({
        speaker: "",
        lines: ["Опа, а вот и ключик!"],
      });
      return;
    }

    dialogueUI.show({
      speaker: "",
      lines: [`Получен предмет: ${id}`],
    });
  }

  // НПС
  function handleNpc(npcId) {
    if (npcId === "ProfessorEntrance") {
      if (state.hasFlag("very_late_to_exam")) {
        if (state.hasFlag("talked_professor_entrance")) {
          dialogueManager.startScene("professorEntranceVeryLateRepeat");
        } else {
          dialogueManager.startScene("professorEntranceVeryLate");
        }
      } else {
        dialogueManager.startNpc(npcId);
      }
      return;
    }

    if (npcId === "crowd_students") {
      if (state.hasFlag("very_late_to_exam")) return;
      dialogueManager.startNpc(npcId);
      return;
    }

    if (npcId === "transition_girl") {
      if (state.hasFlag("transition_acquaintance_left")) {
        dialogueManager.startScene("transitionAcquaintanceGone");
      } else if (state.hasFlag("met_transition_acquaintance")) {
        dialogueManager.startScene("transitionAcquaintanceReturn");
      } else {
        dialogueManager.startScene("transitionAcquaintanceIntro");
      }
      return;
    }

    if (npcId === "Professor_audience") {
      if (state.hasFlag("exam_finished")) {
        dialogueManager.startScene("examAlreadyFinished");
        return;
      }

      if (!state.hasFlag("got_exam_ticket")) {
        const teacherMood = state.getValue("teacherMood", "neutral");

        if (state.hasFlag("very_late_to_exam") && teacherMood === "bad") {
          dialogueManager.startScene("examRefusedVeryLateBadMood", {
            onComplete: () => {
              state.setFlag("exam_finished");
              state.setValue("lastExamGrade", 2);
              state.setValue("lastExamEnding", "endingEdge");

              showBlackScreen(
                [
                  "Экзамен закончился, даже не начавшись.",
                  "Оценка: 2.",
                  "",
                  "Семяниный был не в настроении.",
                  "А Васька пришёл слишком поздно.",
                  "",
                  "Вот так и закончился экзамен.",
                  "Конец игры",
                ],
                { showRestartButton: true, charDelayMs: 90, linePauseMs: 360 }
              );
            },
          });
          return;
        }

        if (state.hasFlag("very_late_to_exam")) {
          dialogueManager.startScene("examTakeTicketVeryLate");
        } else if (state.hasFlag("late_to_exam")) {
          dialogueManager.startScene("examTakeTicketLate");
        } else {
          dialogueManager.startScene("examTakeTicket");
        }
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
              const isVeryLate = state.hasFlag("very_late_to_exam");
              const isLate = state.hasFlag("late_to_exam");
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

              const lateLines = isVeryLate
                ? [
                    "",
                    "Опоздание слишком сильно испортило впечатление.",
                    "Даже хороший ответ уже не мог спасти ситуацию полностью.",
                  ]
                : isLate
                ? [
                    "",
                    "Опоздание Семяниный явно заметил.",
                    "И, конечно, не забыл.",
                  ]
                : [];

              const finalLines = [
                ...(toneLines[grade] ?? toneLines[3]),
                ...lateLines,
                "",
                "Вот так и закончился экзамен.",
                "Конец игры",
              ];

              showBlackScreen(finalLines, {
                onComplete: null,
                minSkipDelayMs: 1600,
                charDelayMs: 90,
                linePauseMs: 520,
                showRestartButton: true,
              });
            },
          });
        },
      });
      return;
    }

    if (npcId === "exam_student" && state.hasFlag("very_late_to_exam")) {
      return;
    }

    dialogueManager.startNpc(npcId);
  }

  /* ===== НАЖАТИЕ E ===== */

  function handleInteract() {
    const mobile = window.mobileInput ?? {};
    const mobileInteract = !!mobile.interact;

    if (!Phaser.Input.Keyboard.JustDown(keyE) && !mobileInteract) return;

    if (mobileInteract) {
      mobile.interact = false;
    }

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

  function enforceLateCorridorNpcsHidden() {
    const mapKey = levelManager.getCurrentMapKey?.() ?? null;
    if (
      mapKey === "university_corridor" &&
      state.hasFlag("very_late_to_exam")
    ) {
      hideLateCorridorNpcs();
    }
  }

  function update() {
    checkMapAutoScenes();
    enforceLateCorridorNpcsHidden();

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
