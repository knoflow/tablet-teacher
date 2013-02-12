Draggable = Class.extend({
	defaults: {
		element: null,
		width: null,
		height: null,
		
		$stage: null, 
		stageW: 0,
		stageH: 0,


		mouseStartX: 0,
		mouseStartY: 0,
		
		mouseEndX: 0,
		mouseEndY: 0,
		
		deltaX: 0,
		deltaY: 0,
		
		lastX: 0,
		lastY: 0,


		mouseDownTime: null,
		startAnimationTime: 0,		
		duration: 1000,
		bounce: -0.75,
		friction: 1

	},
	
	/**
	SETUP METHODS
	**/
	init: function(element, stage) {
		for(prop in this.defaults) this[prop] = this.defaults[prop];
		
		this.setupStage(stage);
		this.setupElement(element);
	},
	setupStage: function(stage) {
		this.$stage = $(stage);
		this.stageW = this.$stage.width();
	    this.stageH = this.$stage.height();
	
		document.addEventListener(MOVE_EV, this, false);
	    document.addEventListener(END_EV, this, false);
	},
	setupElement: function(element) {
		if(this.element) this.tearDown();
		
		this.width = $(element).width();	
		this.height = $(element).height();
		
		this.x = $(element).offset().left;
		this.y = $(element).offset().top;
		
		this.element = $(element)[0];
		this.element.addEventListener(START_EV, this, false);
	},
	tearDown: function() {
		this.element.removeEventListener(START_EV, this, false);
	},
	handleEvent: function(e) {
		var x = this.positionX(e),
			y = this.positionY(e);
			
		switch(e.type) {
			case START_EV:
				e.preventDefault();
				this.start(x, y);
				break;
			case END_EV:
				this.end(x, y);
				break;
			case MOVE_EV:
				this.move(x, y);
				break;
		}
	},
	
	
	/**
	CORE WORK METHODS
	**/
	start: function(x, y) {
	    this.mouseDownTime = Date.now();
	    this.mouseStartX = this.lastX = x;
	    this.mouseStartY = this.lastY = y;
	},
	move: function(x, y) {
		if(this.mouseDownTime) {
			//record raw changes and delta in mouse movements
			this.deltaX = x - this.lastX;
	        this.deltaY = y - this.lastY;
			
			this.lastX = x;
			this.lastY = y;
							
			//apply friction coefficient to mouse-movement delta
			this.vx = this.deltaX * this.friction;
			this.vy = this.deltaY * this.friction;
			
			//apply the raw delta to the actual xy values
			var newX = this.x + this.vx;
				newY = this.y + this.vy;
		
			//test if those values exeed bounds, and don't let them go farther than bounds
			if (newX > this.stageW - this.width) newX = this.stageW - this.width; 
			if (newX < 0) newX = 0;

			if (newY > this.stageH - this.height) newY = this.stageH - this.height;
			if (newY < 0) newY = 0;
					
			//record actual xy values for usage in next tick	
			this.x = newX;
			this.y = newY;
			
			this.updateCss(newX, newY);		
			this.markPivot();
		}
	},
	end: function(x, y) {
		if(this.mouseDownTime) {
			//get velocity
			this.vx = (this.x - this.lastPivotX) / (Date.now() - this.lastPivotTimeX);
			this.vy = (this.y - this.lastPivotY) / (Date.now() - this.lastPivotTimeY);

			//setup for future gesture
			this.mouseDownTime = null; 
			this.dirX = null;
			this.dirY = null;
			
			//animate the post-release movement
	        this.startAnimationTime = Date.now();
			this.animate();
	    }
	},
	render: function(time) {		
	    var acc = this.acceleration(time, 0, 1, this.duration), //get percentage animation complete
			dx = 200 * this.vx * acc,
			dy = 200 * this.vy * acc,
 			x = dx + this.x, 
		 	y = dy + this.y; 
		
		console.log(acc, x, y);


		//reverse direction if necessary, while applying bounce of -0.76 to slow it down
		x = this.bounceOffWallsX(x);
		y = this.bounceOffWallsY(y);
		
		this.updateCss(x, y);
	},
	
	
	
	/**
	UTILITY METHODS
	**/	
	animate: function() {
		var time = Date.now() - this.startAnimationTime;
		
	    if(time < this.duration) {
			var _this = this;
			
	        nextFrame(function() {
				_this.animate();
			});
			
	        this.render(time);
	    }
	},
	acceleration: function() {
		return acceleration.apply(this, arguments);
	},
	reverseAcceleration: function(t, b, c, d) {
		return (t==d) ? b+c - 1 : c * (Math.pow(2, -10 * t/d) + 1) + b -1;
	},
	positionX: function(e) {
		return getPageX(e) - this.$stage.offset().left;
	},
	positionY: function(e) {
		return getPageY(e) - this.$stage.offset().top;
	},
	bounceOffWallsX: function(x) {
		if (x > this.stageW - this.width) return this.bounce * x;
		if (x < 0) return this.bounce * x;
		return x;
	},
	bounceOffWallsY: function(y) {	
		if (y > this.stageH - this.height) return this.bounce * y;
		if (y < 0) return this.bounce * y;
		return y;
	},
	updateCss: function(x, y) {
		$(this.element).hardwareCss('translate3d(' + x + 'px,' + y + 'px, 0)');
	},
	markPivot: function() {
		//mark direction in first tick
		if(!this.dirX) {
			this.dirX = (this.deltaX) >= 0 ? 1 : -1;
			this.lastPivotTimeX = Date.now();
			this.lastPivotX = this.x;
		}
		if(!this.dirY) {
			this.dirY = (this.deltaY) >= 0 ? 1 : -1;
			this.lastPivotTimeY = Date.now();
			this.lastPivotY = this.y;
		}
		
		//get the direction every tick
		this.dirXnew = (this.deltaX) > 0 ? 1 : -1;
		this.dirYnew = (this.deltaY) > 0 ? 1 : -1;
		
		
		//compare new direction to currently stored direction
		//and then update the latter if necessary, and mark pivot time
		if(this.dirXnew != this.dirX) {
			//console.log('X Pivot! : '+this.dirXnew, this.x);
			this.dirX = this.dirXnew;
			this.lastPivotTimeX = Date.now();
			this.lastPivotX = this.x;
		}
		else {
			//console.log("X NO PIVOT: " + this.x);
		}
		if(this.dirYnew != this.dirY) {
			console.log('Y Pivot!', this.dirYnew, this.y);
			this.dirY = this.dirYnew;
			this.lastPivotTimeY = Date.now();
			this.lastPivotY = this.y;
		}
		else {
			console.log("Y NO PIVOT: " + this.y);
		}
	}
	
});


prepareCarouselImageForDragging = function() {
	var $img = $('.carouselInner img:eq(0)');
	$img.bind(START_EV, function() {
		var $newImg = $(this).clone(),
			newId = 'cloned_'+$newImg.attr('id'),
			left = $(this).offset().left + 1,
			top = $(this).offset().top + 1;
			
		$newImg.attr('id', newId).css({
			position: 'absolute',
			height: $(this).css('height'),
			width: $(this).css('width'),
			zIndex: 999999
		})
		.hardwareCss('translate3d('+left+'px,'+top+'px,0px)')
		.prependTo('body');
		
		new Draggable('#'+newId, 'body');
	});
}

