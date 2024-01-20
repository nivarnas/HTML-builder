const path = require('path');
const fs = require('fs');

const stylesfolder = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist/bundle.css');
const writeStream = fs.createWriteStream(outputFile);

const mergeStyles = async () => {
  const files = await fs.promises.readdir(stylesfolder);
  files.forEach((file) => {
    if (path.extname(file) === '.css') {
      const readStream = fs.createReadStream(path.join(stylesfolder, file));
      readStream.on('data', (data) => {
        writeStream.write(data + '\n');
      });
    }
  });
};

mergeStyles();
