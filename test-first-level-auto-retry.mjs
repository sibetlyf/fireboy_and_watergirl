import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hook = readFileSync('新建文件夹 (2)/qixi-finale.js', 'utf8');
assert.match(hook, /level\.gameOver/);
assert.match(hook, /currentLevel\.retry\(\)/);
assert.match(hook, /__qixiAutoRetryPatched/);
assert.match(hook, /__qixiAutoRetryPending/);
assert.match(hook, /setTimeout/);
assert.match(hook, /isFirstLevel/);
console.log('首关失败自动重开钩子检查通过');
