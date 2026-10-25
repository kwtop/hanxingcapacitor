import { pbkdf2Sync, randomBytes } from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
export function passwordHash(password) {
  const salt=randomBytes(16);
  return `pbkdf2_sha256$100000$${salt.toString('hex')}$${pbkdf2Sync(password,salt,100000,32,'sha256').toString('hex')}`;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  if(!process.stdin.isTTY){
    let input='';for await(const chunk of process.stdin)input+=chunk;
    const password=input.trim();if(password.length<14)throw new Error('Use a password with at least 14 characters.');
    process.stdout.write(passwordHash(password)+'\n');
  }else{
    // The password is entered invisibly; only its salted hash is printed.
    process.stdout.write('管理员新密码（至少 14 位，输入不显示）：');
    process.stdin.setRawMode(true);process.stdin.resume();let password='';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data',chunk=>{
      for(const char of chunk){
        if(char==='\u0003'){process.stdin.setRawMode(false);process.exit(1);}
        if(char==='\r'||char==='\n'){process.stdin.setRawMode(false);process.stdin.pause();if(password.length<14){process.stderr.write('\n密码至少 14 位。\n');process.exitCode=1;}else process.stdout.write('\n'+passwordHash(password)+'\n');process.stdin.removeAllListeners('data');return;}
        if(char==='\u007f'||char==='\b')password=password.slice(0,-1);else if(char>=' ')password+=char;
      }
    });
  }
}
