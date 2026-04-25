const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = 'public/images/raw';
const OUTPUT_DIR = 'public/images/optimized';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(INPUT_DIR);

  for (const file of files) {
    if (/\.(jpe?g|png|webp)$/i.test(file)) {
      const inputPath = path.join(INPUT_DIR, file);
      const filename = path.parse(file).name;

      console.log(`Optimizing: ${file}`);

      // Generate WebP
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(path.join(OUTPUT_DIR, `${filename}.webp`));

      // Generate AVIF
      await sharp(inputPath)
        .avif({ quality: 65 })
        .toFile(path.join(OUTPUT_DIR, `${filename}.avif`));

      // Generate LQIP (Low Quality Image Placeholder)
      const buffer = await sharp(inputPath)
        .resize(20)
        .blur()
        .toBuffer();
      
      const lqip = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      console.log(`LQIP for ${file} generated.`);
    }
  }
}

optimizeImages().catch(console.error);
