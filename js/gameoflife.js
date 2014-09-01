
define( [ 'cell', 'class' ], function( aCell ) {
	'use strict';

	/**
	 * Class: Conway's Game of Life
	 * http://en.wikipedia.org/wiki/Conway's_Game_of_Life
	 */

	var gameOfLife = Object.subClass({

		/**
		 * Method: init
		 */

		init: function( ) {
			this.engine = {
				verbose: true,
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight,
				tickRate: parseInt( 1000 / 5, 10 ),
				lastTick: Date.now( ),
				paused: false,
				pauseRate: 200,
				pauseTime: null,
				resizing: null,
				resizeRate: 200
			};

			this.verbose( 'booting' );

			this.display = document.querySelector( 'canvas' );
			this.display.width = this.engine.width;
			this.display.height = this.engine.height;
			this.displayContext = this.display.getContext( '2d' );

			this.displayContext.scale( 1, 1 );
			this.displayContext.translate( 0, 0 );
			this.displayContext.mozImageSmoothingEnabled = false;
			this.displayContext.webkitImageSmoothingEnabled = false;

			this.buffer = document.createElement( 'canvas' );
			this.buffer.width = this.engine.width;
			this.buffer.height = this.engine.height;
			this.bufferContext = this.buffer.getContext( '2d' );

			this.bufferContext.scale( 1, 1 );
			this.bufferContext.translate( 0, 0 );
			this.bufferContext.mozImageSmoothingEnabled = false;
			this.bufferContext.webkitImageSmoothingEnabled = false;

			this.cells = [ ];

			this.cell = {
				width: 8,
				height: 8,
				padding: 2,
				alive: '#243d46',
				dead: '#eeeeee',
				maxOpacity: 3,
				seedValue: 0.3
			};

			this.bindEventListeners( );
			this.generateCells( );
			this.think( );
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var self = this;

			window.addEventListener( 'focus', function( ) {
				if ( self.engine.paused === true ) {
					self.unpause( );
				}
			}, true );

			window.addEventListener( 'blur', function( ) {
				if ( self.engine.paused === false ) {
					self.pause( );
				}
			}, true );

			window.addEventListener( 'resize', function( ) {
				clearTimeout( self.engine.resizing );

				self.engine.resizing = setTimeout( function( ) {
					self.resize( );
					self.unpause( );
				}, self.engine.resizeRate );

				if ( self.engine.paused === false ) {
					self.pause( );
				}
			});

			window.addEventListener( 'mousemove', function( aEvent ) {
				self.createLife( aEvent );
			});
		},

		/**
		 * Method: verbose
	 	 * @param {String} aMessage
		 */

		verbose: function( aMessage ) {
			if ( this.engine.verbose === true ) {
				console.log( 'gameOfLife :: ' + aMessage );
			}
		},

		/**
		 * Method: pause
		 */

		pause: function( ) {
			var now = Date.now( );

			this.engine.paused = true;
			this.engine.pauseTime = now;

			this.verbose( 'paused' );
		},

		/**
		 * Method: unpause
		 */

		unpause: function( ) {
			var now = Date.now( );

			this.engine.paused = false;
			this.engine.lastTick += ( now - this.engine.pauseTime );

			this.verbose( 'unpaused' );
		},

		/**
		 * Method: resize
		 */

		resize: function( ) {
			this.engine.width = document.documentElement.clientWidth;
			this.engine.height = document.documentElement.clientHeight;

			this.display.width = this.engine.width;
			this.display.height = this.engine.height;

			this.displayContext.scale( 1, 1 );
			this.displayContext.translate( 0, 0 );

			this.buffer.width = this.engine.width;
			this.buffer.height = this.engine.height;

			this.bufferContext.scale( 1, 1 );
			this.bufferContext.translate( 0, 0 );

			this.generateCells( );
		},

		/**
		 * Method: generateCells
		 */

		generateCells: function( ) {
			var rows, cols, x, y,
				i, j;

			rows = parseInt( this.engine.height / this.cell.height, 10 );
			if ( rows * this.cell.height < this.engine.height ) rows++;

			cols = parseInt( this.engine.width / this.cell.width, 10 );
			if ( cols * this.cell.width < this.engine.width ) cols++;

			this.verbose( 'generate grid ' + rows + 'x' + cols );

			this.cells = [ ];

			for ( i = 0; i < rows; i++ ) {
				this.cells[ i ] = [ ];

				for ( j = 0; j < cols; j++ ) {
					x = j * this.cell.width;
					y = i * this.cell.height;

					this.cells[ i ][ j ] = new aCell( x, y );
				}
			}

			this.seedLife( );
		},

		/**
		 * createLife
		 * @param {DOMevent} aEvent
		 */

		createLife: function( aEvent ) {
			var x, y;

			x = parseInt( aEvent.clientX / this.cell.width, 10 );
			y = parseInt( aEvent.clientY / this.cell.height, 10 );

			this.cells[ y ][ x ].setState( 'alive' );
		},

		/**
		 * Method: createSeed
		 */

		createSeed: function( ) {
			var x, y, cells,
				i, len;

			x = parseInt( this.engine.width / 2, 10 );
			x = parseInt( x / this.cell.width, 10 );

			y = parseInt( this.engine.height / 2, 10 );
			y = parseInt( y / this.cell.height, 10 );

			cells = [
				{
					x: x - 2,
					y: y - 1
				},
				{
					x: x + 2,
					y: y - 1
				},
				{
					x: x - 3,
					y: y + 1
				},
				{
					x: x - 2,
					y: y + 1
				},
				{
					x: x - 1,
					y: y + 1
				},
				{
					x: x + 1,
					y: y + 1
				},
				{
					x: x + 2,
					y: y + 1
				},
				{
					x: x + 3,
					y: y + 1
				}
			];

			for ( i = 0, len = cells.length; i < len; i++ ) {
				this.cells[ cells[ i ].y ][ cells[ i ].x ].setState( 'alive' );
			}
		},

		/**
		 * Method: seedLife
		 */

		seedLife: function( ) {
			var i, len1, j, len2;

			for ( i = 0, len1 = this.cells.length; i < len1; i++ ) {
				for ( j = 0, len2 = this.cells[ i ].length; j < len2; j++ ) {
					if ( Math.log( Math.random( ) * 10 ) < -this.cell.seedValue ) {
						this.cells[ i ][ j ].setState( 'alive' );
					}
				}
			}
		},

		/**
		 * Method: nextGeneration
		 */

		nextGeneration: function( ) {
			var cell, neighbours, alive, dead,
				rowAbove, rowBelow, colLeft, colRight,
				i, len1, j, len2, k, len3;

			for ( i = 0, len1 = this.cells.length; i < len1; i++ ) {
				for ( j = 0, len2 = this.cells[ i ].length; j < len2; j++ ) {
					cell = this.cells[ i ][ j ];

					rowAbove = ( i - 1 >= 0 ) ? i - 1 : this.cells.length - 1;
					rowBelow = ( i + 1 <= this.cells.length - 1 ) ? i + 1 : 0;

					colLeft = ( j - 1 >= 0 ) ? j - 1 : this.cells[ i ].length - 1;
					colRight = ( j + 1 <= this.cells[ i ].length - 1 ) ? j + 1 : 0;

					neighbours = [
						this.cells[ rowAbove ][ colLeft ],
						this.cells[ rowAbove ][ j ],
						this.cells[ rowAbove ][ colRight ],
						this.cells[ i ][ colLeft ],
						this.cells[ i ][ colRight ],
						this.cells[ rowBelow ][ colLeft ],
						this.cells[ rowBelow ][ j ],
						this.cells[ rowBelow ][ colRight ]
					];

					alive = 0;
					dead = 0;

					for ( k = 0, len3 = neighbours.length; k < len3; k++ ) {
						if ( neighbours[ k ].state === 'alive' ) {
							alive++;
						}
						else {
							dead++;
						}
					}

					if ( cell.state === 'alive' ) {
						if ( alive < 2 || alive > 3 ) {
							cell.setState( 'dead' );
						}
					}
					else if ( alive === 3 ) {
						cell.setState( 'alive' );
					}
				}
			}
		},

		/**
		 * Method: draw
		 */

		draw: function( ) {
			var cell, w, h,
				i, len1, j, len2;

			for ( i = 0, len1 = this.cells.length; i < len1; i++ ) {
				for ( j = 0, len2 = this.cells[ i ].length; j < len2; j++ ) {
					cell = this.cells[ i ][ j ];

					if ( cell.dirty === true ) {
						w = this.cell.width - this.cell.padding;
						h = this.cell.height - this.cell.padding;

						this.bufferContext.save( );
	        			this.bufferContext.translate( cell.x, cell.y );
						this.bufferContext.fillStyle = this.cell[ cell.state ];

						if ( cell.state === 'alive' ) {
							this.bufferContext.globalAlpha = '0.' + ( Math.floor( Math.random( ) * 3 ) + 1 );
						}

						this.bufferContext.clearRect( this.cell.padding, this.cell.padding, w, h );
						this.bufferContext.fillRect( this.cell.padding, this.cell.padding, w, h );
						this.bufferContext.restore( );

						cell.dirty = false;
					}
				}
			}

			this.displayContext.clearRect( 0, 0, this.engine.width, this.engine.height );
			this.displayContext.drawImage( this.buffer, 0, 0 );
		},

		/**
		 * Method: think
		 */

		think: function( ) {
			var now = Date.now( ),
				elapsed = now - this.engine.lastTick,
				self = this;

			if ( this.engine.paused === false ) {
				if ( elapsed >= this.engine.tickRate ) {
					this.engine.lastTick = now - ( elapsed % this.engine.tickRate );

					this.nextGeneration( );
					this.draw( );
				}

				window.requestAnimationFrame(function( ) {
					self.think( );
				});
			}
			else {
				setTimeout(function( ) {
					window.requestAnimationFrame(function( ) {
						self.think( );
					});
				}, this.engine.pauseRate );
			}
		}
	});

	return gameOfLife;
});
