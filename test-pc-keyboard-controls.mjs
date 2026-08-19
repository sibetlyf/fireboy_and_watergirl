import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
assert.match(device, /keydown/);
assert.match(device, /keyup/);
assert.match(device, /ArrowLeft/);
assert.match(device, /ArrowRight/);
assert.match(device, /ArrowUp/);
assert.match(device, /KeyA/);
assert.match(device, /KeyD/);
assert.match(device, /KeyW/);
assert.match(device, /localInput\[key\]\s*=\s*down/);
console.log('PC 键盘双角色持续输入检查通过');
