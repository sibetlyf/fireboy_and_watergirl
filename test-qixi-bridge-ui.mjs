import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(page, /bridge-keystone/);
assert.match(page, /bridge-pier/);
assert.match(page, /bridge-lamp/);
assert.match(page, /bridge-water/);
assert.match(page, /bridge-arches/);
assert.match(page, /bridge-stones/);
assert.match(page, /bridge-reflection/);
assert.match(page, /water-ripples/);
console.log('高级三孔鹊桥主视觉结构检查通过');
