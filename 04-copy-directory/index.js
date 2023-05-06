const fs = require('fs/promises');
const path = require('path');

async function copyDir(source, destination) {
  try {
    await fs.rm(destination, { force: true, recursive: true });
    await fs.mkdir(destination, { recursive: true });
    const output = await fs.readdir(source, { withFileTypes: true });

    for (const item of output) {
      const src = path.join(source, item.name);
      const dst = path.join(destination, item.name);

      if (item.isFile()) {
        await fs.copyFile(src, dst);
      } else if (item.isDirectory()) {
        await copyDir(src, dst);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
const src = path.join(__dirname, 'files');
const dst = path.join(__dirname, 'files-copy');

copyDir(src, dst);