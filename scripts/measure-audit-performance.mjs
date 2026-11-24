import { createRequire } from 'node:module';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const phase = process.argv[2];
const cli = process.argv[3];
if (!['before', 'after'].includes(phase) || !cli) throw new Error('Use: node scripts/measure-audit-performance.mjs before|after <installed Lighthouse CLI>');
const require = createRequire('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');
const directory = path.resolve('.qa/audit-remediation-20261105/performance-' + phase);
const docs = path.resolve('docs/audit-remediation-20261105');
await mkdir(directory, { recursive: true });
await mkdir(docs, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--remote-debugging-port=9247'] });
const targets = [['home', '/'], ['cbb65', '/products/cbb65-air-conditioner-capacitor/'], ['guide', '/resources/cbb60-capacitor-dimensions-chart/']];
const result = [];
try {
  for (let round = 1; round <= 3; round++) for (const [label, route] of targets) {
    const output = path.join(directory, label + '-' + round + '.json');
    const code = await new Promise(resolve => {
      const child = spawn(process.execPath, [cli, 'https://www.hanxingcapacitor.com' + route, '--port=9247', '--only-categories=performance', '--output=json', '--output-path=' + output, '--quiet'], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
      let error = '';
      child.stderr.on('data', chunk => error += chunk);
      child.on('close', code => { if (code) console.log(JSON.stringify({ label, round, error: error.slice(-600) })); resolve(code); });
    });
    if (code !== 0) throw new Error('Lighthouse failed: ' + label);
    const lhr = JSON.parse(await readFile(output, 'utf8'));
    if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError));
    const requests = lhr.audits['network-requests']?.details?.items || [];
    const row = { label, route, round, measuredAt: lhr.fetchTime, version: lhr.lighthouseVersion, config: lhr.configSettings, finalUrl: lhr.finalDisplayedUrl,
      score: Math.round(lhr.categories.performance.score * 100), lcp: lhr.audits['largest-contentful-paint'].numericValue,
      fcp: lhr.audits['first-contentful-paint'].numericValue, cls: lhr.audits['cumulative-layout-shift'].numericValue,
      tbt: lhr.audits['total-blocking-time'].numericValue, totalBytes: lhr.audits['total-byte-weight'].numericValue,
      errors: requests.filter(r => r.statusCode >= 400).map(r => [r.statusCode, r.url]),
      topAssets: [...requests].sort((a, b) => b.transferSize - a.transferSize).slice(0, 8).map(r => ({ url: r.url, bytes: r.transferSize, type: r.resourceType })),
      lcpBreakdown: lhr.audits['lcp-breakdown-insight']?.details, lcpDiscovery: lhr.audits['lcp-discovery-insight']?.details };
    result.push(row);
    const median = nums => [...nums].sort((a,b) => a-b)[Math.floor(nums.length / 2)];
    const medians = targets.map(([label, route]) => { const rows = result.filter(r => r.label === label); return { label, route, runs: rows.length, lcp: median(rows.map(r => r.lcp)), cls: median(rows.map(r => r.cls)), totalBytes: median(rows.map(r => r.totalBytes)), score: median(rows.map(r => r.score)) }; });
    await writeFile(path.join(docs, 'performance-' + phase + '.json'), JSON.stringify({ method: 'Sequential Lighthouse default mobile simulated throttling, same installed Chrome and Lighthouse; laboratory measurements, not field CWV.', result, medians }, null, 2) + '\n');
    console.log(JSON.stringify({ phase, label, round, score: row.score, lcp: row.lcp, cls: row.cls, totalBytes: row.totalBytes, errors: row.errors.length }));
  }
} finally { await browser.close(); }
