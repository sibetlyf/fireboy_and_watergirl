import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const first = readFileSync('新建文件夹 (2)/first-level.js', 'utf8');
const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const style = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.match(first, /__firstLevelStartRequested/);
assert.match(device, /pointerdown/);
assert.match(device, /setPointerCapture/);
assert.match(device, /mobile-controls/);
assert.match(device, /localInput/);
assert.match(style, /\.move-control/);
assert.doesNotMatch(first, /settings\.controls\s*=\s*'dual'/);
console.log('双设备持续多点触控与可靠开局检查通过');
