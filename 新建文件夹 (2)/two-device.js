(function () {
  'use strict';
  var role, socket, roomCode = new URLSearchParams(location.search).get('room') || '';
  var remoteInput = { left:false, right:false, up:false }, localInput = { left:false, right:false, up:false }, last = '';
  var card = null;

  function game(){ return window.PIXI && window.PIXI.game; }
  function level(){ return game() && game().level; }
  function character(which){ var l=level(); return which === 'fire' ? l && l.pers1 : l && l.pers2; }
  function send(data){ if(socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data)); }
  function escapeText(value){ return String(value ?? '').replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }

  function panel(){
    var n=document.getElementById('device-panel'); if(n)return n;
    n=document.createElement('aside'); n.id='device-panel';
    n.innerHTML='<strong>首关双设备合作</strong><p id="device-status">连接中…</p><section class="host-card"><b>创建专属贺卡</b><input id="card-to" maxlength="24" placeholder="贺卡给谁，例如：洛小白"><textarea id="card-message" maxlength="160" placeholder="写下想说的话"></textarea><input id="card-from" maxlength="24" placeholder="落款，例如：—— 与你同行"><button id="create-room">生成房间并邀请</button></section><div class="join-card"><input id="device-room" maxlength="8" placeholder="输入邀请码加入"><button id="join-room">加入第一关</button></div><div id="invite-box" hidden><small>分享邀请链接</small><input id="invite-link" readonly><button id="copy-invite">复制邀请</button></div><small>房主控制火人，受邀玩家控制冰人</small>';
    document.body.appendChild(n);
    n.querySelector('#device-room').value=roomCode;
    n.querySelector('#create-room').onclick=function(){
      var draft={to:n.querySelector('#card-to').value, message:n.querySelector('#card-message').value, from:n.querySelector('#card-from').value};
      send({type:'create',card:draft}); status('正在生成专属房间…');
    };
    n.querySelector('#join-room').onclick=function(){ joinRoom(n.querySelector('#device-room').value); };
    n.querySelector('#copy-invite').onclick=function(){ var input=n.querySelector('#invite-link'); input.select(); navigator.clipboard?.writeText(input.value).then(function(){status('邀请链接已复制');},function(){document.execCommand('copy');status('邀请链接已复制');}); };
    return n;
  }
  function status(t){ panel().querySelector('#device-status').textContent=t; }
  function joinRoom(value){ roomCode=String(value||'').trim().toUpperCase(); if(roomCode.length<4)return status('房间码至少 4 位'); history.replaceState(null,'',location.pathname+'?room='+roomCode); send({type:'join',roomId:roomCode}); }
  function saveCard(config){ card=config; try { sessionStorage.setItem('qixi-card:'+roomCode, JSON.stringify(config)); } catch (_) {} }
  function showInvite(){ var p=panel(), box=p.querySelector('#invite-box'), link=location.origin+location.pathname+'?room='+roomCode; p.querySelector('#invite-link').value=link; box.hidden=false; }

  function controls(){ var root=document.getElementById('mobile-controls'); if(root)return root; root=document.createElement('div'); root.id='mobile-controls'; root.innerHTML='<div class="move-cluster"><button class="move-control" data-key="left" aria-label="向左">◀</button><button class="move-control" data-key="right" aria-label="向右">▶</button></div><button class="move-control jump-control" data-key="up" aria-label="跳跃">跳</button>'; document.body.appendChild(root); root.querySelectorAll('.move-control').forEach(function(button){ var key=button.dataset.key; function down(event){event.preventDefault();localInput[key]=true;button.classList.add('pressed');if(button.setPointerCapture)button.setPointerCapture(event.pointerId);} function up(event){event.preventDefault();localInput[key]=false;button.classList.remove('pressed');} button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);button.addEventListener('pointerleave',function(event){if(event.buttons===0)up(event);}); }); return root; }
  function bindKeyboard(){ function keyFor(event){var map=role==='fire'?{ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up'}:{KeyA:'left',KeyD:'right',KeyW:'up'};return map[event.code];} function update(event,down){if(event.target&&/INPUT|TEXTAREA/.test(event.target.tagName))return;var key=keyFor(event);if(!key)return;event.preventDefault();localInput[key]=down;} window.addEventListener('keydown',function(e){update(e,true);});window.addEventListener('keyup',function(e){update(e,false);});window.addEventListener('blur',function(){localInput={left:false,right:false,up:false};}); }
  function orientationGuard(){
    var guard=document.getElementById('orientation-guard'); if(guard)return guard;
    guard=document.createElement('div'); guard.id='orientation-guard';
    guard.innerHTML='<span>↻</span><strong>请旋转设备</strong><small>横屏体验更完整</small>';
    document.body.appendChild(guard); return guard;
  }
  function enterGameMode(){
    panel().classList.add('in-game');
    document.documentElement.classList.add('in-game');
    orientationGuard();
    if(screen.orientation&&screen.orientation.lock) screen.orientation.lock('landscape').catch(function(){});
  }
  function startWhenReady(){ window.__firstLevelStartRequested=true; window.dispatchEvent(new Event('first-level:start')); controls().classList.add('visible'); enterGameMode(); }
  function connect(){ socket=new WebSocket((location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/ws'); socket.onopen=function(){status(roomCode.length>=4?'正在加入房间…':'创建专属贺卡或输入邀请码');if(roomCode.length>=4)send({type:'join',roomId:roomCode});};socket.onclose=function(){status('已断开，重连中…');setTimeout(connect,1200);};socket.onmessage=function(e){var m=JSON.parse(e.data);if(m.type==='joined'){role=m.role;roomCode=m.roomId||roomCode;panel().querySelector('#device-room').value=roomCode;if(m.owner)showInvite();status('你控制：'+(role==='fire'?'火人（房主）':'冰人'));}else if(m.type==='room'){if(m.card)saveCard(m.card);status(m.isReady?'队友已就绪，正在进入第一关':'等待受邀玩家（1/2）');if(m.isReady)startWhenReady();}else if(m.type==='input'&&role==='fire')remoteInput=m.input;else if(m.type==='state'&&role==='water')apply(m.state);else if(m.type==='error')status(m.message);}; }
  function setInput(which,v){var x=character(which)?.cursors;if(!x)return;['left','right','up'].forEach(function(k){if(x[k])x[k].isDown=!!v[k];});} function snapshot(c){if(!c?.body)return null;var v=c.body.data.GetLinearVelocity();return{x:c.body.x,y:c.body.y,vx:v.x,vy:v.y};} function apply(s){var l=level();if(!l||!s)return;['fire','water'].forEach(function(k){var c=k==='fire'?l.pers1:l.pers2,d=s[k];if(c&&d){c.body.x=d.x;c.body.y=d.y;c.body.data.SetLinearVelocity(new box2d.b2Vec2(d.vx||0,d.vy||0));}});}
  setInterval(function(){if(!role||!level())return;var raw=JSON.stringify(localInput);if(raw!==last){send({type:'input',input:localInput});last=raw;}if(role==='fire'){setInput('fire',localInput);setInput('water',remoteInput);var l=level();send({type:'state',state:{fire:snapshot(l.pers1),water:snapshot(l.pers2)}});}else setInput('fire',{left:false,right:false,up:false});},30);
  panel(); controls(); bindKeyboard(); connect();
}());
