import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('.', import.meta.url).pathname.replace(/^\//, '');
const packagePath = join(root, 'package.json');
const serverPath = join(root, 'server.mjs');

assert.ok(existsSync(packagePath), '缺少 package.json');
assert.ok(existsSync(serverPath), '缺少 server.mjs');

const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
assert.equal(pkg.scripts.start, 'node server.mjs');
assert.equal(pkg.scripts.test, 'node test-server.mjs && node test-deploy.mjs && node test-qixi-finale.mjs && node test-first-level-online.mjs');
assert.equal(pkg.type, 'module');
assert.match(readFileSync(serverPath, 'utf8'), /新建文件夹 \(2\)/);
console.log('Node.js 部署结构检查通过');
