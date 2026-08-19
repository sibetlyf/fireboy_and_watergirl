(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  var mode = params.get('mode');
  window.__gameMode = mode === 'adventure' || mode === 'message' ? mode : '';

  function choose(next) {
    var url = new URL(location.href);
    url.searchParams.set('mode', next);
    url.searchParams.delete('room');
    location.replace(url.pathname + '?' + url.searchParams.toString());
  }

  function showChooser() {
    var panel = document.createElement('section');
    panel.id = 'mode-selector';
    panel.innerHTML = '<div class="mode-card"><p class="mode-kicker">FIREBOY · WATERGIRL</p><h1>选择游玩方式</h1><p>两种模式都支持两台设备联机协作。</p><div class="mode-actions"><button data-mode="adventure"><b>闯关模式</b><span>双设备联机 · 房主任选关卡</span></button><button data-mode="message"><b>寄语模式</b><span>专属贺卡 · 邀请同伴通关</span></button></div></div>';
    document.body.appendChild(panel);
    panel.querySelectorAll('[data-mode]').forEach(function (button) { button.onclick = function () { choose(button.dataset.mode); }; });
  }

  if (!window.__gameMode) showChooser();
}());
