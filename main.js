const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  pixelArt: true,
  roundPixels: true,

  scale: {
    mode: Phaser.Scale.NONE,
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
  //Фон
  const map = this.make.tilemap({ key: "testMap" });

  const tsName =
    map.tilesets.length >= 2 ? map.tilesets[1].name : map.tilesets[0].name;
  const tileset = map.addTilesetImage(tsName, "tiles");

  // Сначала фон, затем предметы
  const ground = map.createLayer("Ground", tileset, 0, 0);
  const background = map.createLayer("BackGround", tileset, 0, 0);

  if (!background)
    console.warn("Слой BackGround не найден или он не tilelayer.");
  if (!ground) throw new Error("Слой Ground не найден или он не tilelayer.");

  ground.setCollisionByProperty({ collides: true });
  ground.setCollisionByProperty({ пол: true });

  // Игрок
  player = this.physics.add.image(4 * 32, 0, "player");
  player.setCollideWorldBounds(true);

  // уменьшаем физическое тело и сдвигаем его вниз,
  // чтобы визуально персонаж был "утоплен" в пол
  player.body.setSize(player.width, player.height - 10);
  player.body.setOffset(0, 4); //чтоб персонаж не летал

  this.physics.add.collider(player, ground);

  cursors = this.input.keyboard.createCursorKeys();

  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.setZoom(3);
}

function update() {
  const speed = 200;
  player.setVelocityX(0);

  if (cursors.left.isDown) player.setVelocityX(-speed);
  else if (cursors.right.isDown) player.setVelocityX(speed);
}
