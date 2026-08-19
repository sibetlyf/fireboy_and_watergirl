import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.doesNotMatch(page, /class="bridge/);
assert.match(page, /particle-canvas/);
assert.match(page, /shapeCycle/);
assert.match(page, /THREE\.Points/);
assert.match(page, /setInterval.*5000/);
assert.match(page, /particles\.position\.y=1\.8/);
console.log('v3 无桥 + 5 秒 Three.js 粒子背景结构检查通过');