const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
  stdout.write('Hello, file was created! Enter data!\n');
});

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Entering data is finished! Thanks!\n');
    exit();
  } else {
    writeStream.write(data);
  }
});

process.on('SIGINT', () => {
  stdout.write('Entering data is finished! Thanks!\n');
  exit();
});
