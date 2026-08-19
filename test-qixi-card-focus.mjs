import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(page, /canvas\.three-bg\{[^}]*opacity:1/);
assert.match(page, /pts\.scale\.set\(1\.08,1\.08,1\.08\)/);
assert.match(page, /qixi-message-card/);
assert.match(page, /给洛小白/);
assert.match(page, /星河见证/);
assert.match(page, /constellation\{[^}]*z-index:12/);
assert.match(page, /\.reveal \.card\{opacity:0/);
assert.match(page, /\.quote\{[^}]*bottom:62%/);
console.log('清晰粒子、前置星座与下方洛小白贺卡检查通过');