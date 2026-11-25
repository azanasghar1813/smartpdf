const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('./temp_storage/input/9a9c4630-825e-4aa7-b763-87ac49e68a46/dbbe0960b27c673f-azan-asghar-cv-updated__1_.pdf');
const content = buf.toString('binary');

// Extract CMaps
const cmaps = new Map();
let p = 0;
while (true) {
  const sStart = content.indexOf('stream', p);
  if (sStart === -1) break;
  let dataStart = sStart + 6;
  if (content[dataStart] === '\r') dataStart++;
  if (content[dataStart] === '\n') dataStart++;
  const sEnd = content.indexOf('endstream', dataStart);
  if (sEnd === -1) break;
  const sliceBuf = buf.subarray(dataStart, sEnd);
  try {
    const uncompressed = zlib.unzipSync(sliceBuf).toString('latin1');
    if (uncompressed.includes('begincmap')) {
      const bfcharMatches = uncompressed.match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g) || [];
      for (const m of bfcharMatches) {
        const parts = m.match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/);
        if (parts) {
          cmaps.set(parts[1].toUpperCase(), String.fromCharCode(parseInt(parts[2], 16)));
        }
      }
      const bfrangeMatches = uncompressed.match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g) || [];
      for (const m of bfrangeMatches) {
        const parts = m.match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/);
        if (parts) {
          const start = parseInt(parts[1], 16);
          const end = parseInt(parts[2], 16);
          let target = parseInt(parts[3], 16);
          for (let code = start; code <= end; code++, target++) {
            const hex = code.toString(16).toUpperCase().padStart(4, '0');
            cmaps.set(hex, String.fromCharCode(target));
          }
        }
      }
    }
  } catch(e) {}
  p = sEnd + 9;
}

// Stream 1
const sStart = content.indexOf('stream');
let dataStart = sStart + 6;
if (content[dataStart] === '\r') dataStart++;
if (content[dataStart] === '\n') dataStart++;
const sEnd = content.indexOf('endstream', dataStart);
const stream1 = zlib.unzipSync(buf.subarray(dataStart, sEnd)).toString('latin1');

// Parse Tm and text
const lines = stream1.split('\n');
let curX = 0, curY = 0;
let items = [];

for (const line of lines) {
  const tmMatch = line.match(/([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+Tm/);
  if (tmMatch) {
    curX = parseFloat(tmMatch[5]);
    curY = parseFloat(tmMatch[6]);
  }
  const tdMatch = line.match(/([0-9.-]+)\s+([0-9.-]+)\s+Td/);
  if (tdMatch) {
    curX += parseFloat(tdMatch[1]);
    curY += parseFloat(tdMatch[2]);
  }
  const tjMatch = line.match(/<([0-9a-fA-F]+)>\s*Tj/);
  if (tjMatch) {
    const h = tjMatch[1].toUpperCase();
    let text = '';
    for (let i = 0; i < h.length; i += 4) {
      const c = h.slice(i, i + 4);
      text += cmaps.get(c) || '';
    }
    items.push({ x: Math.round(curX), y: Math.round(curY), text });
  }
}

console.log('Total items parsed in Stream 1:', items.length);
// Group by Y (within 3pt tolerance)
const yGroups = new Map();
for (const it of items) {
  let foundKey = null;
  for (const k of yGroups.keys()) {
    if (Math.abs(k - it.y) <= 3) {
      foundKey = k;
      break;
    }
  }
  if (foundKey === null) {
    foundKey = it.y;
    yGroups.set(foundKey, []);
  }
  yGroups.get(foundKey).push(it);
}

// Sort lines by Y descending
const sortedYs = Array.from(yGroups.keys()).sort((a, b) => b - a);
console.log('Total lines detected:', sortedYs.length);
for (let i = 25; i < sortedYs.length; i++) {
  const y = sortedYs[i];
  const group = yGroups.get(y).sort((a, b) => a.x - b.x);
  const lineText = group.map(g => g.text).join(' ');
  console.log(`Y=${y} [xMin=${group[0].x}, xMax=${group[group.length-1].x}]: ${lineText}`);
}
