/*
  ui.js

  Подсказка взаимодействия отключена визуально.
  Логика вызова showAt/hide остаётся, но ничего не отображается.
*/

export function createInteractionHint(scene) {
  return {
    showAt() {},
    hide() {},
  };
}
