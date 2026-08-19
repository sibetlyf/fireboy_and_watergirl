import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const entry = readFileSync('新建文件夹 (2)/index.html', 'utf8');
const force = readFileSync('新建文件夹 (2)/force-landscape.js', 'utf8');
const selector = readFileSync('新建文件夹 (2)/mode-selector.js', 'utf8');
const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.match(entry, /force-landscape\.js/);
assert.doesNotMatch(force, /requestFullscreen|orientation\.lock/);
assert.match(force, /mobile-game-layout/);
assert.match(force, /classList\.toggle\('force-landscape'/);
assert.match(selector, /requestGameLandscape/);
assert.match(device, /requestGameLandscape/);
assert.doesNotMatch(device, /orientation-guard|orientation\.lock/);
assert.match(css, /html\.mobile-game-layout #root\{[^}]*width:100vh[^}]*height:100vw[^}]*rotate\(90deg\)/);
assert.match(css, /html\.mobile-game-layout #mobile-controls/);
assert.doesNotMatch(css, /请旋转设备|html\.in-game:not\(\.force-landscape\)/);
console.log('移动端网页横向布局与无全屏锁定检查通过');
