/**
 * WARDROBE AI - Strix Automated Security Testing Runner
 * Official usestrix/strix local white-box security assessment runner.
 */

import { spawnSync } from 'child_process';

console.log('🛡️  ==========================================');
console.log('🛡️  WARDROBE AI - STRIX SECURITY ASSESSMENT');
console.log('🛡️  ==========================================\n');

// 1. Check Strix installation
const strixVersion = spawnSync('strix', ['--version'], { encoding: 'utf8', shell: true });
if (strixVersion.status !== 0) {
  console.error('❌ Strix CLI is not installed.');
  console.log('👉 Install via pipx: pipx install strix-agent');
  process.exit(1);
}
console.log(`✅ Strix CLI verified: ${strixVersion.stdout.trim()}`);

// 2. Check Docker availability
const dockerCheck = spawnSync('docker', ['info'], { encoding: 'utf8', shell: true });
if (dockerCheck.status !== 0) {
  console.warn('\n⚠️  [STRIX ENVIRONMENT PREREQUISITE]');
  console.warn('Docker daemon is not running or docker CLI is not found on PATH.');
  console.warn('Strix requires Docker sandbox containerization to execute isolated white-box tests.');
  console.warn('Blocker: Environment lacks active Docker engine. Skipping dynamic container sandbox.');
  console.log('\n📄 Documented in SECURITY.md under Strix Environmental Readiness.');
  process.exit(0);
}

// 3. Check LLM API key
const llmKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
if (!llmKey) {
  console.warn('\n⚠️  [STRIX LLM CREDENTIAL REQUIREMENT]');
  console.warn('No LLM API Key configured (STRIX_LLM / LLM_API_KEY / OPENAI_API_KEY).');
  console.warn('Per security guidelines: Strix requires LLM provider credentials to guide penetration testing.');
  console.warn('Blocker: LLM provider key unconfigured. Never inventing credentials.');
  process.exit(0);
}

// 4. Run authorized white-box scan against current project
console.log('\n🚀 Launching authorized Strix white-box penetration scan...');
const strixRun = spawnSync(
  'strix',
  ['-n', '-t', './', '--scan-mode', 'quick', '--max-budget', '10'],
  { stdio: 'inherit', shell: true }
);

process.exit(strixRun.status || 0);
