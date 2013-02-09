Draggable = Class.extend({
	defaults: {
		$surface: null, 
		element: null,

		mouseStartX: 0,
		mouseStartY: 0,
		mouseEndX: 0,
		mouseEndY: 0,

		vx: 0,
		vy: 0,
		mouseLetGoX: 0,
		mouseLetGoY: 0,
		leftDir: 1,
		topDir: 1,
		xForce: 0,
		yForce: 0,

		mouseDownTime: null,
		startAnimationTime: 0,

		width: null,
		height: null, 
		
		stageW: 0,
		stageH: 0,
		duration: 1000
	},
	init: function(element, surface) {
		for(prop in this.defaults) {
			this[prop] = this.defaults[prop];
		}
		
		this.$surface = $(surface);
		this.setupElement(element);
		
		document.addEventListener(MOVE_EV, this, false);
	    document.addEventListener(END_EV, this, false);
	},
	setupElement: function(element) {
		if(this.element) this.tearDown();
		//this.element = document.querySelectorAll(element)[0];
		
		this.element = $(element)[0];
		this.element.addEventListener(START_EV, this, false);
		
		this.width = $(element).width();	
		this.height = $(element).height();
	},
	tearDown: function() {
		this.element.removeEventListener(START_EV, this, false);
	},
	handleEvent: function(e) {
		switch(e.type) {
			case START_EV:
				e.preventDefault();
				this.start(getPageX(e), getPageY(e));
				break;
			case END_EV:
				this.end(getPageX(e), getPageY(e));
				break;
			case MOVE_EV:
				this.move(getPageX(e), getPageY(e));
				break;
		}
	},
	start: function(ex, ey) {
		this.stageW = this.$surface.width();
	    this.stageH = this.$surface.height();

	    this.mouseDownTime = Date.now();

	    this.mouseStartX = this.positionX(ex);
	    this.mouseStartY = this.positionX(ey);
	},
	move: function(ex, ey) {
		if(this.mouseDownTime) {
			var x = this.positionX(ex),
				y = this.positionX(ey);

	        //bounce off walls
	        if (x > this.stageW - this.width) {
	            x = this.stageW - this.width;
			} else if (x < 0) {
				x = 0;
			} 

			if (y > this.stageH - this.height) {
				y = this.stageH - this.height;
			} else if (y < 0) {
				y = 0;
			}

			$(this.element).hardwareCss('translate3d(' + x + 'px,' + y + 'px, 0)');
		}
	},
	end: function(ex, ey) {
		if(this.mouseDownTime) {
	        this.startAnimationTime = Date.now();

	        //set where mouse end
	        this.mouseEndX = this.mouseLetGoX = this.positionX(ex);
	        this.mouseEndY = this.mouseLetGoY = this.positionX(ey);

	        //determine direction
	        if(this.mouseEndX < this.mouseStartX) this.leftDir = -1;
	        else this.leftDir = 1;
	        if(this.mouseEndY < this.mouseStartY) this.topDir = -1;
	        else this.topDir = 1;


	        //get velocity without direction
	        this.vx = m.abs(this.mouseEndX - this.mouseStartX);
	        this.vy = m.abs(this.mouseEndY - this.mouseStartY);

	        //get force by dividing velociy by change in time
	        var changeInTime = this.startAnimationTime - this.mouseDownTime;
	        this.xForce = ((this.vx / changeInTime) + 1) * .7;
	        this.yForce = ((this.vy /changeInTime) + 1) * .7;

	        this.animate();
			this.mouseDownTime = null;
	    }
	},
	render: function(time) {
		//get percentage animation complete, utilizing force
	    var xSlope = this.acceleration(time, 0, 1, this.duration, this.xForce);
	    var ySlope = this.acceleration(time, 0, 1, this.duration, this.yForce);

	    //make sure that x is calculated differently if negative direction vs. positive direction
	    if(this.leftDir == -1) this.mouseEndX = (this.leftDir*this.vx*xSlope) + (this.mouseLetGoX);
	    else this.mouseEndX = (this.vx*xSlope) + (this.mouseLetGoX);

	    //make sure that y is calculated differently if negative direction vs. positive direction
	    if(this.topDir == -1) this.mouseEndY =  (this.topDir*this.vy*ySlope) + (this.mouseLetGoY);
	    else this.mouseEndY = (this.vy*ySlope) + (this.mouseLetGoY);   

	    //bounce off walls
	    if (this.mouseEndX > this.stageW - this.width) {
	    	this.mouseEndX = this.stageW - this.width;
	        this.leftDir *= -1;
		} else if (this.mouseEndX < 0) {
			this.mouseEndX = 0;
	        this.leftDir *= -1;
		} 

		if (this.mouseEndY > this.stageH - this.height) {
			this.mouseEndY = this.stageH - this.height;
	        this.topDir *= -1;
		} else if (this.mouseEndY < 0) {
			this.mouseEndY = 0;
	        this.topDir *= -1;
		}

		$(this.element).hardwareCss('translate3d(' +this.mouseEndX + 'px,' + this.mouseEndY + 'px, 0)');
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
	positionX: function(ex) {
		return ex - this.$surface.offset().left
	},
	positionY: function(ey) {
		return ey - this.$surface.offset().top
	}
	
});
