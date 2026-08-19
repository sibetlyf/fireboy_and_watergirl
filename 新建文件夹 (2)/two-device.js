(function () {
  'use strict';
  var role, socket, roomCode = new URLSearchParams(location.search).get('room') || '', remoteInput = { left:false,right:false,up:false }, last = '';
  function game(){ return window.PIXI && window.PIXI.game; }
  function level(){ return game() && game().level; }
  function character(which){ var l=level(); return which === 'fire' ? l && l.pers1 : l && l.pers2; }
  function send(data){ if(socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data)); }
  function panel(){ var n=document.getElementById('device-panel'); if(n)return n; n=document.createElement('aside'); n.id='device-panel'; n.innerHTML='<strong>首关双设备合作</strong><p id="device-status">连接中…</p><input id="device-room" maxlength="8" placeholder="输入相同房间码"><button>加入第一关</button><small>第一台控制火人，第二台控制冰人</small>'; document.body.appendChild(n); n.querySelector('input').value=roomCode; n.querySelector('button').onclick=function(){roomCode=n.querySelector('input').value.trim().toUpperCase(); if(roomCode.length<4)return status('房间码至少 4 位'); history.replaceState(null,'',location.pathname+'?room='+roomCode); send({type:'join',roomId:roomCode});}; return n; }
  function status(t){ panel().querySelector('#device-status').textContent=t; }
  function connect(){ socket=new WebSocket((location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/ws'); socket.onopen=function(){status('请输入相同房间码');if(roomCode.length>=4)send({type:'join',roomId:roomCode});}; socket.onclose=function(){status('已断开，重连中…');setTimeout(connect,1200);}; socket.onmessage=function(e){var m=JSON.parse(e.data);if(m.type==='joined'){role=m.role;status('你控制：'+(role==='fire'?'火人':'冰人'));}else if(m.type==='room'){status(m.isReady?'队友已就绪，正在进入第一关':'等待另一台设备（1/2）');}else if(m.type==='input'&&role==='fire')remoteInput=m.input;else if(m.type==='state'&&role==='water')apply(m.state);else if(m.type==='error')status(m.message);}; }
  function input(which){var c=character(which),x=c&&c.cursors;return x?{left:!!x.left?.isDown,right:!!x.right?.isDown,up:!!x.up?.isDown}:{left:false,right:false,up:false};}
  function setInput(which,v){var x=character(which)?.cursors;if(!x)return;['left','right','up'].forEach(function(k){if(x[k])x[k].isDown=!!v[k];});}
  function snapshot(c){if(!c?.body)return null;var v=c.body.data.GetLinearVelocity();return{x:c.body.x,y:c.body.y,vx:v.x,vy:v.y};}
  function apply(s){var l=level();if(!l||!s)return;['fire','water'].forEach(function(k){var c=k==='fire'?l.pers1:l.pers2,d=s[k];if(c&&d){c.body.x=d.x;c.body.y=d.y;c.body.data.SetLinearVelocity(new box2d.b2Vec2(d.vx||0,d.vy||0));}});}
  setInterval(function(){if(!role||!level())return;var mine=input(role),raw=JSON.stringify(mine);if(raw!==last){send({type:'input',input:mine});last=raw;}if(role==='fire'){setInput('fire',mine);setInput('water',remoteInput);var l=level();send({type:'state',state:{fire:snapshot(l.pers1),water:snapshot(l.pers2)}});}else{setInput('fire',{left:false,right:false,up:false});setInput('water',{left:false,right:false,up:false});}},50);
  panel();connect();
}());
