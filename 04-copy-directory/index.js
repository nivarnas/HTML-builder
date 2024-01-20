const path = require('path');
const { mkdir, copyFile, rm, readdir, access } = require('fs/promises');

const folder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

const copyDir = async () => {
  const removeDir = async () => {
    try {
      await rm(copyFolder, { recursive: true });
    } catch (err) {
      console.log(err.message, 1);
    }
  };

  const makeDir = async () => {
    try {
      await mkdir(copyFolder, { recursive: true });
    } catch (err) {
      console.log(err.message, 2);
    }
  };

  try {
    await access(copyFolder);
    await removeDir();
    await makeDir();
  } catch (err) {
    makeDir();
  }

  const files = await readdir(folder);

  files.forEach(async (file) => {
    const fileName = path.join(folder, file);
    const copyFileName = path.join(copyFolder, file);

    try {
      copyFile(fileName, copyFileName);
    } catch (err) {
      console.log(err.message);
    }
  });
};

copyDir();
