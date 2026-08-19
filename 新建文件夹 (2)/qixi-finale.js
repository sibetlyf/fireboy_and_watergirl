(function () {
  'use strict';
  function isFirstLevel(level) { return level && level.levelData && Number(level.levelData.id) === 0; }
  function redirectToFinale() { window.location.replace('qixi-finale.html'); }
  function patchLevel() {
    var game = window.PIXI && window.PIXI.game;
    var level = game && game.level;
    if (!level || level.__qixiRedirectPatched || !isFirstLevel(level) || typeof level.gameFinish !== 'function') return;
    level.__qixiRedirectPatched = true;
    level.gameFinish = function () { redirectToFinale(); };
  }
  (function poll() { patchLevel(); setTimeout(poll, 500); }());
}());
