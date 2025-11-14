import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetDir = join(__dirname, '..', 'public', 'icons');
const COLOR = { r: 51, g: 86, b: 255 };

async function main() {
  await mkdir(targetDir, { recursive: true });
  await Promise.all([createIcon(192), createIcon(512)]);
  console.log('Icons generated in', targetDir);
}

async function createIcon(size) {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const idx = (size * y + x) << 2;
      const gradient = 0.15 * (y / size);
      png.data[idx] = COLOR.r + gradient * 50;
      png.data[idx + 1] = COLOR.g;
      png.data[idx + 2] = COLOR.b - gradient * 40;
      png.data[idx + 3] = 255;
    }
  }
  const buffer = PNG.sync.write(png);
  await writeFile(join(targetDir, `icon-${size}.png`), buffer);
}

main().catch((error) => {
  console.error('Failed to generate icons', error);
  process.exitCode = 1;
});
