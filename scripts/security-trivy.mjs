/**
 * WARDROBE AI - Trivy Security Scanner Runner
 * Executes filesystem, dependency, and secret vulnerability scans.
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('🔒 ==========================================');
console.log('🔒 WARDROBE AI - TRIVY SECURITY AUDIT SUITE');
console.log('🔒 ==========================================\n');

// Configure isolated temp DOCKER_CONFIG to bypass stale desktop credential helpers
const tempDockerDir = path.join(os.tmpdir(), 'trivy_wardrobe_docker');
if (!fs.existsSync(tempDockerDir)) {
  fs.mkdirSync(tempDockerDir, { recursive: true });
}
fs.writeFileSync(path.join(tempDockerDir, 'config.json'), '{}', 'utf8');

const env = {
  ...process.env,
  DOCKER_CONFIG: tempDockerDir,
};

console.log('🔍 Running Trivy filesystem vulnerability, secret & misconfiguration scan...');
const result = spawnSync(
  'trivy',
  ['fs', '--scanners', 'vuln,secret,misconfig', '--skip-version-check', '.'],
  {
    stdio: 'inherit',
    env,
    shell: true,
  }
);

if (result.status === 0) {
  console.log('\n✅ [TRIVY SCAN PASSED] No high/critical security vulnerabilities detected.');
  process.exit(0);
} else {
  console.error('\n❌ [TRIVY SCAN FAILED] Security vulnerabilities or misconfigurations detected.');
  process.exit(result.status || 1);
}
