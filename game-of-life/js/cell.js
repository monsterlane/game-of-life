
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
		},

		/**
		 * Method: clone
		 */

		clone: function( ) {
			return new Cell( this.x, this.y, this.state );
		}
	});

	return Cell;
});
