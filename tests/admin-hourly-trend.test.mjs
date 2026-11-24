import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seriesSegments,trendLabels} from '../public/admin-assets/trend-chart.js';
test('单日图例明确今日/昨日、昨日/前日，按服务器北京时间判断',()=>{
  const generatedAt=Date.parse('2026-11-05T16:00:00Z');
  const data={generatedAt,trendGranularity:'hour',period:{from:'2026-11-06',previousFrom:'2026-11-05'}};
  assert.deepEqual(trendLabels(data),{current:'今日 11-06（实线）',previous:'昨日 11-05（虚线）'});
  assert.deepEqual(trendLabels({...data,period:{from:'2026-11-05',previousFrom:'2026-11-04'}}),{current:'昨日 11-05（实线）',previous:'前日 11-04（虚线）'});
  assert.deepEqual(trendLabels({...data,period:{from:'2026-10-31',previousFrom:'2026-10-30'}}),{current:'10-31（实线）',previous:'10-30（虚线）'});
});
test('今日实线到已开始小时为止，虚线保留昨日完整 24 小时',()=>{
  const points=Array.from({length:24},(_,hour)=>({hour,current:hour<=14?{page_views:hour}:null,previous:{page_views:23-hour}}));
  const current=seriesSegments(points,'current','page_views'),previous=seriesSegments(points,'previous','page_views');
  assert.equal(current.length,1);assert.equal(current[0].length,15);assert.equal(current[0].at(-1).index,14);
  assert.equal(current[0][0].value,0);assert.equal(previous[0].length,24);assert.equal(previous[0].at(-1).index,23);
  assert.ok(current.flat().every(point=>point.index<15));
});
test('空缺不能被折线连接，真实零值仍保留',()=>{
  assert.deepEqual(seriesSegments([{current:{page_views:2}},{current:null},{current:{}},{current:{page_views:1}}],'current','page_views'),[[{index:0,value:2}],[{index:2,value:0},{index:3,value:1}]]);
  assert.deepEqual(seriesSegments([{current:null},{current:null}],'current','page_views'),[]);
  assert.equal(seriesSegments(Array.from({length:24},()=>({previous:{}})),'previous','page_views')[0].length,24);
});
