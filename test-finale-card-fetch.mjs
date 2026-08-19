import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const server = readFileSync('server.mjs', 'utf8');
const finale = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(server, /cardMatch/);
assert.match(server, /getFinaleCard/);
assert.match(server, /saveFinaleCard/);
assert.match(finale, /fetch\('\/api\/rooms\//);
assert.match(finale, /applyCard/);
console.log('结局服务端贺卡回读结构检查通过');
