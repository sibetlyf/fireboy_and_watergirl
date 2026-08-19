import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.match(device, /showAdventurePicker/);
assert.match(device, /data\/elements/);
assert.match(device, /selectAdventureLevel/);
assert.match(device, /type:'level-start'/);
assert.match(css, /#adventure-picker/);
console.log('闯关模式房主选关界面检查通过');
