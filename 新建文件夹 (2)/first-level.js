(function () {
  'use strict';

  var FIRST_LEVEL = {
    id: 0,
    filename: 'tutorials/levels/tutorial_forest.json',
    elements: ['forest'],
    locked: false,
    required: 0,
    time: 300,
    mobileTime: 600,
    unlock_key: 'free'
  };
  var requested = false;
  var started = false;

  function launchFirstLevel(LevelState) {
    var game = window.PIXI && window.PIXI.game;
    if (!game || started || !game.state) return;
    started = true;
    // 使用键盘游标对象作为输入接口；移动端输入由 two-device.js 持续写入。
    game.settings.controls = 'keyboard';
    game.settings.music = true;
    game.settings.fx = true;
    if (game.settingsSignal) game.settingsSignal.dispatch('controls');
    game.currentTemple = { id: 'forest', label: 'Forest Temple', elements: ['forest'] };
    game.state.add('level', LevelState);
    game.state.start('level', true, false, FIRST_LEVEL);
  }

  function requestGame() {
    var game = window.PIXI && window.PIXI.game;
    if (!game || !game.state || !window.require) return setTimeout(requestGame, 250);
    if (requested) return;
    requested = true;
    window.require(['States/Level/Level'], function (LevelState) { launchFirstLevel(LevelState); });
  }

  window.addEventListener('first-level:start', requestGame, { once: true });
  if (window.__firstLevelStartRequested) requestGame();
}());
