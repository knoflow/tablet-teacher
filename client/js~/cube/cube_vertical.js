VCube = ParentCube.extend({
	init: function() {
		this._super();
		this.type = 'VCube';
	},
	setup: function() {
		this.$selector = $('.content_cube.up_down');
		this.$currentSide = this.$selector.find('.'+this.currentSide); //this.currentSide previously set by parent class
	},
	positionSides: function() {
		var containerHeight = $('#contentContainer').height();		
		this.halfHeight = (containerHeight/2) + 'px';
	
		//rotate and push out sides for vertically rotating cube
		$('.content_cube.up_down .front')[0].style[transform] = 'rotateX(0deg) translateZ('+this.halfHeight+')';
		$('.content_cube.up_down .top')[0].style[transform] = 'rotateX(90deg) translateZ('+this.halfHeight+')';
		$('.content_cube.up_down .back')[0].style[transform] = 'rotateX(-180deg) translateZ('+this.halfHeight+')';
		$('.content_cube.up_down .bottom')[0].style[transform] = 'rotateX(-90deg) translateZ('+this.halfHeight+')';
	},
	rotate: function(direction, duration, degrees, afterRotateCallback) {	 
		direction = direction == 'down' ? -1 : 1;			
		degrees *= direction;
		this.animate($('.content_cube.up_down')[0], this.halfHeight, 'rotateX', this.currentDegrees, degrees, duration, afterRotateCallback);
		this.currentDegrees += degrees;
	},
	_nextSide: function(direction) {
		if(direction == 'down') {
			switch(this.currentSide) {
				case 'front':
					return 'top';
				case 'top':
					return 'back';
				case 'back':
					return 'bottom';
				default: // 'bottom':
					return 'front';
			}
		}
		else {
			switch(this.currentSide) {
				case 'front':
					return 'bottom';
				case 'bottom':
					return 'back';
				case 'back':
					return 'top';
				default: // 'top':
					return 'front';
			}
		}
	},

});