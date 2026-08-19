(function () {
  'use strict';

  function isFirstLevel(level) {
    return level && level.levelData && Number(level.levelData.id) === 0;
  }

  function redirectToFinale() {
    window.location.replace('qixi-finale.html');
  }

  function patchLevel() {
    var game = window.PIXI && window.PIXI.game;
    var level = game && game.level;
    if (!level || !isFirstLevel(level)) return;

    if (!level.__qixiRedirectPatched && typeof level.gameFinish === 'function') {
      level.__qixiRedirectPatched = true;
      level.gameFinish = function () {
        redirectToFinale();
      };
    }

    if (!level.__qixiAutoRetryPatched && typeof level.gameOver === 'function' && typeof level.retry === 'function') {
      level.__qixiAutoRetryPatched = true;
      level.gameOver = function () {
        if (this.__qixiAutoRetryPending) return;
        this.__qixiAutoRetryPending = true;
        if (this.ui && this.ui.clock) this.ui.clock.stop();
        var currentLevel = this;
        setTimeout(function () {
          if (currentLevel && typeof currentLevel.retry === 'function') currentLevel.retry();
        }, 700);
      };
    }
  }

  (function poll() {
    patchLevel();
    setTimeout(poll, 250);
  }());
}());
