import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
assert.match(device, /if\(role==='fire'\)\{ setInput\('fire',localInput\); setInput\('water',remoteInput\)/);
assert.match(device, /else \{ setInput\('fire',\{left:false,right:false,up:false\}\); \}/);
assert.doesNotMatch(device, /setInput\('water',localInput\)/);
console.log('火人房主权威物理与水人远程渲染检查通过');
