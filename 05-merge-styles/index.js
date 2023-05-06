const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

async function bundleStyle(dir, bundle ) {
  try {
    const streamBundle = fs.createWriteStream(bundle);

    const srcFiles = await fsPromise.readdir(dir, {withFileTypes: true});

    for (const item of srcFiles) {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const currentContent = await fsPromise.readFile(path.join(dir, item.name));
        streamBundle.write(currentContent + '\n');
      }
    }
    console.log('File bundle.css is ready');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
const dst = path.join(__dirname, 'project-dist');
const folderStylePath = path.join(__dirname, 'styles');
const fileBundle  = path.join(dst, 'bundle.css');

bundleStyle(folderStylePath, fileBundle );
