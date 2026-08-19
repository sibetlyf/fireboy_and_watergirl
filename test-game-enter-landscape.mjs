import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.match(script, /classList\.add\('in-game'\)/);
assert.match(script, /requestGameLandscape/);
assert.doesNotMatch(script, /orientation-guard|orientation\.lock/);
assert.match(css, /#device-panel\.in-game,#device-panel\.silent-invite\{display:none/);
assert.match(css, /html\.mobile-game-layout #root/);
assert.match(css, /html\.mobile-game-layout #mobile-controls/);
console.log('首关入场收起面板与移动端网页横向布局检查通过');
