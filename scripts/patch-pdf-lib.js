const fs = require('fs');
const path = require('path');

const esmPath = path.resolve(__dirname, '../node_modules/pdf-lib/dist/pdf-lib.esm.js');
const mapPath = path.resolve(__dirname, '../node_modules/pdf-lib/dist/pdf-lib.esm.js.map');

try {
  if (fs.existsSync(mapPath)) {
    // Replace broken/truncated upstream sourcemap with valid empty JSON
    fs.writeFileSync(mapPath, JSON.stringify({ version: 3, sources: [], mappings: '' }), 'utf8');
  }

  if (fs.existsSync(esmPath)) {
    let content = fs.readFileSync(esmPath, 'utf8');
    if (content.includes('//# sourceMappingURL=pdf-lib.esm.js.map')) {
      content = content.replace(/\/\/# sourceMappingURL=pdf-lib\.esm\.js\.map\s*$/, '');
      fs.writeFileSync(esmPath, content, 'utf8');
    }
  }
} catch (e) {
  // Silent fail if pdf-lib not installed yet
}
