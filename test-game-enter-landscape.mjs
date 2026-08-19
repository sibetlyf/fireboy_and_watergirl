import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.match(script, /classList\.add\('in-game'\)/);
assert.match(script, /screen\.orientation\.lock\('landscape'\)/);
assert.match(script, /orientation-guard/);
assert.match(css, /#device-panel\.in-game\{display:none/);
assert.match(css, /@media \(orientation:portrait\) and \(max-width:900px\)\{html\.in-game #orientation-guard\{display:flex/);
assert.match(css, /#orientation-guard\{display:none/);
console.log('首关入场收起面板与移动端横屏引导检查通过');
