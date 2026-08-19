import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = '新建文件夹 (2)';
const index = readFileSync(`${root}/index.html`, 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

assert.ok(existsSync(`${root}/first-level.js`), '缺少第一关启动适配器');
assert.ok(existsSync(`${root}/mobile-controls.css`), '缺少移动端触控样式');
assert.match(readFileSync(`${root}/first-level.js`, 'utf8'), /settings\.controls\s*=\s*'dual'/);
assert.match(readFileSync(`${root}/first-level.js`, 'utf8'), /tutorial_forest\.json/);
assert.doesNotMatch(index, /online\.js/);
assert.doesNotMatch(index, /online\.css/);
assert.ok(!packageJson.dependencies?.ws, '不应保留 WebSocket 通信依赖');
assert.doesNotMatch(readFileSync('server.mjs', 'utf8'), /WebSocketServer/);
console.log('首关双人移动版结构检查通过');
