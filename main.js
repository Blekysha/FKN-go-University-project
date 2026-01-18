const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 }, // тянем персонажа вниз, чтобы он падал на пол
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let player;
let cursors;
let groundLayer;

const game = new Phaser.Game(config);

function preload() {
  // tileset.png — файл с тайлами
  this.load.image("tiles", "assets/tileset.png");

  // testMap.json — файл карты из Tiled
  this.load.tilemapTiledJSON("testMap", "assets/maps/testMap.json");

  // player.png — спрайт персонажа
  this.load.image("player", "assets/player.png");
}

function create() {
  // Загружаем карту по ключу testMap
  const map = this.make.tilemap({ key: "testMap" });

  // ВАЖНО:
  // 'test tiles' — это ИМЯ набора тайлов в Tiled (внизу справа над картинкой тайлсета).
  // Если у тебя оно другое, поставь своё.
  const tileset = map.addTilesetImage("test-tiles", "tiles");

  // Слои фона
  // Имена должны совпадать с тем, как они названы в списке слоёв в Tiled (справа сверху).
  map.createLayer("Background", tileset, 0, 0);
  map.createLayer("Background2", tileset, 0, 0);

  // Слой пола (Ground) — на нём стоят тайлы с collides = true
  groundLayer = map.createLayer("Ground", tileset, 0, 0);
  groundLayer.setCollisionByProperty({ collides: true });

  // Создаём игрока. Координату X можно менять, Y поставим повыше — он упадёт на пол.
  player = this.physics.add.image(100, 0, "player");
  player.setScale(2);

  player.setCollideWorldBounds(true);

  // Коллизия игрока с полом
  this.physics.add.collider(player, groundLayer);

  // Управление клавишами
  cursors = this.input.keyboard.createCursorKeys();

  // Камера следует за игроком по уровню
  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}

function update() {
  const speed = 200;

  // Сбрасываем скорость по X
  player.setVelocityX(0);

  // Движение только влево / вправо
  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
  }

  // Прыжков не делаем: по Y управляет только гравитация+коллизия
}
