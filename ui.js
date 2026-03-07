export function createInteractionHint(scene) {
  const container = scene.add.container(0, 0);
  container.setScrollFactor(0);
  container.setDepth(9999);
  container.setVisible(false);

  const eye = scene.add.image(0, 0, "eye");
  eye.setOrigin(0, 1); // левая нижняя точка
  container.add(eye);

  function showBottomLeft() {
    const cam = scene.cameras.main;
    const vw = cam.width / cam.zoom;
    const vh = cam.height / cam.zoom;

    container.setPosition(cam.centerX - vw / 2 + 6, cam.centerY + vh / 2 - 6);

    container.setVisible(true);
  }

  return {
    show() {
      showBottomLeft();
    },

    showAt() {
      showBottomLeft();
    },

    hide() {
      container.setVisible(false);
    },
  };
}
