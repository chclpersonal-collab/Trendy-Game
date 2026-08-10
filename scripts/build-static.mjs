import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const src = path.join(root, 'src');

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'src'), { recursive: true });

await copyFile(path.join(root, 'game.html'), path.join(dist, 'index.html'));
await copyFile(path.join(root, 'styles.css'), path.join(dist, 'styles.css'));

for (const entry of await readdir(src, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')) {
    await copyFile(path.join(src, entry.name), path.join(dist, 'src', entry.name));
  }
}

console.log('Built Cloudflare static site in dist/.');
