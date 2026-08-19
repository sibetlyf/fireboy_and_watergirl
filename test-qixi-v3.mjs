import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('新建文件夹 (2)/qixi-finale.html', 'utf8');
// 不该再有桥
assert.doesNotMatch(page, /class="bridge/);
assert.doesNotMatch(page, /class="bridge-arch/);
// 必须保留角色
assert.match(page, /fire-complete-0\.png/);
assert.match(page, /water-complete-0\.png/);
// Three.js 必需
assert.match(page, /three\.js/);
assert.match(page, /THREE\./);
assert.match(page, /PointsMaterial/);
// 自动切换形状
assert.match(page, /setInterval.*5000/);
assert.match(page, /shapeCycle/);
// 流星
assert.match(page, /meteor-field/);
// 贺卡
assert.match(page, /card-cover/);
assert.match(page, /洛小白/);
// 不依赖摄像头/MediaPipe
assert.doesNotMatch(page, /mediapipe/);
assert.doesNotMatch(page, /camera_utils/);

console.log('v3 无桥、Three.js 粒子、流星、贺卡、角色完整性检查通过');