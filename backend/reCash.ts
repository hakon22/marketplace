import { exec } from 'child_process';
import fs from 'fs';

const reCash = () => {
  fs.unlink('../frontend/200.html', (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Файл успешно удалён');
    }
  });
  exec('npm run snap', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
};

setInterval(reCash, 86400000);