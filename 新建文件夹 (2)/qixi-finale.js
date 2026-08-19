(function () {
  'use strict';
  var MESSAGE = '与其说你美好，不如说，你不可重复';

  function firstLevel(level) { return level && level.levelData && Number(level.levelData.id) === 0; }

  function createScene() {
    var scene = document.createElement('section');
    scene.id = 'qixi-finale';
    scene.innerHTML = [
      '<div class="qixi-sky"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>',
      '<div class="qixi-milkyway"></div><div class="qixi-cloud cloud-a"></div><div class="qixi-cloud cloud-b"></div>',
      '<div class="qixi-lantern lantern-a"><b>七</b></div><div class="qixi-lantern lantern-b"><b>夕</b></div>',
      '<div class="qixi-letter" aria-live="polite"><span class="qixi-seal">七夕</span><p>致独一无二的你：</p><p>愿每一次并肩，都通往更辽阔的星河。</p></div>',
      '<div class="qixi-bridge" aria-label="鹊桥"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
      '<div class="qixi-actors"><div class="qixi-fireboy"><b></b><i></i></div><div class="qixi-watergirl"><b></b><i></i></div><div class="qixi-one-heart">♥</div></div>',
      '<div class="qixi-fuse-glow"></div>',
      '<p class="qixi-message">' + MESSAGE + '</p><p class="qixi-signature">—— 洛小白</p>',
      '<button class="qixi-close" type="button">珍藏此刻</button>'
    ].join('');
    document.body.appendChild(scene);
    requestAnimationFrame(function () { scene.classList.add('qixi-active'); });
    return scene;
  }

  function play(level, next) {
    if (document.getElementById('qixi-finale')) return;
    // gameFinish 在原角色爬上出口楼梯动画结束后才调用，此处自然承接。
    if (level.game && level.game.physics && level.game.physics.box2d) level.game.physics.box2d.paused = true;
    var scene = createScene();
    setTimeout(function () { scene.classList.add('qixi-walk'); }, 1000);
    setTimeout(function () { scene.classList.add('qixi-fuse'); }, 3700);
    setTimeout(function () { scene.classList.add('qixi-reveal'); }, 5200);
    scene.querySelector('.qixi-close').addEventListener('click', function () {
      scene.classList.remove('qixi-active');
      setTimeout(function () { scene.remove(); next.call(level); }, 650);
    }, { once: true });
  }

  function patchLevel() {
    var game = window.PIXI && window.PIXI.game;
    var level = game && game.level;
    if (!level || level.__qixiPatched || !firstLevel(level) || typeof level.gameFinish !== 'function') return;
    var original = level.gameFinish;
    level.__qixiPatched = true;
    level.gameFinish = function () { play(this, original); };
  }
  (function poll() { patchLevel(); setTimeout(poll, 500); }());
}());
