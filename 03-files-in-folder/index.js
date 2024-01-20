const path = require('path');
const { readdir, stat } = require('fs/promises');

const folder = path.join(__dirname, 'secret-folder');

const readFiles = async () => {
  try {
    const files = await readdir(folder);
    files.forEach(async (file) => {
      const currentFile = path.join(folder, file);
      try {
        const stats = stat(currentFile);
        if ((await stats).isFile()) {
          console.log(
            `${path.basename(currentFile, path.extname(currentFile))} - ${path
              .extname(currentFile)
              .slice(1)} - ${((await stats).size / 1024).toFixed(4)} Kb`,
          );
        }
      } catch (Error) {
        console.log(Error.message);
      }
    });
  } catch (Error) {
    console.log(Error.message);
  }
};

readFiles();
