import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dateRange,matchingPreset} from '../public/admin-assets/date-ranges.js';
test('快捷范围按北京时间跨日，最近 N 天包含今日',()=>{
  const now=Date.parse('2026-11-05T16:00:00Z');
  assert.deepEqual(dateRange('today',now),{from:'2026-11-06',to:'2026-11-06'});
  assert.deepEqual(dateRange('yesterday',now),{from:'2026-11-05',to:'2026-11-05'});
  assert.deepEqual(dateRange('7days',now),{from:'2026-10-31',to:'2026-11-06'});
  assert.deepEqual(dateRange('30days',now),{from:'2026-10-08',to:'2026-11-06'});
  assert.deepEqual(dateRange('today',now-1),{from:'2026-11-05',to:'2026-11-05'});
});
test('跨年与闰日正确，历史书签与自定义日期不会被覆盖',()=>{
  assert.deepEqual(dateRange('yesterday',Date.parse('2027-01-01T04:00:00Z')),{from:'2026-12-31',to:'2026-12-31'});
  assert.deepEqual(dateRange('yesterday',Date.parse('2028-03-01T04:00:00Z')),{from:'2028-02-29',to:'2028-02-29'});
  const now=Date.parse('2026-11-06T04:00:00Z');
  assert.equal(matchingPreset('2026-10-31','2026-11-06',now),'7days');
  assert.equal(matchingPreset('2026-10-01','2026-10-09',now),'custom');
});
