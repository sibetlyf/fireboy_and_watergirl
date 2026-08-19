import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const entry = readFileSync('新建文件夹 (2)/index.html', 'utf8');
const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.doesNotMatch(entry, /force-landscape\.js/);
assert.doesNotMatch(device, /requestGameLandscape|orientation-guard|orientation\.lock/);
assert.doesNotMatch(css, /force-landscape|mobile-game-layout|rotate\(90deg\)|width:100vh;height:100vw/);
assert.match(css, /#mobile-controls\.visible\{display:block/);
assert.match(css, /\.move-cluster/);
assert.match(css, /\.jump-control/);
console.log('移动端原生竖屏布局检查通过');
