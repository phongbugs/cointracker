import fs from 'fs';
const log = console.log;
async function writeFile(fileName, content) {
  return new Promise((resolve, reject) => {
    let dir = fileName.substring(0, fileName.lastIndexOf('/'));
    if (!fs.existsSync(dir)) shell.mkdir('-p', dir);
    fs.writeFile(fileName, content, function (err) {
      if (err) reject(err);
      var statusText = 'write file > ' + fileName + ' success';
      log(statusText);
      resolve(true);
    });
  });
}
function readFile(fileName) {
  try {
    return JSON.parse(fs.readFileSync(fileName));
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return null;
  }
}

export { readFile, writeFile };
