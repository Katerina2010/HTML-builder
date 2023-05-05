const fs = require('fs');
const fsPromose = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const folderStyle = 'styles';
    const folderStylePath = path.join(__dirname, folderStyle);
    const dst = path.join(__dirname, 'project-dist');
    const fileBundle  = path.join(dst, 'bundle.css');
    const streamBundle = fs.createWriteStream(fileBundle);

    const srcFiles = await fsPromose.readdir(folderStylePath, {withFileTypes: true});

    for (const item of srcFiles) {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const currentContent = await fsPromose.readFile(path.join(folderStylePath, item.name));
        streamBundle.write(currentContent);
      }
    }
    console.log(" File bundle.css is ready");
  } catch (error) {
    console.error('Error:', error.message);
  }
})();