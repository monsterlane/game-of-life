
define( [ 'class' ], function( ) {
	'use strict';

	/**
	 * Class: cell
	 */

	var Cell = Object.subClass({

		/**
		 * Method: init
		 */

		init: function( aX, aY, aState ) {
			var x = Number( aX ) || 0,
				y = Number( aY ) || 0,
				s = aState || 'dead';

			this.x = x;
			this.y = y;

			this.state = s;
			this.dirty = true;
		},

		/**
		 * Method: setState
		 * @param {String} aState
		 */

		setState: function( aState ) {
			if ( this.state !== aState ) {
				this.dirty = true;
			}

			this.state = aState;
		}
	});

	return Cell;
});
