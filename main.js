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

  // Хитбокс "ноги": уже и ниже
  const bodyW = player.width * 0.45; // ширина тела (подберите)
  const bodyH = player.height * 0.1; // высота ног (подберите)

  player.body.setSize(bodyW, bodyH);
  player.body.setOffset(
    (player.width - bodyW) / 2, // центрируем по X
    player.height - bodyH // прижимаем вниз (ноги)
  );

  // мир и границы игрока (с отступом)
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

  // коридор по Y
  player.baseY = player.y;

  // --- коллайдеры из Object Layer "Colliders" ---
  const collidersLayer = map.getObjectLayer("Colliders");
  const walls = this.physics.add.staticGroup();

  if (!collidersLayer) {
    console.warn("Object Layer 'Colliders' не найден.");
  } else {
    collidersLayer.objects.forEach((o) => {
      if (!o.width || !o.height) return;

      // Tiled: x/y — левый верхний угол
      const x = o.x + o.width / 2;
      const y = o.y + o.height / 2;

      // zone = невидимый прямоугольник без текстуры
      const zone = this.add.zone(x, y, o.width, o.height);
      this.physics.add.existing(zone, true); // true => static body
      walls.add(zone);
    });
  }

  this.physics.add.collider(player, walls);

  // клавиши
  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.addCapture([
    Phaser.Input.Keyboard.KeyCodes.UP,
    Phaser.Input.Keyboard.KeyCodes.DOWN,
    Phaser.Input.Keyboard.KeyCodes.LEFT,
    Phaser.Input.Keyboard.KeyCodes.RIGHT,
  ]);

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
}
