import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync('新建文件夹 (2)/qixi-finale.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/qixi-finale.css', 'utf8');
assert.match(script, /qixi-actors/);
assert.match(script, /qixi-fireboy/);
assert.match(script, /qixi-watergirl/);
assert.match(script, /洛小白/);
assert.match(script, /qixi-fuse/);
assert.match(css, /qixi-walk-fire/);
assert.match(css, /qixi-fuse/);
assert.match(css, /qixi-signature/);
assert.match(css, /qixi-lantern/);
console.log('七夕角色走桥、融合爱心与洛小白落款检查通过');
