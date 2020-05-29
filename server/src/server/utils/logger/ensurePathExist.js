const fs = require('fs');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);

async function ensureExists(path) {
  try {
    await mkdir(path);
    return true;
  } catch (err) {
    if(err.code === 'EEXIST') {
      return true;
    }
    throw err;
  }
}

module.exports = ensureExists;
