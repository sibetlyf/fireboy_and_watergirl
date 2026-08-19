import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const entry = readFileSync('新建文件夹 (2)/index.html', 'utf8');
const force = readFileSync('新建文件夹 (2)/force-landscape.js', 'utf8');
const selector = readFileSync('新建文件夹 (2)/mode-selector.js', 'utf8');
const device = readFileSync('新建文件夹 (2)/two-device.js', 'utf8');
const css = readFileSync('新建文件夹 (2)/mobile-controls.css', 'utf8');
assert.match(entry, /force-landscape\.js/);
assert.match(force, /requestFullscreen/);
assert.match(force, /orientation\.lock\('landscape'\)/);
assert.match(force, /sessionStorage\.setItem\('fbwg-force-landscape'/);
assert.match(force, /classList\.toggle\('force-landscape'/);
assert.match(selector, /requestGameLandscape/);
assert.match(device, /requestGameLandscape/);
assert.match(css, /html\.force-landscape #root\{[^}]*width:100vh[^}]*height:100vw[^}]*rotate\(90deg\)/);
assert.match(css, /html\.force-landscape #mobile-controls/);
assert.match(css, /html\.in-game:not\(\.force-landscape\) #mobile-controls\{display:none/);
console.log('点击强制横屏与竖屏横向缩放检查通过');
