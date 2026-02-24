/*
  ui.js

  Отвечает за отображение подсказки взаимодействия (кнопка E).
*/

export function createInteractionHint(scene) {
  const container = scene.add.container(0, 0);
  container.setScrollFactor(1);
  container.setDepth(9999);
  container.setVisible(false);
  container.setScale(0.3);

  const bg = scene.add.rectangle(0, 0, 28, 28, 0x000000, 0.75);
  bg.setStrokeStyle(2, 0xffffff, 0.9);

  const text = scene.add
    .text(0, 0, "E", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  container.add([bg, text]);

  // лёгкая анимация "дыхания"
  scene.tweens.add({
    targets: container,
    scale: 0.25,
    duration: 700,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });

  return {
    showAt(x, y, label = "E") {
      text.setText(label);
      container.setPosition(x, y + 10);
      container.setVisible(true);
    },

    hide() {
      container.setVisible(false);
    },
  };
}
