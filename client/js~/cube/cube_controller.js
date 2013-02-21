CubeController = Class.extend({
	init: function(hCube, vCube) {
		this.hCube = hCube;
		this.vCube = vCube;
		
		this.currentCube = this.vCube;
		this.cubeCreated = false;
		this.lastRotationTime = Date.now();
		
		this.buffer = [];
		this.hCube.buffer = this.buffer;
		this.vCube.buffer = this.buffer;
	},
	rotate: function(direction, contentSelector, beforeRotateCallback, afterRotateCallback) {
		this.animationsWaiting += 1;
		
		var _this = this;
		
		//add to list of functions to execute as callbacks after each complete
		this.buffer[this.buffer.length] = function() {
			var firstTime = _this.setup();

			_this.setNextCube(direction);
			_this.nextCube.setupNextSide(direction);

			_this.switchDisplayedCube();
			_this.replaceContent(contentSelector);
			
			if(firstTime) {
				_this.hCube.rotate(direction, 0, 90);
				_this.vCube.rotate(direction, 0, 90);
			}
			else {
				if(beforeRotateCallback == undefined) {
					//call rotate() immediately because no complex content updating needs to happen
					_this.nextCube.rotate(direction, 1000, 90, afterRotateCallback);
				} else {
					//call rotate() only once content is done updating in beforeRotateCallback
					beforeRotateCallback.call(beforeRotateCallback, function() {
						_this.nextCube.rotate(direction, 1000, 90, afterRotateCallback);
					});
				}
			}

			_this.currentCube = _this.nextCube;
		};
		if(_this.buffer.length == 1) _this.buffer[0].call();

	},
	setup: function() {
		if(!this.cubeCreated) {
			this.hCube.setup();
			this.vCube.setup();
			
			this.positionSides();
			
			this.hCube.setupNextSide();
			this.vCube.setupNextSide();
			
			var _this = this;
			$(window).resize(function() {
				_this.positionSides.call(_this);
				_this.hCube.rotate.call(_this.hCube, 'left', 0, 0);
				_this.vCube.rotate.call(_this.vCube, 'down', 0, 0);
			});
		
			return this.cubeCreated = true;
		}
		return false;
	},
	positionSides: function() {
		this.hCube.positionSides();
		this.vCube.positionSides();
	},
	switchDisplayedCube: function() {
		if(this.nextCube.type == 'HCube') {
			this.vCube.$selector.hide();
			this.hCube.$selector.show();
			console.log('showing hCube');
		}
		else {
			this.hCube.$selector.hide();
			this.vCube.$selector.show();
		}
	},
	replaceContent: function(contentSelector) {
		var $oldContent = $(contentSelector+'.cube_new_side');
		if($oldContent.length > 0) {
			$oldContent.removeClass('cube_new_side').addClass('cube_old_side');
			if(this.nextCube != this.currentCube) {
				this.nextCube.$currentSide.append($oldContent);
			}
		}
		console.log(this.nextCube.$nextSide);
		this.nextCube.$nextSide.append($(contentSelector).not('.cube_old_side').addClass('cube_new_side'));
	},
	setNextCube: function(direction) {
		switch(direction) {
			case 'down':
				this.nextCube = this.vCube;
				break;
			case 'up':
				this.nextCube = this.vCube;
				break;
			case 'left':
				this.nextCube = this.hCube;
				break;	
			case 'right':
				this.nextCube = this.hCube;
				break;
		}
	},
});