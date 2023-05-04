
const fs = require('fs'); // подключаем fs
const path = require('path'); // подключаем path
const { stdout } = process;

const file = 'text.txt';
const filePath = path.join(__dirname, file);
const stream = fs.createReadStream(filePath, 'utf-8');
stream.pipe(stdout);



