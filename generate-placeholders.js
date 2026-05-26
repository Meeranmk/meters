import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal 1x1 PNG Base64 data strings for mock initial loading
// To keep files valid as PNGs for crawler validation
const minPngBase64 = 'iVBOR0w0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwFvgbg4OQAAAABJRU5ErkJggg==';
const buffer = Buffer.from(minPngBase64, 'base64');

const PUBLIC_DIR = path.join(__dirname, 'public');

// Create public directory if not exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

const files = [
  'icon-192.png',
  'icon-512.png',
  'screenshot-mobile.png',
  'screenshot-desktop.png'
];

files.forEach(filename => {
  const filePath = path.join(PUBLIC_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated basic placeholder: ${filePath}`);
});
