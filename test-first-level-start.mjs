import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const first = readFileSync('新建文件夹 (2)/first-level.js', 'utf8');
const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
assert.match(first, /first-level:start/);
assert.doesNotMatch(first, /waitForGame\(\);\s*$/);
assert.match(device, /first-level:start/);
assert.match(device, /m\.isReady/);
console.log('双设备就绪后启动首关检查通过');
