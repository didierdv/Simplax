/*
 * AUTHOR: Didier De Vos
 * AUTHOR'S WEBSITE: http://didierdevos.be
 *
 * Date: August/Sept., 2013
 * Last modification: N/A
 */

(function($) {

//
// CLASS
// - - - - -

	function Simplax(elem, options) {

		this.$elem    = $(elem); //needs to be jQuery object
		this.metadata = this.$elem.data('simplax') || null;
		this.opts     = options || null;

		var self = this;
	
		this.boogie = function() {

			console.log("Exécution de Simplax.boogie()");
			
			var rangePx = calcRangePx(self.config.range),
				oppositeMoving = self.config.oppositeMoving ? 1 : -1,
				elemBgPosArr,
				elemBgPosArrLength;

            /* Works out the range in pixels.
             * The value is relative to the viewport's width/height. */
            function calcRangePx(range) {
            	console.log(range);
                return {
                	x: range / self.winSize.x,
                	y: range / self.winSize.y
                }
            }

            /* Works out the new coords of the background following cursor moving. */
            function setBgCoords(e) {
                var coords = [],
                    pageX = e.pageX - self.winSize.x / 2,
                    pageY = e.pageY - self.winSize.y / 2;

                coords.x = elemBgPosArr[0] - rangePx.x * pageX * oppositeMoving;
                coords.y = elemBgPosArr[1] - rangePx.y * pageY * oppositeMoving;

                self.$elem.css("background-position", coords.x + "px " + coords.y + "px");
            }

            // Retrieve element's X and Y background positions through their CSS background-position value */
            elemBgPosArr = self.$elem.css("background-position").replace(/(px|%|em)/g, "").split(" ");
            elemBgPosArr[0] *= 1; 
            elemBgPosArr[1] *= 1;

            document.addEventListener("mousemove", setBgCoords, false);

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
				originalOffset,
				setYPos;

			/* Defining the orinal offset of the element depending on the value to animate */
			switch( this.config.animate ) {

				case 'background-position':
				case 'top':
					originalOffset = this.$elem.offset().top;
					break;

				case 'bottom':
					originalOffset = $(window).height() - ( this.$elem.offset().top + this.$elem.height() );
					break;
				
				case 'left':
					originalOffset = this.$elem.offset().left;
					break;

				case 'right':
					originalOffset = $(window).width() - ( this.$elem.offset().left + this.$elem.width() );
					break;
			
			}

			setYPos = function() {

				var posVal;
				
				if(self.config.animate === 'background-position') {
					// Making sure the element to be animated is visible within the viewport.
					// If not, animation is stopped and will resume when element is visible again.
					if ( !(self.scrollTop + $(window).height() > originalOffset && originalOffset + self.$elem.height() > self.scrollTop) ) return;

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
			'animate': 'background-position' 	//Can be: ('background-position|top|bottom|left|right')
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
