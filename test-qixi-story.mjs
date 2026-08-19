import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hook = readFileSync('新建文件夹 (2)/qixi-finale.js', 'utf8');
const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(hook, /gameFinish/);
assert.match(hook, /location\.replace\('qixi-finale\.html'\)/);
assert.match(page, /particle-canvas/);
assert.match(page, /assets\/qixi\/fire-complete-0\.png/);
assert.match(page, /assets\/qixi\/water-complete-0\.png/);
assert.match(page, /particle-canvas/);
assert.match(page, /洛小白/);
console.log('独立七夕页面与首关跳转检查通过');