import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hook = readFileSync('新建文件夹 (2)/qixi-finale.js', 'utf8');
const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(hook, /location\.replace\('qixi-finale\.html'\)/);
assert.match(hook, /gameFinish/);
assert.match(page, /assets\/qixi\/fire-complete-0\.png/);
assert.match(page, /assets\/qixi\/water-complete-0\.png/);
assert.match(page, /class="magpies"/);
assert.match(page, /@keyframes wing/);
assert.match(page, /洛小白/);
assert.match(page, /重新播放/);
console.log('首关结算跳转独立七夕结局页检查通过');
