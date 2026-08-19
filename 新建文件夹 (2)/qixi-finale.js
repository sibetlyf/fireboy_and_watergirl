(function () {
  'use strict';

  if (new URLSearchParams(window.location.search).get('mode') !== 'message') return;

  function isFirstLevel(level) {
    return level && level.levelData && Number(level.levelData.id) === 0;
  }

  function redirectToFinale() {
    var params = new URLSearchParams(window.location.search);
    var room = params.get('room');
    var query = 'mode=message' + (room ? '&room=' + encodeURIComponent(room) : '');
    window.location.replace('qixi-finale.html?' + query);
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
