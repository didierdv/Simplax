/*
 * AUTHOR: Didier De Vos
 * AUTHOR'S WEBSITE: http://didierdevos.be
 *
 * Date: August/Sept., 2013
 * Last modification: N/A
 */

;(function($) {

//
// CLASS
// - - - - -

	function Simplax(elem, options) {

		this.elem       = elem;
		this.$elem      = $(elem);
		this.metadata   = this.$elem.data('simplax') || null;
		this.opts       = options || null;
		this.elemSize   = [];
		this.elemSize.x = this.$elem.width();
		this.elemSize.y = this.$elem.height();

		var self = this;
	
		this.boogie = function() {

			console.log("Exécution de Simplax.boogie()");
			
			var rangePx,
				oppositeMoving = self.config.oppositeMoving ? 1 : -1,
				elemBgPosArr,
				elemBgPosArrLength,
				DOMwatchArea,
				size;

			if(self.config.watchArea === 'window') {
				size = 'winSize'
				DOMwatchArea = window;
			} else if(self.config.watchArea === 'element') {
				size = 'elemSize'
            	DOMwatchArea = this.elem;
			}

			rangePx = calcRangePx(self.config.range);

            /* Works out the range in pixels.
             * The value is relative to the viewport's width/height. */
            function calcRangePx(range) {
                return {
                	x: range / self[size].x,
                	y: range / self[size].y
                }
            }

            /* Works out the new coords of the background following cursor moving. */
            function setBgCoords(e) {
                var coords = [];

                coords.x = elemBgPosArr[0] - rangePx.x * e.pageX * oppositeMoving;
                coords.y = elemBgPosArr[1] - rangePx.y * e.pageY * oppositeMoving;

                self.$elem.css("background-position", coords.x + "px " + coords.y + "px");
            }

            // Retrieve element's X and Y background positions through their CSS background-position value */
            elemBgPosArr = self.$elem.css("background-position").replace(/(px|%|em)/g, "").split(" ");
            elemBgPosArr[0] *= 1; 
            elemBgPosArr[1] *= 1;

            // Event listener
            DOMwatchArea.addEventListener("mousemove", setBgCoords, false);

		};

		this.classic = function() {

			console.log("Exécution de Simplax.classic()");

			/* Checking if `config.animate` value is suported */
			var animateRE = /background-position|top|bottom|left|right/i;
			if( !animateRE.test(self.config.animate) ) return;

			/* Applying user custom offset */
			if(this.config.offset) {
				this.$elem.css(this.config.animate, function(index, value){
					return parseInt(value) + self.config.offset;
				});
			}

			var yPos,
				originalOffset = this.$elem.offset(),
				setYPos;

			/* Defining the orinal offset of the element depending on the value to animate */
			switch( this.config.animate ) {

				case 'background-position':
				case 'top':
					originalOffset = originalOffset.top;
					break;

				case 'bottom':
					originalOffset = this.winSize.y - ( originalOffset.top + this.elemSize.y );
					break;
				
				case 'left':
					originalOffset = originalOffset.left;
					break;

				case 'right':
					originalOffset = this.winSize.x - ( originalOffset.left + this.elemSize.x );
					break;
			
			}

			setYPos = function() {

				var posVal;
				
				if(self.config.animate === 'background-position') {
					// Making sure the element to be animated is visible within the viewport.
					// If not, animation is stopped and will resume when element is visible again.
					if ( !(self.scrollTop + self.winSize.y > originalOffset && originalOffset + self.elemSize.y > self.scrollTop) ) return;

					yPos = (self.scrollTop - originalOffset) * self.config.speed;
					posVal = "center " + yPos + "px";
				} else {
					yPos = originalOffset + (self.scrollTop * self.config.speed);
					posVal = yPos + "px";
				}

				self.$elem.css(self.config.animate, posVal);

			};

	        window.addEventListener('scroll', setYPos, false);

		};

	};

//
// PROTOTYPE
// - - - - -

	Simplax.prototype = {

		defaults: {
			'effect': 'classic', 				//Can be: ('classic|boogie')
			'range': 30, 						//Can be: any positive number
			'oppositeMoving': true, 			//Can be: (true|false)
			'speed': 2, 						//Can be: any positive number
			'offset': 0, 						//Can be: any (negative|positive) number WITHOUT UNITS (px used)
			'animate': 'background-position',	//Can be: ('background-position|top|bottom|left|right')
			'watchArea': 'window'				//Can be: ('window|element')
		},

		init: function() {
			//The 1st empty object is to preserve other original objects from being modified
			this.config = $.extend({}, this.defaults, this.metadata, this.opts);

			// Making sure some values are positive
			this.config.range = Math.abs( this.config.range );
			this.config.speed = Math.abs( this.config.speed );

			this.calcViewportSize();

			// Event listeners
			document.addEventListener('mousemove', this.calcMousePos.bind(this), false);
			window.addEventListener('resize', this.calcViewportSize.bind(this), false);
			window.addEventListener('scroll', this.calcScrollTop.bind(this), false);

			// Effect function to be executed
			if( this.config.effect === 'classic' ) this.classic();
			if( this.config.effect === 'boogie' ) this.boogie();
		},

		calcMousePos: function(e) {
			this.mousePos = [];
			this.mousePos.x = e.clientX;
			this.mousePos.y = e.clientY;
		},

		calcViewportSize: function() {
			this.winSize = [];
			this.winSize.x = window.innerHeight;
			this.winSize.y = window.innerWidth;
		},

		calcScrollTop: function() {
			this.scrollTop = $(window).scrollTop();
		}

	};

//
// EACH
// - - - - -

	$.fn.simplax = function(options) {
		return this.each(function() {
			new Simplax(this, options).init();
		});
	};

})(jQuery);
