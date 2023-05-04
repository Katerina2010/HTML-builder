const fs = require('fs');
const path = require('path');
const { stdin, stdout, stderr } = process;
const file = 'save.txt';
const filePath = path.join(__dirname, file);
const output = fs.createWriteStream(filePath, 'utf-8');

stdin.on('data', data => {
  const dataStr = data.toString();
  if (dataStr === 'exit\r\n' || dataStr === 'exit\n') { 
    stdout.write('Input completed. Goodbye!\n');
    output.close();
    process.exit();
  } else {
    output.write(dataStr);
  }
})

process.on('SIGINT', () => {
  stdout.write('Input completed. Goodbye!\n');
  output.close();
  process.exit();
});

stdin.on('error', (error)=> stderr.write(`There was an error: ${error.message}`));
process.on('error', (error)=> stderr.write(`There was an error: ${error.message}`));

stdout.write('Please enter text to write to the file.\n(To exit type "exit" or press Ctrl-C.)\n');