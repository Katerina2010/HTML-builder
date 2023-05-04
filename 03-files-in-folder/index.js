const fs = require('fs/promises');
const path = require('path');
const { stdout, stderr } = process;

(async function readFilesFolder() {
  try {
    const folder = 'secret-folder';
    const folderPath = path.join(__dirname, folder);
    const output = await fs.readdir(folderPath, {withFileTypes: true});

    for (const item of output) {
      if (item.isFile()) {
        const fileExt = path.extname(item.name).slice(1);
        const fileName = path.basename(item.name, `.${fileExt}`);
        const filePath = path.join(folderPath, item.name);
        const fileStat = await fs.stat(filePath);
        const fileSize = `${(fileStat.size/1024).toFixed(3)}kb`;

        stdout.write(`${fileName} - ${fileExt} - ${fileSize}\n`);
      }
    }
  } catch (error) {
    stderr.write('Error:', error.message);
  }
})();


