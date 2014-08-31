
/**
 * config
 */

require.config({
	urlArgs: Date.now( )
});

/**
 * blindGL
 */

require( [ 'gameoflife' ], function( gameOfLife ) {
	'use strict';

	var game = new gameOfLife( );
});
