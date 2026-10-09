import fs from 'fs';
import path from 'path';

const searchDirs = [
  'src/app/(dashboard)',
  'src/app/(auth)',
  'src/components/ui',
  'src/components/wardrobe',
];

const replacements = [
  { from: /#B4533C/gi, to: '#0284C7' },
  { from: /#9E4530/gi, to: '#0369A1' },
  { from: /#C5A059/gi, to: '#38BDF8' },
  { from: /#5F6F52/gi, to: '#E87A90' },
  { from: /#E7E0D6/gi, to: '#E2E8F0' },
  { from: /#D5CCC0/gi, to: '#CBD5E1' },
  { from: /#F4EFEA/gi, to: '#F0F7FD' },
];

function processDir(dir) {
  const fullPath = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) return;
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(fullPath, entry.name);
    if (entry.isDirectory()) {
      processDir(entryPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.css'))) {
      let content = fs.readFileSync(entryPath, 'utf8');
      let changed = false;
      for (const { from, to } of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(entryPath, content, 'utf8');
        console.log(`Updated theme tokens in: ${entryPath}`);
      }
    }
  }
}

for (const dir of searchDirs) {
  processDir(dir);
}
console.log('Theme conversion completed successfully.');
