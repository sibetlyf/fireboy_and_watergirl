import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
assert.match(device, /type:'create'/);
assert.match(device, /生成房间并邀请/);
assert.match(device, /invite-link/);
assert.match(device, /sessionStorage\.setItem/);
assert.match(page, /qixi-card:/);
assert.match(page, /qixi-card:/);
assert.match(page, /qixi-message-card/);
console.log('房主创建邀请与自定义结局贺卡检查通过');