(function () {
  'use strict';

  var MESSAGE = '与其说你美好，不如说，你不可重复';
  var installed = false;

  function firstLevel(level) {
    return level && level.levelData && Number(level.levelData.id) === 0;
  }

  function createScene() {
    var scene = document.createElement('section');
    scene.id = 'qixi-finale';
    scene.innerHTML = [
      '<div class="qixi-sky"><i></i><i></i><i></i><i></i><i></i></div>',
      '<div class="qixi-letter" aria-live="polite"><span class="qixi-seal">七夕</span><p>致独一无二的你：</p><p>愿每一次并肩，都通往更辽阔的星河。</p></div>',
      '<div class="qixi-bridge" aria-label="鹊桥"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
      '<div class="qixi-lovers"><div class="qixi-heart fire-heart">♥</div><div class="qixi-heart water-heart">♥</div></div>',
      '<p class="qixi-message">' + MESSAGE + '</p>',
      '<button class="qixi-close" type="button">继续旅程</button>'
    ].join('');
    document.body.appendChild(scene);
    requestAnimationFrame(function () { scene.classList.add('qixi-active'); });
    scene.querySelector('.qixi-close').addEventListener('click', function () {
      scene.classList.remove('qixi-active');
      setTimeout(function () { scene.remove(); }, 650);
    });
    return scene;
  }

  function play(level, next) {
    if (document.getElementById('qixi-finale')) return;
    if (level.game && level.game.physics && level.game.physics.box2d) level.game.physics.box2d.paused = true;
    var scene = createScene();
    setTimeout(function () {
      scene.classList.add('qixi-reveal');
    }, 2700);
    scene.querySelector('.qixi-close').addEventListener('click', function () { next.call(level); }, { once: true });
  }

  function patchLevel() {
    var game = window.PIXI && window.PIXI.game;
    var level = game && game.level;
    if (!level || level.__qixiPatched || !firstLevel(level) || typeof level.gameFinish !== 'function') return;
    var original = level.gameFinish;
    level.__qixiPatched = true;
    level.gameFinish = function () { play(this, original); };
  }

  function poll() {
    patchLevel();
    setTimeout(poll, 500);
  }

  if (!installed) {
    installed = true;
    poll();
  }
}());
