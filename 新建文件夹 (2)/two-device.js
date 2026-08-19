(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  var mode = params.get('mode');
  if (mode !== 'message' && mode !== 'adventure') return;
  var role, socket, roomCode = params.get('room') || '';
  var invitedMessageGuest = mode === 'message' && roomCode.length >= 4;
  var remoteInput = { left:false, right:false, up:false }, localInput = { left:false, right:false, up:false }, last = '';
  var card = null;
  var adventureReady=false, adventureStarted=false, lastAdventureLevel='';

  function game(){ return window.PIXI && window.PIXI.game; }
  function level(){ return game() && game().level; }
  function character(which){ var l=level(); return which === 'fire' ? l && l.pers1 : l && l.pers2; }
  function send(data){ if(socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data)); }
  function escapeText(value){ return String(value ?? '').replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }

  function panel(){
    var n=document.getElementById('device-panel'); if(n)return n;
    n=document.createElement('aside'); n.id='device-panel';
    if(invitedMessageGuest){n.className='silent-invite';n.innerHTML='<p id="device-status">正在加入寄语房间…</p>';}
    else if(mode==='adventure'){n.innerHTML='<strong>双设备闯关</strong><p id="device-status">连接中…</p><section class="host-card"><b>房主创建联机房间</b><button id="create-room">生成闯关房间并邀请</button></section><div class="join-card"><input id="device-room" maxlength="8" placeholder="输入邀请码加入"><button id="join-room">加入闯关房间</button></div><div id="invite-box" hidden><small>分享邀请链接</small><input id="invite-link" readonly><button id="copy-invite">复制邀请</button></div><small>房主可在菜单选择任意关卡；两台设备同步进入。</small>';}
    else{n.innerHTML='<strong>寄语模式 · 双设备合作</strong><p id="device-status">连接中…</p><section class="host-card"><b>创建专属贺卡</b><input id="card-to" maxlength="24" placeholder="贺卡给谁，例如：洛小白"><textarea id="card-message" maxlength="160" placeholder="写下想说的话"></textarea><input id="card-from" maxlength="24" placeholder="落款，例如：—— 与你同行"><button id="create-room">生成房间并邀请</button></section><div class="join-card"><input id="device-room" maxlength="8" placeholder="输入邀请码加入"><button id="join-room">加入第一关</button></div><div id="invite-box" hidden><small>分享邀请链接</small><input id="invite-link" readonly><button id="copy-invite">复制邀请</button></div><small>房主控制火人，受邀玩家控制冰人</small>';}
    document.body.appendChild(n);var roomInput=n.querySelector('#device-room');if(roomInput)roomInput.value=roomCode;
    var create=n.querySelector('#create-room');if(create)create.onclick=function(){var draft={to:n.querySelector('#card-to')?.value,message:n.querySelector('#card-message')?.value,from:n.querySelector('#card-from')?.value};send({type:'create',mode:mode,card:draft});status('正在生成联机房间…');};
    var join=n.querySelector('#join-room');if(join)join.onclick=function(){joinRoom(n.querySelector('#device-room').value);};
    var copy=n.querySelector('#copy-invite');if(copy)copy.onclick=function(){var input=n.querySelector('#invite-link');input.select();navigator.clipboard?.writeText(input.value).then(function(){status('邀请链接已复制');},function(){document.execCommand('copy');status('邀请链接已复制');});};
    return n;
  }
  function status(t){ panel().querySelector('#device-status').textContent=t; }
  function joinRoom(value){ roomCode=String(value||'').trim().toUpperCase(); if(roomCode.length<4)return status('房间码至少 4 位'); history.replaceState(null,'',location.pathname+'?mode='+mode+'&room='+roomCode); send({type:'join',mode:mode,roomId:roomCode}); }
  function saveCard(config){ card=config; try { sessionStorage.setItem('qixi-card:'+roomCode, JSON.stringify(config)); } catch (_) {} }
  function showInvite(){ var p=panel(), box=p.querySelector('#invite-box'), link=location.origin+location.pathname+'?mode='+mode+'&room='+roomCode; p.querySelector('#invite-link').value=link; box.hidden=false; }

  function controls(){ var root=document.getElementById('mobile-controls'); if(root)return root; root=document.createElement('div'); root.id='mobile-controls'; root.innerHTML='<div class="move-cluster"><button class="move-control" data-key="left" aria-label="向左">◀</button><button class="move-control" data-key="right" aria-label="向右">▶</button></div><button class="move-control jump-control" data-key="up" aria-label="跳跃">跳</button>'; document.body.appendChild(root); root.querySelectorAll('.move-control').forEach(function(button){ var key=button.dataset.key; function down(event){event.preventDefault();localInput[key]=true;button.classList.add('pressed');if(button.setPointerCapture)button.setPointerCapture(event.pointerId);} function up(event){event.preventDefault();localInput[key]=false;button.classList.remove('pressed');} button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);button.addEventListener('pointerleave',function(event){if(event.buttons===0)up(event);}); }); return root; }
  function bindKeyboard(){ function keyFor(event){var map=role==='fire'?{ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up'}:{KeyA:'left',KeyD:'right',KeyW:'up'};return map[event.code];} function update(event,down){if(event.target&&/INPUT|TEXTAREA/.test(event.target.tagName))return;var key=keyFor(event);if(!key)return;event.preventDefault();localInput[key]=down;} window.addEventListener('keydown',function(e){update(e,true);});window.addEventListener('keyup',function(e){update(e,false);});window.addEventListener('blur',function(){localInput={left:false,right:false,up:false};}); }
  function enterGameMode(){
    panel().classList.add('in-game');
    document.documentElement.classList.add('in-game');
  }
  function startAdventureMenu(){
    adventureReady=true; status(role==='fire'?'请选择任意关卡，队友会同步进入':'等待房主选择关卡…');
    controls().classList.add('visible'); enterGameMode();
  }
  function hookAdventureSelection(){
    var g=game(); if(mode!=='adventure'||role!=='fire'||!adventureReady||!g||!g.state||g.state.__adventureSyncHooked)return;
    g.state.__adventureSyncHooked=true; var original=g.state.start;
    g.state.start=function(name){var data=arguments[3];if(name==='level'&&data&&data.filename&&!adventureStarted){adventureStarted=true;send({type:'level-start',level:data});}return original.apply(this,arguments);};
  }
  function syncAdventureSelection(){
    hookAdventureSelection();
    if(mode!=='adventure'||role!=='fire'||!adventureReady||adventureStarted)return;
    var l=level(), data=l&&l.levelData;
    if(!data||!data.filename)return;
    var raw=JSON.stringify(data); if(raw===lastAdventureLevel)return;
    lastAdventureLevel=raw; adventureStarted=true; send({type:'level-start',level:data});
  }
  function startWhenReady(){ if(mode==='adventure') return startAdventureMenu(); window.__firstLevelStartRequested=true; window.dispatchEvent(new Event('first-level:start')); controls().classList.add('visible'); enterGameMode(); }
  function launchAdventureLevel(data){
    if(role!=='water'||!data||adventureStarted)return; adventureStarted=true;
    function launch(LevelState){var g=game();if(!g||!g.state||g.state.current!=='menu'||!g.cache.getBitmapFont('font'))return setTimeout(function(){launch(LevelState);},250);g.settings.controls='keyboard';if(g.settingsSignal)g.settingsSignal.dispatch('controls');g.currentTemple={id:(data.elements&&data.elements[0])||'forest',label:'Temple',elements:data.elements||['forest']};g.state.add('level',LevelState);g.state.start('level',true,false,data);}
    function requireLevel(){if(!window.require)return setTimeout(requireLevel,200);window.require(['States/Level/Level'],launch);} requireLevel();
  }
  function connect(){ socket=new WebSocket((location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/ws'); socket.onopen=function(){status(invitedMessageGuest?'正在加入寄语房间…':(roomCode.length>=4?'正在加入房间…':'请选择创建或加入'));if(roomCode.length>=4)send({type:'join',mode:mode,roomId:roomCode});};socket.onclose=function(){status('已断开，重连中…');setTimeout(connect,1200);};socket.onmessage=function(e){var m=JSON.parse(e.data);if(m.type==='joined'){role=m.role;roomCode=m.roomId||roomCode;var input=panel().querySelector('#device-room');if(input)input.value=roomCode;if(m.owner)showInvite();if(!invitedMessageGuest)status('你控制：'+(role==='fire'?'火人（房主）':'冰人'));}else if(m.type==='room'){if(m.card)saveCard(m.card);if(m.isReady){if(mode==='message'&&!invitedMessageGuest)status('队友已就绪，正在进入第一关');startWhenReady();}else if(!invitedMessageGuest)status(mode==='adventure'?'等待联机队友（1/2）':'等待受邀玩家（1/2）');}else if(m.type==='level-start'&&mode==='adventure')launchAdventureLevel(m.level);else if(m.type==='input'&&role==='fire')remoteInput=m.input;else if(m.type==='state'&&role==='water')apply(m.state);else if(m.type==='error')status(m.message);}; }
  function setInput(which,v){var x=character(which)?.cursors;if(!x)return;['left','right','up'].forEach(function(k){if(x[k])x[k].isDown=!!v[k];});} function snapshot(c){if(!c?.body)return null;var v=c.body.data.GetLinearVelocity();return{x:c.body.x,y:c.body.y,vx:v.x,vy:v.y};} function apply(s){var l=level();if(!l||!s)return;['fire','water'].forEach(function(k){var c=k==='fire'?l.pers1:l.pers2,d=s[k];if(c&&d){c.body.x=d.x;c.body.y=d.y;c.body.data.SetLinearVelocity(new box2d.b2Vec2(d.vx||0,d.vy||0));}});}
  setInterval(function(){if(!role||!level())return;syncAdventureSelection();var raw=JSON.stringify(localInput);if(raw!==last){send({type:'input',input:localInput});last=raw;}if(role==='fire'){setInput('fire',localInput);setInput('water',remoteInput);var l=level();send({type:'state',state:{fire:snapshot(l.pers1),water:snapshot(l.pers2)}});}else setInput('fire',{left:false,right:false,up:false});},30);
  panel(); controls(); bindKeyboard(); connect();
}());
