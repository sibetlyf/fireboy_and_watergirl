import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(page, /meteor-field/);
assert.match(page, /meteor\.className\s*=\s*'meteor'/);
assert.match(page, /createMeteorShower/);
assert.match(page, /--meteor-duration/);
assert.match(page, /@keyframes meteorFall/);
assert.match(page, /prefers-reduced-motion/);
console.log('七夕流星雨动效结构检查通过');
