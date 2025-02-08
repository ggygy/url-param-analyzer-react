import AdmZip from 'adm-zip';
import { resolve } from 'path';

const zip = new AdmZip();
const outputFile = "extension.zip";

const folderToZip = resolve('dist');

zip.addLocalFolder(folderToZip);
zip.writeZip(outputFile);

console.log(`Created ${outputFile} successfully`);