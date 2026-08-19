import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const script = '新建文件夹 (2)/qixi-finale.js';
const style = '新建文件夹 (2)/qixi-finale.css';
assert.ok(existsSync(script), '缺少七夕结局脚本');
assert.ok(existsSync(style), '缺少七夕结局样式');
const source = readFileSync(script, 'utf8');
assert.match(source, /与其说你美好，不如说，你不可重复/);
assert.match(source, /qixi-bridge/);
assert.match(source, /qixi-letter/);
assert.match(source, /gameFinish/);
console.log('七夕首关结局演出结构检查通过');
