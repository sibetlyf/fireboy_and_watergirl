import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

for (const file of ['Dockerfile', 'docker-compose.yml', 'README.md']) {
  assert.ok(existsSync(file), `缺少部署文件：${file}`);
}
const compose = readFileSync('docker-compose.yml', 'utf8');
assert.match(compose, /ports:\s*\n\s*- "3000:3000"/);
assert.match(compose, /restart: unless-stopped/);
const readme = readFileSync('README.md', 'utf8');
assert.match(readme, /docker compose up -d --build/);
console.log('一键部署文件检查通过');
