import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync('新建文件夹 (2)/index.html', 'utf8');
assert.match(index, /DOMContentLoaded/);
assert.match(index, /document\.body\.appendChild\(panel\)/);
assert.match(index, /mode-selector/);
assert.match(index, /data-mode="adventure"/);
assert.match(index, /data-mode="message"/);
console.log('入口模式选择内联兜底检查通过');
