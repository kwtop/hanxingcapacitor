import {spawn} from 'node:child_process';
import {access} from 'node:fs/promises';
await access(new URL('../.dev.vars',import.meta.url)).catch(()=>{throw new Error('先运行 npm run setup:admin。');});
const backend=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--config','wrangler.backend.jsonc','--local','--ip','127.0.0.1','--port','8796','--persist-to','.wrangler/state'],{stdio:'inherit',windowsHide:true});
let frontend;
const stop=()=>{backend.kill();frontend?.kill();};process.on('SIGINT',stop);process.on('SIGTERM',stop);
backend.on('exit',code=>{frontend?.kill();if(code)process.exitCode=code;});
for(let attempt=0;attempt<90;attempt++){
  try{const response=await fetch('http://127.0.0.1:8796/api/health');if(response.ok&&(await response.json()).app==='hanxing-admin')break;}catch{}
  if(attempt===89){stop();throw new Error('本地后台未就绪，请检查上方 Wrangler 输出。');}
  await new Promise(resolve=>setTimeout(resolve,500));
}
frontend=spawn(process.execPath,['node_modules/astro/bin/astro.mjs','dev','--ignore-lock','--host','127.0.0.1','--port','4342'],{stdio:'inherit',windowsHide:true,env:{...process.env,HANXING_VISUAL_PREVIEW:'satechi',LOCAL_BACKEND_URL:'http://127.0.0.1:8796'}});
frontend.on('exit',code=>{backend.kill();if(code)process.exitCode=code;});
