import fs from 'fs';
import path from 'path';

// Standard high-risk secret regex patterns (matching Gitleaks rules)
const SECRET_PATTERNS = [
  { name: 'Generic API Key', regex: /(?:api[_-]?key|apikey|secret|token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/i },
  { name: 'Private Key Block', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'AWS Access Key ID', regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
  { name: 'AWS Secret Key', regex: /(?:aws_secret_access_key|aws_secret_key)\s*[:=]\s*['"][a-zA-Z0-9\/+=]{40}['"]/i },
  { name: 'Stripe Secret/Restricted Key', regex: /(?:sk|rk)_live_[0-9a-zA-Z]{24,}/ },
  { name: 'JWT Secret Hardcoded', regex: /jwt_secret\s*[:=]\s*['"][^'"]+['"]/i },
  { name: 'Database Password URI', regex: /(?:postgres|mysql|mongodb):\/\/[^:]+:([^@]+)@/ },
  { name: 'GitHub Personal Access Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/ },
  { name: 'Slack Webhook / Token', regex: /xox[baprs]-[0-9a-zA-Z]{10,}/ },
];

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.gemini', '.system_generated']);
const IGNORED_FILES = new Set(['package-lock.json', '.env.example']);

let findings = [];

function scanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);

  if (IGNORED_FILES.has(base)) return;
  if (!['.js', '.ts', '.tsx', '.json', '.yml', '.yaml', '.env', '.md', '.html'].includes(ext) && ext !== '') return;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      // Ignore comments in scripts/audit-secrets.js itself
      if (filePath.includes('audit-secrets.js')) return;

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(line)) {
          findings.push({
            file: filePath,
            line: lineNum + 1,
            pattern: pattern.name,
            snippet: line.trim().slice(0, 80),
          });
        }
      }
    });
  } catch (err) {
    // Ignore read errors for binary files
  }
}

function traverse(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      traverse(fullPath);
    } else {
      scanFile(fullPath);
    }
  }
}

console.log('🔍 [Gitleaks-Grade Secret Scan] Auditing codebase for exposed secrets & credentials...');
traverse(process.cwd());

if (findings.length === 0) {
  console.log('✅ [Gitleaks-Grade Secret Scan] PASS: Zero hardcoded secrets, private keys, or API tokens detected.');
} else {
  console.warn(`⚠️ [Gitleaks-Grade Secret Scan] WARNING: Found ${findings.length} potential secret(s):`);
  findings.forEach(f => {
    console.warn(` - [${f.pattern}] in ${f.file}:${f.line}\n   Snippet: ${f.snippet}`);
  });
}
