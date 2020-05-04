const fs = require( 'fs' );
const path = require( 'path' );
const _ = require( 'lodash' );
const { promisify } = require( 'util' );
const { LOG_FILE_PATH, LAST_CHARS_TO_DELETE } = require( '../../../constants' )
const appendToFile = require( './appendToFile.js' )
const stat = promisify( fs.stat );
const open = promisify( fs.open );

//Вызов через setInterval(LOG_FILE_PATH), 86400000ms

async function createLogHistory( oldFilePath, newFilePath ) {  //or fs.copyFile
  const source = await fs.createReadStream( oldFilePath )
  const target = await fs.createWriteStream( newFilePath ) //TODO: transform writing object
  try {
    await source.pipe( target );

    await appendToFile( LOG_FILE_PATH, '[]', 0, 'w' ) //check flag

  } catch ( e ) {
    source.destroy();
    target.end();
    throw e
  }
}

async function clearOldFile( oldPath ) {
  await appendToFile( oldPath, '[]', 0, 'w' ) // empty old file. (check flag)
}

module.exports = createLogHistory;
