import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(page, /fire-complete-0\.png/);
assert.match(page, /water-complete-0\.png/);
assert.match(page, /card-cover/);
assert.match(page, /card-inside/);
assert.match(page, /card-open/);
assert.match(page, /bridge-arch/);
assert.match(page, /bridge-rail/);
assert.match(page, /prefers-reduced-motion/);
console.log('完整角色帧、贺卡展开与高级鹊桥结构检查通过');
