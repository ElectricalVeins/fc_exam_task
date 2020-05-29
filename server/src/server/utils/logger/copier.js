const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const { DUMPS_PATH } = require('../../../constants');
const appendToFile = require('./appendToFile');
const ensureExists = require('./ensurePathExist');
const pipeline = promisify(stream.pipeline);

async function createLogHistory(oldFilePath, newFilePath) {
  try {
    await ensureExists(DUMPS_PATH);
    await createDump(oldFilePath, newFilePath);
    await clearOldFile(oldFilePath);
  } catch (err) {
    throw err;
  }
}

async function createDump(oldFilePath, newFilePath) {
  try {
    const xStream = new stream.Transform({
      objectMode: true,
    });
    xStream._transform = function (chunk, encoding, done) {
      const jsonObj = JSON.parse(chunk);

      for (const element of jsonObj) {
        delete element.stack;
      }

      this.push(JSON.stringify(jsonObj));
      done();
    };

    await pipeline(
      fs.createReadStream(oldFilePath),
      xStream,
      fs.createWriteStream(newFilePath)
    );

    xStream.end();
  } catch (err) {
    throw err;
  }
}

async function clearOldFile(oldPath) {
  await appendToFile(oldPath, '[]', 0, 'w'); // empty old file. (check flag)
}

module.exports = createLogHistory;
