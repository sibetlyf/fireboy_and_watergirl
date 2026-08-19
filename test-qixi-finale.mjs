import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const hook = '新建文件夹 (2)/qixi-finale.js';
const page = '新建文件夹 (2)/qixi-finale.html';
assert.ok(existsSync(hook), '缺少首关结局跳转脚本');
assert.ok(existsSync(page), '缺少独立七夕结局页面');
const hookSource = readFileSync(hook, 'utf8');
const pageSource = readFileSync(page, 'utf8');
assert.match(hookSource, /gameFinish/);
assert.match(hookSource, /location\.replace\('qixi-finale\.html'\)/);
assert.match(pageSource, /与其说你美好，不如说，你不可重复/);
assert.match(pageSource, /class="bridge"/);
assert.match(pageSource, /class="card"/);
console.log('七夕首关结算跳转与独立演出结构检查通过');
