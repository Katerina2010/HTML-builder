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
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function copyDir(source, destination) {
  try {
    await fsPromise.rm(destination, { force: true, recursive: true });
    await fsPromise.mkdir(destination, { recursive: true });
    const output = await fsPromise.readdir(source, { withFileTypes: true });

    for (const item of output) {
      const src = path.join(source, item.name);
      const dst = path.join(destination, item.name);

      if (item.isFile()) {
        await fsPromise.copyFile(src, dst);
      } else if (item.isDirectory()) {
        await copyDir(src, dst);
      }
    }
  } catch (error) {
  console.error('Error:', error.message);
  }
}

(async () => {
  try {
    const dst = path.join(__dirname, 'project-dist');
    const dirAssets = path.join(__dirname, 'assets');
    const folderStylePath = path.join(__dirname, 'styles');
    const fileBundle  = path.join(dst, 'style.css');

    await copyDir(dirAssets, path.join(dst, 'assets'));
    console.log("-----/Assets folder copied to project-dist/-----");

    await bundleStyle(folderStylePath, fileBundle);
    console.log("-----/Styles are merged into the style.css file/-----");

  } catch (error) {
    console.error('There was an error:', error.message);
  }
})();
