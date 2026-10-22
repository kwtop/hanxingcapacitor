import { spawn } from 'node:child_process';
// Astro 7 supports independent local servers with this flag; do not replace the original server.
const child = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--ignore-lock', '--host', '127.0.0.1', '--port', '4340', ...process.argv.slice(2)], {
  stdio: 'inherit', env: {...process.env, HANXING_VISUAL_PREVIEW: 'satechi'}, windowsHide: true,
});
child.on('exit', code => process.exit(code ?? 1));
process.on('SIGINT', () => child.kill('SIGINT'));
