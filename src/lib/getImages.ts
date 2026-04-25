import fs from 'fs';
import path from 'path';

export type PhotoMeta = {
  src: string;
  alt: string;
  filename: string;
};

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

export function getImagesFromPublic(subfolder = 'images'): PhotoMeta[] {
  const dir = path.join(process.cwd(), 'public', subfolder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .map((file) => ({
      src: `/${subfolder}/${file}`,
      alt: path.basename(file, path.extname(file)).replace(/[-_]/g, ' '),
      filename: file,
    }));
}
