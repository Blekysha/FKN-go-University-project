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



  function applyComputerGameEffects(gameType, result = {}) {
    state?.setFlag("played_computer_game");
    state?.setValue("playedComputerGameType", gameType);
    state?.setValue("lastComputerGameResult", result);

    // Общий смысл: Вася отдохнул эмоционально, но потерял время и устал.
    state?.incCounter("anxiety", -1);
    state?.incCounter("fatigue", 2);

    if (gameType === "snake") {
      state?.incCounter("social", 1);
    } else if (gameType === "catch") {
      state?.incCounter("luck", 1);
    } else if (gameType === "pong") {
      state?.incCounter("anxiety", -1);
      state?.incCounter("fatigue", 1);
    }
  }

  function showMiniGame(gameType, { onComplete = null } = {}) {
    const root = document.getElementById("miniGameOverlay");
    const canvas = document.getElementById("miniGameCanvas");
    const titleEl = document.getElementById("miniGameTitle");
    const infoEl = document.getElementById("miniGameInfo");
    const closeBtn = document.getElementById("miniGameClose");

    if (!root || !canvas || !closeBtn) {
      console.warn("[interactionSystem] Не найдены DOM-элементы мини-игры.");
      onComplete?.({ closed: true, score: 0 });
      return;
    }

    if (miniGameCleanup) miniGameCleanup();

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    let animationId = null;
    let intervalId = null;
    let closed = false;
    let score = 0;
    const keys = new Set();

    miniGameActive = true;
    playerSprite.setVelocity(0);
    playerSprite.setVisible(false);
    if (playerSprite.body) playerSprite.body.enable = false;

    root.style.display = "flex";
    root.setAttribute("aria-hidden", "false");

    const titles = {
      snake: "Змейка",
      catch: "Ловля мячиков",
      pong: "Отбей мяч",
    };

    titleEl.textContent = titles[gameType] ?? "Мини-игра";
    infoEl.textContent = "WASD / стрелки — управление. Крестик — выйти.";

    const clear = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, W, H);
    };

    const drawText = (text, y = H / 2) => {
      ctx.fillStyle = "#ffffffe2";
      ctx.font = "18px monospace";
      ctx.textAlign = "center";
      ctx.fillText(text, W / 2, y);
    };

    const finish = (reason = "end") => {
      if (closed) return;
      closed = true;
      if (animationId) cancelAnimationFrame(animationId);
      if (intervalId) window.clearInterval(intervalId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      closeBtn.removeEventListener("click", closeByButton);

      root.style.display = "none";
      root.setAttribute("aria-hidden", "true");

      playerSprite.setVisible(true);
      if (playerSprite.body) playerSprite.body.enable = true;

      miniGameActive = false;
      miniGameCleanup = null;
      onComplete?.({ reason, score });
    };

    miniGameCleanup = () => finish("cleanup");

    const closeByButton = () => finish("closed");

    const onKeyDown = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      keys.add(e.code);
    };

    const onKeyUp = (e) => keys.delete(e.code);

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    closeBtn.addEventListener("click", closeByButton);

    function startSnake() {
      const cell = 15;
      const cols = Math.floor(W / cell);
      const rows = Math.floor(H / cell);
      let snake = [{ x: 8, y: 8 }];
      let dir = { x: 1, y: 0 };
      let nextDir = { x: 1, y: 0 };
      let food = { x: 14, y: 9 };

      const placeFood = () => {
        food = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
        };
      };

      intervalId = window.setInterval(() => {
        if ((keys.has("ArrowLeft") || keys.has("KeyA")) && dir.x !== 1) nextDir = { x: -1, y: 0 };
        if ((keys.has("ArrowRight") || keys.has("KeyD")) && dir.x !== -1) nextDir = { x: 1, y: 0 };
        if ((keys.has("ArrowUp") || keys.has("KeyW")) && dir.y !== 1) nextDir = { x: 0, y: -1 };
        if ((keys.has("ArrowDown") || keys.has("KeyS")) && dir.y !== -1) nextDir = { x: 0, y: 1 };
        dir = nextDir;

        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        const hitWall = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
        const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);
        if (hitWall || hitSelf) {
          finish("lose");
          return;
        }

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 1;
          placeFood();
        } else {
          snake.pop();
        }

        clear();
        ctx.fillStyle = "#dddddd";
        ctx.fillRect(food.x * cell, food.y * cell, cell - 2, cell - 2);
        ctx.fillStyle = "#8fd18f";
        snake.forEach((part) => ctx.fillRect(part.x * cell, part.y * cell, cell - 2, cell - 2));
        infoEl.textContent = `Очки: ${score}. WASD / стрелки — управление. Крестик — выйти.`;
      }, 120);
    }

    function startCatch() {
      let basketX = W / 2 - 35;
      const basketW = 70;
      const basketY = H - 28;
      let lives = 3;
      const balls = [];
      let lastSpawn = 0;

      const loop = (time) => {
        if (keys.has("ArrowLeft") || keys.has("KeyA")) basketX -= 5;
        if (keys.has("ArrowRight") || keys.has("KeyD")) basketX += 5;
        basketX = Math.max(0, Math.min(W - basketW, basketX));

        if (time - lastSpawn > 650) {
          balls.push({ x: 15 + Math.random() * (W - 30), y: -10, r: 8, vy: 2.4 + Math.random() * 1.5 });
          lastSpawn = time;
        }

        for (let i = balls.length - 1; i >= 0; i--) {
          const b = balls[i];
          b.y += b.vy;
          if (b.y + b.r >= basketY && b.x >= basketX && b.x <= basketX + basketW) {
            score += 1;
            balls.splice(i, 1);
          } else if (b.y - b.r > H) {
            lives -= 1;
            balls.splice(i, 1);
            if (lives <= 0) {
              finish("lose");
              return;
            }
          }
        }

        clear();
        ctx.fillStyle = "#cfcfcf";
        balls.forEach((b) => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = "#8fd1ff";
        ctx.fillRect(basketX, basketY, basketW, 12);
        infoEl.textContent = `Поймано: ${score}. Жизни: ${lives}. A/D или стрелки — корзинка.`;
        animationId = requestAnimationFrame(loop);
      };
      animationId = requestAnimationFrame(loop);
    }

    function startPong() {
      let paddleX = W / 2 - 45;
      const paddleW = 90;
      const paddleY = H - 24;
      let ball = { x: W / 2, y: H / 2, vx: 3, vy: -3, r: 7 };

      const loop = () => {
        if (keys.has("ArrowLeft") || keys.has("KeyA")) paddleX -= 6;
        if (keys.has("ArrowRight") || keys.has("KeyD")) paddleX += 6;
        paddleX = Math.max(0, Math.min(W - paddleW, paddleX));

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.r <= 0 || ball.x + ball.r >= W) ball.vx *= -1;
        if (ball.y - ball.r <= 0) ball.vy *= -1;

        if (ball.y + ball.r >= paddleY && ball.x >= paddleX && ball.x <= paddleX + paddleW && ball.vy > 0) {
          ball.vy *= -1;
          score += 1;
          if (score % 3 === 0) {
            ball.vx *= 1.08;
            ball.vy *= 1.08;
          }
        }

        if (ball.y - ball.r > H) {
          finish("lose");
          return;
        }

        clear();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d1a8ff";
        ctx.fillRect(paddleX, paddleY, paddleW, 10);
        infoEl.textContent = `Отбито: ${score}. A/D или стрелки — ракетка.`;
        animationId = requestAnimationFrame(loop);
      };
      animationId = requestAnimationFrame(loop);
    }

    clear();
    drawText("Загрузка...", H / 2);

    if (gameType === "snake") startSnake();
    else if (gameType === "catch") startCatch();
    else startPong();
  }

  function openStudyDeskChoice() {
    dialogueUI.onChoice = (choice) => {
      if (choice.action === "study") {
        dialogueManager.startScene("studySession");
        return;
      }

      if (choice.gameType) {
        showMiniGame(choice.gameType, {
          onComplete: (result) => {
            applyComputerGameEffects(choice.gameType, result);
            dialogueManager.startScene("afterComputerGame");
          },
        });
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
        { text: "Поиграть в змейку", gameType: "snake" },
        { text: "Ловить мячики в корзинку", gameType: "catch" },
        { text: "Отбивать мячик", gameType: "pong" },
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
