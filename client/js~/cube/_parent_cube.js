ParentCube = Class.extend({
	init: function() {
		this.currentDegrees = 0;
		this.cubeCreated = false;
		this.currentSide = 'front';
	},
	setupNextSide: function(direction) {
		this.nextSide = this._nextSide(direction);
		console.log('next side '+this.nextSide);
		this.$nextSide = this.$selector.find('.'+this.nextSide);
	},
	acceleration: function() {
		return acceleration.apply(this, arguments);
	},
	animate: function(element, transZ, rotateXY, startDegrees, degrees, duration, afterRotateCallback) {
		var startAnimationTime = Date.now();
		
		var _this = this;
		var rotateAnimation = function() {

			var time = Date.now() - startAnimationTime; 
			
			if(time < duration) {
				nextFrame(rotateAnimation);

			    var percentComplete = _this.acceleration(time, 0, 1, duration),
					rotateDegrees = startDegrees + (percentComplete*degrees);
				
				$(element).hardwareCss('translateZ(-'+transZ+')' + rotateXY+'('+rotateDegrees+'deg)');
			}
			else {			
				var endDegrees = startDegrees + degrees; //make sure everything finishes where it's meant to 
				$(element).hardwareCss('translateZ(-'+transZ+')' + rotateXY+'('+endDegrees+'deg)')
				
				_this.clearPreviousSides();
				if(afterRotateCallback != undefined) afterRotateCallback.call(afterRotateCallback);
				_this.buffer.shift();
			 	if(_this.buffer.length > 0) _this.buffer[0].call();
			}
		}
		rotateAnimation();
	},
	clearPreviousSides: function() {
		console.log(this.$currentSide, this.$nextSide);
		this.currentSide = this.nextSide;
		this.$currentSide = this.$nextSide;
		$('.cube_old_side').remove();
	}
});