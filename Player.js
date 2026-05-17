/*
  Player.js

  Модуль игрока.

  Отвечает за:
  - создание спрайта игрока
  - настройку хитбокса
  - обновление движения на основе клавиш
  - настройку границ мира

  Ограничения движения теперь задаются только
  границами мира и коллизиями из Tiled.
*/

export function createPlayer(scene, x, y) {
  const sprite = scene.physics.add.image(x, y, "player");
  sprite.body.allowGravity = false;

  const bodyW = sprite.width * 0.45;
  const bodyH = sprite.height * 0.1;

  sprite.body.setSize(bodyW, bodyH);
  sprite.body.setOffset((sprite.width - bodyW) / 2, sprite.height - bodyH);

  sprite.setDepth(1000);

  const player = {
    sprite,

    setupWorldBounds(worldW, worldH) {
      scene.physics.world.setBounds(0, 0, worldW, worldH);
      sprite.setCollideWorldBounds(true);
    },

    updateMovement(controls, { blocked = false } = {}) {
      const speed = 80;

      sprite.setVelocity(0);

      if (blocked) return;

      const mobile = window.mobileInput ?? {};

      const left = controls.left?.isDown || controls.A?.isDown || mobile.left;
      const right = controls.right?.isDown || controls.D?.isDown || mobile.right;
      const up = controls.up?.isDown || controls.W?.isDown || mobile.up;
      const down = controls.down?.isDown || controls.S?.isDown || mobile.down;

      if (left) {
        sprite.setVelocityX(-speed);
      } else if (right) {
        sprite.setVelocityX(speed);
      }

      if (up) {
        sprite.setVelocityY(-speed);
      } else if (down) {
        sprite.setVelocityY(speed);
      }
    },
  };

  return player;
}
