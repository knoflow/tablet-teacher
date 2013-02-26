var HCube = ParentCube.extend({
	init: function() {
		this._super();
		this.type = 'HCube';
	},
	setup: function() {
		this.$selector = $('.content_cube.left_right');
		this.$currentSide = this.$selector.find('.'+this.currentSide); //this.currentSide previously set by parent class
	},
	positionSides: function() {
		var containerWidth = $('#contentContainer').width();
		this.halfWidth = (containerWidth/2) + 'px';
	
		//rotate and push out sides for horizontally rotating cube
		$('.content_cube.left_right .front')[0].style[transform] = 'rotateY(0deg) translateZ('+this.halfWidth+')';
		$('.content_cube.left_right .right')[0].style[transform] = 'rotateY(90deg) translateZ('+this.halfWidth+')';
		$('.content_cube.left_right .back')[0].style[transform] = 'rotateY(-180deg) translateZ('+this.halfWidth+')';
		$('.content_cube.left_right .left')[0].style[transform] = 'rotateY(-90deg) translateZ('+this.halfWidth+')';
	},
	rotate: function(direction, duration, degrees, afterRotateCallback) {
		direction = direction == 'left' ? -1 : 1;			
		degrees *= direction;
		this.animate($('.content_cube.left_right')[0], this.halfWidth, 'rotateY', this.currentDegrees, degrees, duration, afterRotateCallback);
		this.currentDegrees += degrees;
	},
	_nextSide: function(direction) {
		if(direction== 'left') {
			switch(this.currentSide) {
				case 'front':
					return 'right';
				case 'right':
					return 'back';
				case 'back':
					return 'left';
				default:// 'left':
					return 'front';
			}
		}
		else {
			switch(this.currentSide) {
				case 'front':
					return 'left';
				case 'left':
					return 'back';
				case 'back':
					return 'right';
				default:// 'right':
					return 'front';
			}
		}
	},


});