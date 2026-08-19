(function () {
  'use strict';
  var forced = sessionStorage.getItem('fbwg-force-landscape') === '1';
  function portraitMobile() { return window.matchMedia && window.matchMedia('(max-width:900px) and (orientation:portrait)').matches; }
  function sync() { document.documentElement.classList.toggle('force-landscape', forced && portraitMobile()); }
  window.requestGameLandscape = function () {
    forced = true; sessionStorage.setItem('fbwg-force-landscape','1');
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {});
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () { sync(); });
    sync();
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 60);
  };
  window.addEventListener('resize', sync);
  window.addEventListener('orientationchange', function () { setTimeout(sync, 80); });
}());
