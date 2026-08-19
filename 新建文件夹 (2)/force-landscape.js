(function () {
  'use strict';
  var active = new URLSearchParams(location.search).get('mode') === 'message' || new URLSearchParams(location.search).get('mode') === 'adventure';
  function portraitMobile() { return window.matchMedia && window.matchMedia('(max-width:900px) and (orientation:portrait)').matches; }
  function sync() {
    document.documentElement.classList.toggle('force-landscape', active && portraitMobile());
    document.documentElement.classList.toggle('mobile-game-layout', active);
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 0);
  }
  window.requestGameLandscape = function () { active = true; sync(); };
  window.addEventListener('resize', sync);
  window.addEventListener('orientationchange', function () { setTimeout(sync, 80); });
  sync();
}());
