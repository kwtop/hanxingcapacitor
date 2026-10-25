import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { passwordHash } from './admin-password.mjs';
const root=new URL('../',import.meta.url),vars=new URL('.dev.vars',root),credentials=new URL('.admin-local/access.txt',root);
let existing;try{existing=await readFile(vars,'utf8');}catch{}
if(!existing){
  const password=randomBytes(18).toString('base64url'),email='admin@hanxing.local';
  await mkdir(new URL('.admin-local/',root),{recursive:true});
  await writeFile(vars,[`APP_ENV=local`,`APP_SECRET=${randomBytes(32).toString('hex')}`,`ALLOWED_ORIGINS=http://127.0.0.1:4340,http://127.0.0.1:4342,http://localhost:4340,http://localhost:4342`,`ADMIN_AUTH_MODE=password`,`ADMIN_EMAIL=${email}`,`ADMIN_PASSWORD_HASH='${passwordHash(password)}'`,''].join('\n'),{flag:'wx',mode:0o600});
  await writeFile(credentials,`仅用于本地后台，禁止提交到 Git。\n后台：http://127.0.0.1:4342/admin/\n邮箱：${email}\n密码：${password}\n`,{flag:'wx',mode:0o600});
  console.log('已生成独立的本地管理员；登录信息保存在 .admin-local/access.txt。');
}else console.log('沿用现有 .dev.vars，未覆盖凭据。');
const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local','--config','wrangler.backend.jsonc','--persist-to','.wrangler/state'],{cwd:root,stdio:'inherit',windowsHide:true});
if(result.status!==0)process.exit(result.status||1);
console.log('本地 D1 已准备好。运行 npm run dev:admin 启动网站与后台。未修改远程资源。');
