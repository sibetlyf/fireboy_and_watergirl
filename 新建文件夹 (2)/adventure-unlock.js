(function () {
  'use strict';
  if (new URLSearchParams(location.search).get('mode') !== 'adventure') return;
  function unlock(value, seen) {
    if (!value || typeof value !== 'object') return;
    seen = seen || [];
    if (seen.indexOf(value) >= 0) return;
    seen.push(value);
    if (Object.prototype.hasOwnProperty.call(value, 'required')) value.required = 0;
    if (Object.prototype.hasOwnProperty.call(value, 'unlock_key')) value.unlock_key = 'free';
    Object.keys(value).forEach(function (key) { unlock(value[key], seen); });
  }
  (function poll() {
    var game = window.PIXI && window.PIXI.game;
    var cache = game && game.cache && game.cache._cache;
    if (cache && cache.json) Object.keys(cache.json).forEach(function (key) { unlock(cache.json[key] && cache.json[key].data); });
    setTimeout(poll, 300);
  }());
}());
