/*
  GameScene.js

  Основная игровая сцена (координационный слой).

  Отвечает за:
  - preload ассетов
  - первичную инициализацию: игрок, input, UI, загрузка стартового уровня
  - update-цикл: делегирование движения игрока и системы взаимодействия

  НЕ отвечает за:
  - загрузку/уничтожение уровня (levelManager)
  - хранение/синхронизацию инвентаря (inventory)
  - обработку overlap + подсказка + нажатие E (interactionSystem)
*/

import { createPlayer } from "./Player.js";
import { createInteractionHint } from "./ui.js";

// новые модули (дадим следующими файлами)
import { createLevelManager } from "./levelManager.js";
import { createInventory } from "./inventory.js";
import { createInteractionSystem } from "./interactionSystem.js";
import { dialogueUI } from "./dialogueUI.js";
import { createStoryState } from "./storyState.js";
import { createDialogueManager } from "./dialogueManager.js";
import { createStorySystem } from "./storySystem.js";

export const GameScene = {
  preload,
  create,
  update,
};

function preload() {
  this.load.image("tiles", "assets/tileset.png");
  this.load.tilemapTiledJSON("testMap", "assets/maps/testMap.json");
  this.load.image("player", "assets/player.png");
  this.load.tilemapTiledJSON("corridor", "assets/maps/corridor.json");
  this.load.image("key", "assets/key.png");
  this.load.tilemapTiledJSON("room_Lera", "assets/maps/room_Lera.json");
  this.load.tilemapTiledJSON("perehod", "assets/maps/perehod.json");
  this.load.tilemapTiledJSON(
    "university_corridor",
    "assets/maps/university_corridor.json"
  );
  this.load.tilemapTiledJSON("audience", "assets/maps/audience.json");
  this.load.image("npc_roommate_sit", "assets/npc_roommate_sit.png"); // Коля сидит
  this.load.image("eye", "assets/eye.png"); //глаз для взаимодействий
}

function create() {
  // ===== 1) Состояние =====
  this.inventory = createInventory(this);
  this.storyState = createStoryState();

  // ===== 2) Игровые сущности =====
  this.player = createPlayer(this, 48, 90);
  this.player.sprite.setCollideWorldBounds(true);

  // ===== 3) Ввод =====
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  // ===== 4) UI =====
  this.hintE = createInteractionHint(this);

  // ===== 5) Камера =====
  this.cameras.main.startFollow(this.player.sprite);
  this.cameras.main.setZoom(3);

  // ===== 6) Уровень =====
  this.levelManager = createLevelManager(this, {
    playerSprite: this.player.sprite,
  });

  // Стартовая карта должна быть загружена до interactionSystem
  this.levelManager.load("testMap", null);

  // ===== 7) Диалоги и сюжет =====
  this.dialogueManager = createDialogueManager(this, {
    inventory: this.inventory,
    state: this.storyState,
  });

  this.story = createStorySystem(this, {
    dialogueManager: this.dialogueManager,
    state: this.storyState,
  });

  this.story.playIntroOnce();

  // ===== 8) Взаимодействия =====
  this.interaction = createInteractionSystem(this, {
    playerSprite: this.player.sprite,
    keyE: this.keyE,
    hint: this.hintE,
    inventory: this.inventory,
    levelManager: this.levelManager,
    dialogueManager: this.dialogueManager,
  });

  // ===== 9) UX =====
  this.input.on("pointerdown", () => this.game.canvas.focus());
}

function update() {
  const blocked = dialogueUI.isOpen();

  this.player.updateMovement(this.cursors, { blocked });

  if (blocked) {
    this.hintE.hide();
    return;
  }

  this.interaction.update();
}
