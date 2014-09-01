
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
		}
	});

	return Cell;
});
