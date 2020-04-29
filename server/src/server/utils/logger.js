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
