const path = require('path');
const {
  mkdir,
  copyFile,
  rm,
  readdir,
  access,
  writeFile,
  readFile,
} = require('fs/promises');
const fs = require('fs');

const projectFolder = path.resolve(__dirname, 'project-dist');
const assetsTarget = path.resolve(__dirname, 'assets');
const coppiedAssets = path.resolve(__dirname, 'project-dist', 'assets');
const stylesFolder = path.resolve(__dirname, 'styles');
const bundleStyles = path.resolve(__dirname, 'project-dist', 'style.css');
const htmlComponentsDir = path.resolve(__dirname, 'components');
const template = path.resolve(__dirname, 'template.html');
const htmlFile = path.resolve(projectFolder, 'index.html');

const copyAssets = async (target, copy) => {
  const removeDir = async () => {
    try {
      await rm(copy, { recursive: true });
    } catch (err) {
      console.log(err.message, 1);
    }
  };

  const makeDir = async () => {
    try {
      await mkdir(copy, { recursive: true });
    } catch (err) {
      console.log(err.message, 2);
    }
  };

  try {
    await access(copy);
    await removeDir();
    await makeDir();
  } catch (err) {
    makeDir();
  }

  const files = await readdir(target, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isDirectory()) {
      const newTarrget = path.resolve(target, file.name);
      const newCopy = path.resolve(copy, file.name);
      copyAssets(newTarrget, newCopy);
    } else {
      const fileName = path.resolve(target, file.name);
      const copyFileName = path.join(copy, file.name);

      try {
        copyFile(fileName, copyFileName);
      } catch (err) {
        console.log(fileName, copyFileName);
        console.log(err);
      }
    }
  });
};

const mergeStyles = async () => {
  try {
    const files = await readdir(stylesFolder, { withFileTypes: true });
    const writeStraem = await fs.createWriteStream(bundleStyles);
    files.forEach((file) => {
      const readStream = fs.createReadStream(
        path.join(stylesFolder, path.basename(file.name)),
      );
      if (path.extname(file.name) === '.css' && !file.isDirectory()) {
        readStream.pipe(writeStraem, { end: false });
      }
    });
  } catch (err) {
    mergeStyles();
    console.log(err.message);
  }
};

const replaseTemplate = async () => {
  try {
    const templateFile = await readFile(template, 'utf-8');
    const components = await readdir(htmlComponentsDir);
    let newTemplate = templateFile;
    for (const component of components) {
      const componentName = component.split('.')[0];
      if (component.split('.')[1] === 'html') {
        const componentContent = await readFile(
          path.resolve(htmlComponentsDir, component),
          'utf-8',
        );
        const regex = new RegExp(`{{${componentName}}}`, 'g');
        newTemplate = newTemplate.replaceAll(regex, componentContent);
      }
    }
    await writeFile(htmlFile, newTemplate, 'utf-8');
  } catch (err) {
    console.log(err.message);
  }
};

const build = async () => {
  await copyAssets(assetsTarget, coppiedAssets);
  await mergeStyles();
  await replaseTemplate();
};

build();
