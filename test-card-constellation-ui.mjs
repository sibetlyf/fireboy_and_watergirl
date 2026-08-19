import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(device, /left-constellation/);
assert.match(device, /right-constellation/);
assert.match(page, /CONSTELLATIONS/);
assert.match(page, /leftConstellation/);
assert.match(page, /rightConstellation/);
assert.match(page, /renderConstellation/);
console.log('双自定义星座选择与结局动态渲染检查通过');
