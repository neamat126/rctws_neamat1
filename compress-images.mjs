import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ASSETS_DIR = './src/assets';
const MAX_WIDTH   = 800;   // max width للصور الكبيرة
const QUALITY_JPG = 75;
const QUALITY_PNG = 75;

const files = readdirSync(ASSETS_DIR);

let totalBefore = 0;
let totalAfter  = 0;

for (const file of files) {
  const ext  = extname(file).toLowerCase();
  const path = join(ASSETS_DIR, file);
  const sizeBefore = statSync(path).size;

  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  totalBefore += sizeBefore;

  try {
    let pipeline = sharp(path).resize({ width: MAX_WIDTH, withoutEnlargement: true });

    if (ext === '.png') {
      await pipeline.png({ quality: QUALITY_PNG, compressionLevel: 9 }).toFile(path + '.tmp');
    } else {
      await pipeline.jpeg({ quality: QUALITY_JPG, mozjpeg: true }).toFile(path + '.tmp');
    }

    // استبدل الأصلي بالمضغوط
    const { renameSync } = await import('fs');
    renameSync(path + '.tmp', path);

    const sizeAfter = statSync(path).size;
    totalAfter += sizeAfter;

    const saved = ((sizeBefore - sizeAfter) / sizeBefore * 100).toFixed(0);
    console.log(`✓ ${file.padEnd(25)} ${(sizeBefore/1024).toFixed(0).padStart(6)}KB → ${(sizeAfter/1024).toFixed(0).padStart(6)}KB  (-${saved}%)`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    totalAfter += sizeBefore;
  }
}

console.log('');
console.log(`📦 Total: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (saved ${((totalBefore-totalAfter)/1024/1024).toFixed(1)}MB)`);
