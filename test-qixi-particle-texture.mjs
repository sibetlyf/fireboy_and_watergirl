import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
assert.match(page, /createParticleTexture/);
assert.match(page, /createRadialGradient/);
assert.match(page, /map:particleTexture/);
assert.match(page, /alphaTest/);
console.log('柔边圆形粒子纹理检查通过');
