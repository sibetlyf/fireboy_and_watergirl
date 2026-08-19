import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const first = readFileSync('新建文件夹 (2)/first-level.js', 'utf8');
const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
assert.match(first, /game\.state\.current!==\s*'menu'/);
assert.match(first, /getBitmapFont\('font'\)/);
assert.doesNotMatch(device, /setInput\('water',\{left:false,right:false,up:false\}\)/);
assert.match(device, /send\(\{type:'input',input:localInput\}\)/);
console.log('双设备资源就绪与水人持续输入检查通过');
