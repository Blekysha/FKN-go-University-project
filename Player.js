/*
  Player.js

  Модуль игрока.

  Отвечает за:
  - создание спрайта игрока
  - настройку хитбокса
  - ограничение движения по оси Y
  - обновление движения на основе клавиш
  - настройку границ мира

  В этом файле нет логики дверей или карты.
*/
export function createPlayer(scene, x, y) {
  const sprite = scene.physics.add.image(x, y, "player");
  sprite.body.allowGravity = false;

  const bodyW = sprite.width * 0.45;
  const bodyH = sprite.height * 0.1;

  sprite.body.setSize(bodyW, bodyH);
  sprite.body.setOffset((sprite.width - bodyW) / 2, sprite.height - bodyH);

  const player = {
    sprite,
    baseY: sprite.y,

    setupWorldBounds(worldW, worldH, margin = 20) {
      scene.physics.world.setBounds(0, 0, worldW, worldH);
      sprite.body.setBoundsRectangle(
        new Phaser.Geom.Rectangle(
          margin,
          margin,
          worldW - margin * 2,
          worldH - margin * 2
        )
      );
      sprite.setCollideWorldBounds(true);
    },

    updateMovement(cursors) {
      const speedX = 100;
      const speedY = 75;
      const maxUp = 12;
      const maxDown = 10;

      sprite.setVelocityX(0);
      if (cursors.left.isDown) sprite.setVelocityX(-speedX);
      else if (cursors.right.isDown) sprite.setVelocityX(speedX);

      sprite.setVelocityY(0);

      if (cursors.up.isDown && sprite.y > player.baseY - maxUp)
        sprite.setVelocityY(-speedY);
      else if (cursors.down.isDown && sprite.y < player.baseY + maxDown)
        sprite.setVelocityY(speedY);

      if (sprite.y < player.baseY - maxUp) {
        sprite.y = player.baseY - maxUp;
        sprite.body.reset(sprite.x, sprite.y);
      }
      if (sprite.y > player.baseY + maxDown) {
        sprite.y = player.baseY + maxDown;
        sprite.body.reset(sprite.x, sprite.y);
      }
    },
  };

  return player;
}
