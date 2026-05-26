import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CRC-32 lookup table
let crcTable = null;
function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    crcTable[n] = c;
  }
  return crcTable;
}

function calculateCrc32(buf) {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  
  const crc = calculateCrc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

function generateSolidPng(width, height, r, g, b) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeInt32BE(width, 0);
  ihdrData.writeInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 2; // Color type: RGB
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdr = createChunk('IHDR', ihdrData);

  const rowSize = 1 + width * 3;
  const pixelData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    pixelData[rowOffset] = 0; // Row filter type 0
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + 1 + x * 3;
      pixelData[idx] = r;
      pixelData[idx + 1] = g;
      pixelData[idx + 2] = b;
    }
  }
  const compressed = zlib.deflateSync(pixelData);
  const idat = createChunk('IDAT', compressed);

  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const PUBLIC_DIR = path.join(__dirname, 'public');

// Create directory if missing
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Generate the specific files expected with exact sizes
const assets = [
  { name: 'icon-192.png', width: 192, height: 192, color: [79, 70, 229] }, // indigo
  { name: 'icon-512.png', width: 512, height: 512, color: [79, 70, 229] }, // indigo
  { name: 'screenshot-mobile.png', width: 320, height: 640, color: [248, 250, 252] }, // Slate-50 background color
  { name: 'screenshot-desktop.png', width: 1024, height: 768, color: [248, 250, 252] } // Slate-50 background color
];

assets.forEach(asset => {
  const buffer = generateSolidPng(asset.width, asset.height, asset.color[0], asset.color[1], asset.color[2]);
  const filePath = path.join(PUBLIC_DIR, asset.name);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated true ${asset.width}x${asset.height} PNG at: ${filePath}`);
});
console.log('All PWA asset placeholders generated successfully with true pixel dimensions!');
