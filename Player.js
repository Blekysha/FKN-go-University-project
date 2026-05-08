/*
  Player.js
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

      const left = controls.left?.isDown || controls.A?.isDown;
      const right = controls.right?.isDown || controls.D?.isDown;
      const up = controls.up?.isDown || controls.W?.isDown;
      const down = controls.down?.isDown || controls.S?.isDown;

      if (left) sprite.setVelocityX(-speed);
      else if (right) sprite.setVelocityX(speed);

      if (up) sprite.setVelocityY(-speed);
      else if (down) sprite.setVelocityY(speed);
    },
  };

  return player;
}
