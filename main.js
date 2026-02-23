const config = {
  type: Phaser.AUTO,
  width: 760,
  height: 480,
  backgroundColor: "#000000",
  pixelArt: true,
  roundPixels: true,

  // чтобы масштабировалось под окно
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },

  scene: { preload, create, update },
};

let player, cursors;
let keyE;
let doors;
let currentDoor = null;

const inventory = new Set(); // позже заменишь на нормальный инвентарь

new Phaser.Game(config);

function preload() {
  this.load.image("tiles", "assets/tileset.png");
  this.load.tilemapTiledJSON("testMap", "assets/maps/testMap.json");
  this.load.image("player", "assets/player.png");
}

function create() {
  const map = this.make.tilemap({ key: "testMap" });
  const tileset = map.addTilesetImage("tileset", "tiles");

  const background = map.createLayer("BackGround", tileset, 0, 0);
  if (!background)
    console.warn("Слой BackGround не найден или он не tilelayer.");

  // игрок
  player = this.physics.add.image(4 * 32, 100, "player");
  player.body.allowGravity = false;

  const bodyW = player.width * 0.45;
  const bodyH = player.height * 0.1;
  player.body.setSize(bodyW, bodyH);
  player.body.setOffset((player.width - bodyW) / 2, player.height - bodyH);

  const margin = 20;
  this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  player.body.setBoundsRectangle(
    new Phaser.Geom.Rectangle(
      margin,
      margin,
      map.widthInPixels - margin * 2,
      map.heightInPixels - margin * 2
    )
  );
  player.setCollideWorldBounds(true);

  player.baseY = player.y;

  // --- коллайдеры ---
  const collidersLayer = map.getObjectLayer("Colliders");
  const walls = this.physics.add.staticGroup();

  if (!collidersLayer) {
    console.warn("Object Layer 'Colliders' не найден.");
  } else {
    collidersLayer.objects.forEach((o) => {
      if (!o.width || !o.height) return;
      const x = o.x + o.width / 2;
      const y = o.y + o.height / 2;
      const zone = this.add.zone(x, y, o.width, o.height);
      this.physics.add.existing(zone, true);
      walls.add(zone);
    });
  }
  this.physics.add.collider(player, walls);

  // --- двери ---
  const doorsLayer = map.getObjectLayer("Doors");
  doors = this.physics.add.staticGroup();

  function getProp(o, name, def = undefined) {
    const p = o.properties?.find((x) => x.name === name);
    return p ? p.value : def;
  }

  if (!doorsLayer) {
    console.warn("Object Layer 'Doors' не найден.");
  } else {
    doorsLayer.objects.forEach((o) => {
      if (!o.width || !o.height) return;

      const x = o.x + o.width / 2;
      const y = o.y + o.height / 2;

      const z = this.add.zone(x, y, o.width, o.height);
      this.physics.add.existing(z, true);

      z.doorData = {
        type: getProp(o, "type", "door"),
        targetMap: getProp(o, "targetMap", ""),
        targetSpawn: getProp(o, "targetSpawn", ""),
        locked: !!getProp(o, "locked", false),
        keyId: getProp(o, "keyId", ""),
      };

      doors.add(z);
    });
  }

  // --- клавиши ---
  cursors = this.input.keyboard.createCursorKeys();
  keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  // --- подсказка "E" ---
  hintE = this.add
    .text(0, 0, "E", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 6, y: 3 },
    })
    .setOrigin(0.5, 1)
    .setScrollFactor(1) // ВАЖНО: 1, а не 0
    .setDepth(9999)
    .setVisible(false);

  // камера
  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.setZoom(3);

  this.input.on("pointerdown", () => this.game.canvas.focus());
}
function update() {
  const speedX = 135;
  const speedY = 80;
  const maxUp = 12;
  const maxDown = 10;

  // X
  player.setVelocityX(0);
  if (cursors.left.isDown) player.setVelocityX(-speedX);
  else if (cursors.right.isDown) player.setVelocityX(speedX);

  // Y
  player.setVelocityY(0);

  if (cursors.up.isDown && player.y > player.baseY - maxUp) {
    player.setVelocityY(-speedY);
  } else if (cursors.down.isDown && player.y < player.baseY + maxDown) {
    player.setVelocityY(speedY);
  }

  // жёстко ограничиваем
  if (player.y < player.baseY - maxUp) {
    player.y = player.baseY - maxUp;
    player.body.reset(player.x, player.y);
  }
  if (player.y > player.baseY + maxDown) {
    player.y = player.baseY + maxDown;
    player.body.reset(player.x, player.y);
  }
  // 1) каждый кадр ищем дверь под игроком
  currentDoor = null;
  this.physics.overlap(player, doors, (_, doorZone) => {
    currentDoor = doorZone;
  });

  // 2) показываем/прячем "E" у двери (в координатах экрана)
  if (currentDoor) {
    const cam = this.cameras.main;
    const wx = currentDoor.x;
    const wy = currentDoor.y;

    // переводим world -> screen
    const sx = (wx - cam.worldView.x) * cam.zoom;
    const sy = (wy - cam.worldView.y) * cam.zoom;

    hintE.setPosition(sx, sy - 6); // чуть выше двери
    hintE.setVisible(true);
  } else {
    hintE.setVisible(false);
  }

  currentDoor = null;
  this.physics.overlap(player, doors, (_, doorZone) => {
    currentDoor = doorZone;
  });

  if (currentDoor) {
    hintE.setPosition(
      currentDoor.x,
      currentDoor.y - currentDoor.height / 2 - 6
    );
    hintE.setVisible(true);
  } else {
    hintE.setVisible(false);
  }
}
