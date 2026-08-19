import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync('新建文件夹 (2)/qixi-finale.js', 'utf8');
let retryCount = 0;
const level = {
  levelData: { id: 0 },
  ui: { clock: { stop() {} } },
  gameFinish() {},
  gameOver() {},
  retry() { retryCount += 1; }
};
const timers = [];
const context = {
  window: { PIXI: { game: { level } }, location: { replace() {} } },
  setTimeout(callback, ms) { timers.push({ callback, ms }); return timers.length; }
};
vm.runInNewContext(source, context);
level.gameOver();
level.gameOver();
const retryTimer = timers.find(t => t.ms === 700);
assert.ok(retryTimer, '未注册 700ms 自动重开');
retryTimer.callback();
assert.equal(retryCount, 1, '失败后应只自动重开一次');
console.log('首关失败后自动重开行为验证通过');
