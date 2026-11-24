import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';

test('微信事件迁移保留旧事件的全部字段、索引和外键约束',async()=>{
  const db=new DatabaseSync(':memory:');
  try{
    for(const name of ['0001_admin.sql','0002_event_receipt_time.sql','0003_visitor_context.sql'])db.exec(await readFile(new URL('../migrations/'+name,import.meta.url),'utf8'));
    db.exec(`INSERT INTO visitors VALUES('visitor',1,2);
      INSERT INTO visits(id,visitor_id,started_at,last_seen,entry_page,source,channel) VALUES('visit','visitor',1,2,'/es/contact/','google','organic_search');
      INSERT INTO events(id,occurred_at,received_at,visitor_id,visit_id,type,page,product,language,position,target,source,channel,country,device,is_internal,is_bot)
      VALUES('event',100,120,'visitor','visit','email_click','/es/contact/','CBB65','es','footer_email_2','/contact/','google','organic_search','ES','mobile',1,0);`);
    const before={...db.prepare('SELECT * FROM events').get()};
    db.exec(await readFile(new URL('../migrations/0004_attribution_contact_details.sql',import.meta.url),'utf8'));
    assert.deepEqual({...db.prepare('SELECT * FROM events').get()},before);
    assert.deepEqual({...db.prepare('SELECT referrer_url,utm_medium,utm_campaign FROM visits').get()},{referrer_url:'',utm_medium:'',utm_campaign:''});
    db.exec(`INSERT INTO events(id,occurred_at,visitor_id,visit_id,type,page,source,channel,country,device) VALUES('wechat',200,'visitor','visit','wechat_click','/about/','google','organic_search','unknown','desktop')`);
    assert.throws(()=>db.exec(`INSERT INTO events(id,occurred_at,visitor_id,visit_id,type,page,source,channel,country,device) VALUES('invalid',200,'visitor','visit','fake','/','unknown','unknown','unknown','desktop')`),/CHECK/);
    assert.throws(()=>db.exec(`DELETE FROM visits WHERE id='visit'`),/FOREIGN KEY/);
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
    const indexes=db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='events'").all().map(row=>row.name);
    for(const name of ['events_time','events_visitor_time','events_visit','events_product_time','events_source_time','events_channel_time'])assert.ok(indexes.includes(name),name);
  }finally{db.close();}
});
