/*
    GameScene.js

    Основная игровая сцена (координационный слой).
  */

import { createPlayer } from "./Player.js";
import { createInteractionHint } from "./ui.js";

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
  this.load.tilemapTiledJSON("room_Sveta", "assets/maps/room_Sveta.json");
  this.load.tilemapTiledJSON("perehod", "assets/maps/perehod.json");
  this.load.tilemapTiledJSON(
    "university_corridor",
    "assets/maps/university_corridor.json"
  );
  this.load.tilemapTiledJSON("audience", "assets/maps/audience.json");

  this.load.image("npc_roommate_sit", "assets/npc_roommate_sit.png"); // Семён
  this.load.image("npc_Sveta", "assets/npc_Sveta.png"); // Света
  this.load.image("npc_Professor", "assets/npc_Professor.png"); // Профессор
  this.load.image("eye", "assets/eye.png");
}

function create() {
  this.inventory = createInventory(this);
  this.storyState = createStoryState();

  this.player = createPlayer(this, 48, 90);
  this.player.sprite.setCollideWorldBounds(true);

  this.cursors = this.input.keyboard.createCursorKeys();
  this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  this.hintE = createInteractionHint(this);

  this.cameras.main.startFollow(this.player.sprite);
  this.cameras.main.setZoom(3);

  this.levelManager = createLevelManager(this, {
    playerSprite: this.player.sprite,
  });

  this.levelManager.load("testMap", null);

  this.story = createStorySystem(this, {
    state: this.storyState,
  });

  this.dialogueManager = createDialogueManager(this, {
    inventory: this.inventory,
    state: this.storyState,
    story: this.story,
  });

  this.interaction = createInteractionSystem(this, {
    playerSprite: this.player.sprite,
    keyE: this.keyE,
    hint: this.hintE,
    inventory: this.inventory,
    levelManager: this.levelManager,
    dialogueManager: this.dialogueManager,
    state: this.storyState,
  });

  // интро запускаем после полной инициализации сцены
  this.story.playIntroOnce(this.dialogueManager);

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
