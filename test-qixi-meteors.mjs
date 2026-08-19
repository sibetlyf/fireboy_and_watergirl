import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(page, /star-field/);
assert.match(page, /shooting-star/);
assert.match(page, /shootingStar/);
assert.match(page, /@keyframes shoot/);
assert.match(page, /createStars/);
assert.match(page, /taurus-constellation/);
assert.match(page, /cancer-constellation/);
console.log('七夕星空、低频单颗流星与双星座结构检查通过');