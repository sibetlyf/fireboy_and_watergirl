import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(page, /fire-complete-0\.png/);
assert.match(page, /water-complete-0\.png/);
assert.match(page, /card-cover/);
assert.match(page, /card-inside/);
assert.match(page, /card-open/);
assert.doesNotMatch(page, /bridge-arch/);
assert.doesNotMatch(page, /bridge-rail/);
assert.match(page, /particle-canvas/);
assert.match(page, /shapeCycle/);
assert.match(page, /pts\.position\.y=1\.8/);
assert.match(page, /pts\.scale\.set\(1\.08,1\.08,1\.08\)/);
assert.match(page, /qixi-message-card/);
assert.match(page, /prefers-reduced-motion/);
console.log('完整角色帧、贺卡展开、星空与清晰放大粒子场景检查通过');