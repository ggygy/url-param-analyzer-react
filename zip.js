import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AdmZip = require('adm-zip');

const zip = new AdmZip();
zip.addLocalFolder('./dist');
zip.writeZip('./dist/chrome-extension.zip');