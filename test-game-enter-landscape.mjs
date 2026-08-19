import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.match(script, /classList\.add\('in-game'\)/);
assert.doesNotMatch(script, /requestGameLandscape|orientation-guard|orientation\.lock/);
assert.match(css, /#device-panel\.in-game,#device-panel\.silent-invite\{display:none/);
assert.match(css, /#mobile-controls\.visible\{display:block/);
console.log('首关入场收起面板与移动端原生竖屏布局检查通过');
