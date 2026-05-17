export function createInteractionHint(scene) {
  const container = scene.add.container(0, 0);
  container.setScrollFactor(0);
  container.setDepth(9999);
  container.setVisible(false);

  const eye = scene.add.image(0, 0, "eye");
  eye.setOrigin(0, 1); // левая нижняя точка
  eye.setScrollFactor(0);
  eye.setDepth(10000);
  container.add(eye);

  function showBottomLeft() {
    const cam = scene.cameras.main;
    const vw = cam.width / cam.zoom;
    const vh = cam.height / cam.zoom;

    const isMobile = !!window.isMobileControlsDevice;
    const x = isMobile
      ? cam.centerX + vw / 2 - 24
      : cam.centerX - vw / 2 + 6;
    const y = isMobile
      ? cam.centerY + vh / 2 - 12
      : cam.centerY + vh / 2 - 6;

    container.setPosition(x, y);
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
