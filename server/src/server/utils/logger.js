const fs = require( 'fs' );
const path = require( 'path' );
const _ = require( 'lodash' );
const { promisify } = require( 'util' );
const { LOG_PROPS, LOG_FILE_PATH } = require( '../../constants' )
const stat = promisify( fs.stat );
const open = promisify( fs.open );




async function createLogObject( object, start, props ) {
  const time = { time: Date.parse( new Date() ) };
  const properties = _.pick( object, props )
  const logInfo = _.assign( time, properties )
  const jsonStr = JSON.stringify( logInfo )

  if( start !== 1 ) {
    return ',' + jsonStr + ']'
  }
  return jsonStr + ']'
}


async function appendToFile( data, start, fPath ) {
  /*  if( start < 0 ) {
   return;
   }*/
  const streamLog = await fs.createWriteStream( fPath, {
    flags: 'r+',
    start
  } )
  await streamLog.write( data, 'utf-8' );
  streamLog.end();
}
