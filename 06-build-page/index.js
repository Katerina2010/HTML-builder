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
    const srcFiles = await fsPromise.readdir(source, { withFileTypes: true });

    for (const item of srcFiles) {
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
    const templateFile = path.join(__dirname, 'template.html');
    const folderComponents = path.join(__dirname, 'components');

    await copyDir(dirAssets, path.join(dst, 'assets'));
    console.log('--/project-dist folder created...');
    console.log('---/assets folder copied to project-dist...');

    await bundleStyle(folderStylePath, fileBundle);
    console.log('----/styles are merged into the style.css file and added to project-dist...');

    let templateHTML = await fsPromise.readFile(templateFile,'utf-8');
    const srcComponentsFiles = await fsPromise.readdir(folderComponents, {withFileTypes: true});

    for (let item of srcComponentsFiles) {
      if (item.isFile() && path.extname(item.name) === '.html') {
        let title = path.basename(item.name, '.html');
        let content =  await fsPromise.readFile(path.join(folderComponents, item.name), 'utf-8');
        templateHTML = templateHTML.replace(`{{${title}}}`, content);
      }
    }
    const dstFiles = await fsPromise.readdir(dst);
    if (dstFiles.includes('index.html')) {
      await fsPromise.rm(path.join(dst, 'index.html'));
    }
    await fsPromise.appendFile(path.join(dst, 'index.html'), templateHTML);
    console.log('-----/file index.html is ready and added to project-dist...');

  } catch (error) {
    console.error('Error:', error.message);
  }
})();
