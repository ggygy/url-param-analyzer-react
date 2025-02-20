import { rm } from 'fs/promises';
import { join } from 'path';

const files = [
  'dist',
  'background.js',
  'contentScript.js',
  'background.js.map',
  'contentScript.js.map'
];

async function clean() {
  for (const file of files) {
    try {
      await rm(join(process.cwd(), file), { force: true, recursive: true });
      console.log(`Cleaned: ${file}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Error cleaning ${file}:`, error);
      }
    }
  }
}

clean().catch(console.error);
