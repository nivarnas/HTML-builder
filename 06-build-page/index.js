const path = require('path');
const { mkdir, copyFile, rm, readdir, access, writeFile } = require('fs/promises');
const fs = require('fs');

const projectFolder = path.resolve(__dirname, 'project-dist');
const assetsTarget = path.resolve(__dirname, 'assets');
const coppiedAssets = path.resolve(__dirname, 'project-dist', 'assets');
const stylesFolder = path.resolve(__dirname, 'styles');
const bundleStyles = path.resolve(__dirname, 'project-dist', 'style.css');

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

  const files = await readdir(target, {withFileTypes: true});

  files.forEach(async (file) => {
    if (file.isDirectory()){
      const newTarrget = path.resolve(target, file.name);
      const newCopy = path.resolve(copy, file.name);
      copyAssets(newTarrget, newCopy);
    } else {
      const fileName = path.resolve(target, file.name);
      const copyFileName = path.join(copy, file.name);

      try {
        copyFile(fileName, copyFileName);
      } catch (err) {
        console.log(fileName, copyFileName)
        console.log(err);
      }
    }
  });
};

copyAssets(assetsTarget, coppiedAssets);