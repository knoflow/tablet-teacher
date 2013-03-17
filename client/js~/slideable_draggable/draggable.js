Draggable = Class.extend({
	defaults: {
		element: null, 
		
		$stage: null, 
		$stageContainer: null,


		x: 0,
		y: 0,

        scale: 1,

		degrees: 0,
		oldDegrees: 0,
		
		deltaX: 0,
		deltaY: 0,
		
		lastX: 0,
		lastY: 0,

        pivots: [],

        bottomLine: 0,

        
		mouseDownTime: Date.now(),
		startAnimationTime: 0,	
		
		//configuration options	
		duration: 1000,
		bounce: 0.75,
		friction: .96,


	},
	
	/**
	SETUP METHODS
	**/
	init: function(slide) {
		for(prop in this.defaults) this[prop] = this.defaults[prop];
		
		this.slide = slide;
		$('#'+this.slide.old_id).remove(); //remove the original pre-collection liveSlide;
		this.setupElement('#'+slide.id);
	
        if(slide.event) { //we automatically initiate the start event when Draggable is cloned from Slideable, which was actually clicked
			this.$stage = this.$stageContainer = $('body');
			this.start(this.positionX(slide.event), this.positionY(slide.event));
			
			this.beforeAddedToThisDesk();
		}
		else { //Draggable is already on the desk because its collection rendered it there
			this.$stage = $('.mainDeskInner');
		    this.$stageContainer = $('#contentContainer');
		
			this.updateDeskPosition();
		}
		
		
	},
	updateDeskPosition: function() {
		//reAnimate before and after being added to this desk and desks of others
		if(this.slide.owner_desk_id == Session.get('desk_id')) {
			this.afterAddedToThisDesk();
		}
		else {
			if(!this.addedToDesk()) this.beforeAddedToOtherDesk();
			else this.afterAddedToOtherDesk();
		}
	},
	updateDeskPositionOLD: function() {
		//reAnimate before and after being added to this desk and desks of others
		if(this.slide.owner_desk_id == Session.get('desk_id')) {
			if(!this.addedToDesk()) this.beforeAddedToThisDesk();
			else this.afterAddedToThisDesk();
		}
		else {
			if(!this.addedToDesk()) this.beforeAddedToOtherDesk();
			else this.afterAddedToOtherDesk();
		}
	},
	beforeAddedToThisDesk: function() {
		console.log('### beforeAddedToThisDesk ### '+this.slide._id);
		//insert
	},
	afterAddedToThisDesk: function() {
		console.log('### afterAddedToThisDesk ### '+this.slide._id);
		//update
	},
	beforeAddedToOtherDesk: function() {
		console.log('### beforeAddedToOtherDesk ### '+this.slide._id);
		this.placeInCorner();
		this.reAnimate();
	},
	afterAddedToOtherDesk: function() {
		console.log('### afterAddedToOtherDesk ### '+this.slide._id);
		//exact movement matching
	},
	setupElement: function(element) {
		this.element = element;
		$(this.element).css('z-index', 999999);
		
		var element = $(element)[0];
		element.addEventListener(START_EV, this, false);
		
		if(hasTouch) {
		    element.addEventListener('gesturestart', this, false);
		    element.addEventListener('gesturechange', this, false);
		    element.addEventListener('gestureend', this, false);    
		}

	},

	handleEvent: function(e) {    

	    this.handleGesture(e);

        if(!this.gestureStarted) {
            var x = this.positionX(e),
			    y = this.positionY(e);
			
            switch(e.type) {
    			case START_EV:
    				e.preventDefault();
                    e.stopPropagation();
    				this.start(x, y);
    				break;
    			case MOVE_EV:
    			    e.stopPropagation();
    				this.move(x, y);
    				break;
    			case END_EV:
    				this.end(x, y);
    				break;
    		}      
        }			
	},
	handleGesture: function(e) {

	    switch(e.type) {
	        case 'gesturestart':
    		    this.gestureStart(e);
    		    break;
    		case 'gesturechange':
    		    this.gestureChange(e);
    			break;
    		case 'gestureend':
    		    this.gestureEnd(e);
    		    break;        
	    }
	    if(this.gestureStarted) e.stopPropagation();
	},
    gestureStart: function(e) {
        this.gestureStarted = true;
        
        this.originalWidth = this.width();
        this.originalHeight = this.height();
    },
    gestureChange: function(e) {

        this.degrees = this.oldDegrees + e.rotation % 360;   
           
        var scale = e.scale,
            newWidth = this.originalWidth * scale,
            newHeight = this.originalHeight * scale;
         
         

        console.log(this.$stageContainer.width());
        
        if(newWidth >= this.$stageContainer.width() * .75) { //change $stageContainer to $stage at some point
            newHeight = this.$stageContainer.width() * .75 * newHeight/newWidth;
            newWidth = this.$stageContainer.width() * .75;
        }       
        else if(newHeight >= this.$stageContainer.height() * .75) {
            newWidth = this.$stageContainer.height() * .75 * newWidth/newHeight;
            newHeight = this.$stageContainer.height() * .75;
        }

        
        if(newWidth <= 80) {
            newHeight = 80 * newHeight/newWidth;
            newWidth = 80;
        }  
        else if(newHeight <= 80) {
            newWidth = 80 * newWidth/newHeight;
            newHeight = 80;
        }

              
        $(this.element).css({
            width: newWidth,
            height: newHeight    
        });
        
        this.updateCss(this.x, this.y);
    },
    gestureEnd: function(e) {
        this.oldDegrees = this.oldDegrees + e.rotation % 360;        
        
        //make it so touchend event handler isn't called immediately after
        setTimeout(function() {
            this.gestureStarted = false;      
        }.bind(this), 100);  
    },
	
	
	
	/**
	CORE WORK METHODS
	**/
	start: function(x, y) {
	    console.log('start', this);
	    this.mouseDownTime = Date.now();
	    this.bringToFront();
	    
	    document.addEventListener(MOVE_EV, this, false);
	    document.addEventListener(END_EV, this, false);
	    
	    //setup raw start xy values
	    this.lastX = x;
	    this.lastY = y;

	    //make it so you drag element not from top left, but from where you clicked
	    this.x = x - this.startDistanceFromSideX(x);
		this.y = y - this.startDistanceFromSideY(y);
	
		//take into consideration deskScale inversely
	    this.x *= 1/this.deskScale();
	    this.y *= 1/this.deskScale();
	    		
	    this.updateCss(this.x, this.y);	
	},
	move: function(x, y) {
		if(this.mouseDownTime) {
            console.log('move');
            
			//record raw changes and delta in mouse movements
			this.deltaX = x - this.lastX;
	        this.deltaY = y - this.lastY;
            
            //don't waste resources for 1-4px movement
            if(Math.abs(this.deltaX) < 5 && Math.abs(this.deltaY) < 5) return; 
            
            //store last mouse/touche coordinates for comparison in next move
			this.lastX = x;
			this.lastY = y;

			//1) apply friction coefficient to mouse-movement delta
			//2) apply the raw delta to the actual xy values
			var newX = this.x + (this.deltaX * this.friction * 1/this.deskScale()),
				newY = this.y + (this.deltaY * this.friction * 1/this.deskScale());

			//test if those values exeed bounds, and don't let them go farther than bounds
			this.x = this.moveHitWallsX(newX);
			this.y = this.moveHitWallsY(newY);	
        
			this.updateCss(this.x, this.y);		

			this.markPivot();
			this.lastMoveTime = Date.now();
		}
	},
	end: function(x, y) {
		if(this.mouseDownTime) {
		    console.log('end');

		    document.removeEventListener(MOVE_EV, this, false);
	        document.removeEventListener(END_EV, this, false);
	    

			//get velocity
			this.vx = this.velocityX();
			this.vy = this.velocityY();
			
			//make elements first launched off carousel go extra fast
			if(!this.addedToDesk()) {
			    this.vy = Math.max(1.6, Math.abs(this.vy)) * -1;
			    console.log(this.vx, this.vy);
			}

			//setup for future gesture
			this.previousMouseDownTime = this.mouseDownTime; //record for tracking duration from final movement pivot to release animation end
			this.mouseDownTime = null; 
			this.dirX = null;
			this.dirY = null;
			
			//animate the post-release movement
	        this.startAnimationTime = Date.now();
	        
	        if(Date.now() - this.lastMoveTime < 200) {//make sure the user didn't manually stop the element
	            this.animate(); //animate the release momentum
	        }
	        else this.addToDesk();

	    }
	},
	render: function(time) {		
	    var acc = this.acceleration(time, 0, 1, this.duration), //get percentage animation complete
			dx = 600 * (50/this.width())  * this.vx * acc,
			dy = 600 * (50/this.height()) * this.vy * acc,
			x = this.x + dx,
			y = this.y + dy;

		//reverse direction if necessary, while applying bounce of -0.75 to slow it down
		x = this.bounceOffWallsX(x);
		y = this.bounceOffWallsY(y);	

		
		this.updateCss(x, y);
	},
	
	
	
	/**
	UTILITY METHODS
	**/	
	animate: function() {
		var time = Date.now() - this.startAnimationTime,
		    noClickDuringAnimation = this.startAnimationTime > this.mouseDownTime;
		
	    if(time < this.duration && noClickDuringAnimation) {

	        nextFrame(function() {
				this.animate();
			}.bind(this));
			
	        this.render(time);
	    }
	    else this.addToDesk();

	},
	addedToDesk: function() {
	    //console.log('this.slide.addedToDesk', this.slide.addedToDesk, 'this.slide.old', this.slide.old)
		return this.slide.addedToDesk && this.onDesk || this.slide.old;
	},
	addToDesk: function() {
		this.buildPivotsArray(this.x, this.y, this.previousMouseDownTime);
		
		this.onDesk = true;
		
		setTimeout(function() {		
			if(!this.addedToDesk()) {
				this.insertSlide();
                this.showCarouselSlide(); //display the original slide in the carousel again
        	}
			else this.updateSlide();
		}.bind(this), 0);
	},
	insertSlide: function() {	
		//make element normal size again since zoomed desk is now in charge of its size
		this.slide.width = $(this.element).width() * 1/this.deskScale();
		this.slide.height = $(this.element).height() * 1/this.deskScale();

		//adjust the x/y coordinates so the element appears at the same position but on the desk
		this.slide.transform = prefixCSSstyle('transform', this.getNewCss(this.getScaledX(), this.getScaledY()));

		this.slide.vx = this.vx;
		this.slide.vy = this.vy;
		
		this.slide.bottomLinePercentX = this.bottomLinePercentX;
		this.slide.addedToDesk = true;
		
		this.slide.pivots = this.pivots;
		//this.pivots.length = 0;

		//console.log('pivots', this.pivots, 'length', this.slide.pivots.length);
		
		this.slide.desk_id = Session.get('current_desk_id'); //insert into currently selected Abstract desk
		this.slide.owner_desk_id = Session.get('desk_id'); //mark the owner as the current user
		this.slide.old_id = this.slide.id;
		
		delete this.slide._id;
		delete this.slide.event;
	
		console.log('ABOUT TO INSERT SLIDE', this.slide.owner_desk_id, this.slide.old, this.slide.addedToDesk, this.slide);
		LiveSlides.insert(this.slide); //collection-driven draggable will now appear on the desk
		
		//reset slide properties for slideable to properly morph into next draggable
		//this.slide.addedToDesk = false;
		//this.slide.onDesk = false;
	},
	updateSlide: function() {
	    console.log("UPDATING SLIDE");
		LiveSlides.update(this.slide._id, {$set: {
				old: true,
				transform: prefixCSSstyle('transform', this.getNewCss(this.getScaledX(), this.getScaledY()))
			}
		});
	},
	getScaledX: function() {
		return ($(this.element).offset().left - $('.mainDeskInner').offset().left) * (1/this.deskScale());
	},
	getScaledY: function() {
		return ($(this.element).offset().top - $('.mainDeskInner').offset().top)  * (1/this.deskScale());
	},
	bringToFront: function() {
	    var highestZindex = 0,
	        $images = $('.mainDeskInner img');
	    if($images.length === 0) {
	        highestZindex = 100;
	    }
	    else {
	        $images.each(function() {

                if($(this).css('z-index') > highestZindex) highestZindex = $(this).css('z-index');
            });	  
	    }
        
        $(this.element).css('z-index', ++highestZindex);  
	},
	showCarouselSlide: function() {
	    $('#'+this.originalID()).show(); 
	
		setTimeout(function() {
		    carousels[slideTypeIndex()].refresh();    
		}.bind(this), 0);   
	},
	originalID: function() {
		//get the original slide element in the carousel by id, by removing: 'cloned_[1234567]_old_id___'
		var id = this.slide.id;
		return id.substr(id.indexOf('_old_id___')+10);
	},
	deskScale: function() {
	    if(!this.addedToDesk()) return 1;
	    return this.mainDesk() && this.mainDesk().scale || 1;    
	},
	mainDesk: function() {
		return mainDesk;
	},
	stageWidth: function() {
	    return this.$stageContainer.width();    
	},
	stageHeight: function() {
	    return this.$stageContainer.height();    
	},
	widthRotated: function() {
	    return this.cosWidth() + this.sinHeight(); 
	},
	heightRotated: function() {
	    return this.cosHeight() + this.sinWidth(); 
	},
	width: function() {
	    return $(this.element).width();    
	},
	height: function() {
	    return $(this.element).height();
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
	startDistanceFromSideX: function(x) {
	    var cursorX = x,
	        elementX = $(this.element).offset().left - this.$stage.offset().left + this.rotationFactorX()/2,
	        diffX = cursorX - elementX;

	    return diffX;
	},
	startDistanceFromSideY: function(y) {
        var cursorY = y,

	        elementY = $(this.element).offset().top - this.$stage.offset().top + this.rotationFactorY()/2,
	        diffY = cursorY - elementY;
	    
	    return diffY;

	},
	cosWidth: function() {
	    return Math.abs(Math.cos(this.degrees/180*Math.PI)) * this.width();     
	},
	sinHeight: function() {
	    return Math.abs(Math.sin(this.degrees/180*Math.PI)) * this.height();     
	},
	sinWidth: function() {
	    return Math.abs(Math.sin(this.degrees/180*Math.PI)) * this.width();     
	},
	cosHeight: function() {
	    return Math.abs(Math.cos(this.degrees/180*Math.PI)) * this.height();     
	},
    rotationFactorX: function() {
        var a = this.cosWidth() + this.sinHeight(); 
        return (this.width() - a) * -1 * this.deskScale();

    },
    rotationFactorY: function() {        
        var b = this.cosHeight() + this.sinWidth(); 
        return (this.height() - b) * -1 * this.deskScale();  
    },
	velocityX: function() {
	    return (this.x - this.lastPivotX) / (Date.now() - this.lastPivotTimeX);  
	},
	velocityY: function() {
	    return (this.y - this.lastPivotY) / (Date.now() - this.lastPivotTimeY);  
	},
	moveHitWallsX: function(x) {       
        if (x > this.widthMax()) return this.widthMax(); 
          
	    if (x < this.widthMin()) return this.widthMin();
	        
        return x;
	},
	moveHitWallsY: function(y) {
	    this.setCrossedBottomLine(y);

        if (y > this.heightMax()) return this.heightMax(); 
          

	    if (y < this.heightMin()) return this.heightMin();
	        
        return y;

	},
	bounceOffWallsX: function(x) {

		if (x > this.widthMax()) {
		     var xOutaBoundsRight = x - this.widthMax();
		     x = this.widthMax() - (this.bounce * xOutaBoundsRight); //make x equal to widthLimit - the amount its outa bounds (times the bounce coefficient)

			return this.bounceOffWallsX(x); //recursively call this function again to make sure the object doesn't hit the opposite wall
		}    
  
		if (x < this.widthMin()) {
		     var xOutaBoundsLeft = this.widthMin() - x;
		     x = this.widthMin() + (this.bounce * xOutaBoundsLeft);

		     return this.bounceOffWallsX(x);   
		}
		
		return x;
	},
	bounceOffWallsY: function(y) {	  
		if (y > this.heightMax()) {
		     var yOutaBoundsBottom = y - this.heightMax();
		     y =  this.heightMax() - (this.bounce * yOutaBoundsBottom); //make y equal to heightLimit - the amount its outa bounds (times the bounce coefficient)

			return this.bounceOffWallsY(y); //recursively call this function again to make sure the object doesn't hit the opposite wall
		}    
		

		if (y < this.heightMin()) {
		     var yOutaBoundsTop = this.heightMin() - y;
		     y = this.heightMin() + (this.bounce * yOutaBoundsTop);

		     return this.bounceOffWallsY(y);   
		}
		
		return y;		
	},
	widthMax: function() {	
		if(this.beingReAnimated) {
			var widthMax = this.$stageContainer.width() - this.$stage.offset().left + this.$stageContainer.offset().left;
	        widthMax *= 1/this.deskScale();
	        widthMax -= this.width(); 
	        return widthMax;
		}
        else if(!this.addedToDesk()) {
	        var widthMax = this.$stageContainer.width() - this.$stage.offset().left + this.$stageContainer.offset().left;
	        widthMax *= 1/this.deskScale();
	        widthMax -= this.width(); 
	        widthMax -= 10;
	        return widthMax;
	    }
	    else {
	        //this is annoying, but basically, the width of the block is 
	        //considered to be half cos/sin style rotated + half regular width. 
	        return this.$stage.width() - (this.width()/2 + this.widthRotated()/2);    
	    }
	},
	widthMin: function() {
	    if(this.beingReAnimated) {
			//bounce off $stageContainer while attached to desk
			return (this.$stageContainer.offset().left - this.$stage.offset().left)*1/this.deskScale();
		}
        else if(!this.addedToDesk()) return 193;

	    return 0 + (this.widthRotated()/2 - this.width()/2); //cos/sign style + regular width
	},
	heightMax: function() {
	    if(this.beingReAnimated) {
			var heightMax = this.$stageContainer.height() - this.$stage.offset().top + this.$stageContainer.offset().top;
	        heightMax *= 1/this.deskScale();
	        heightMax -= this.height();
	        return heightMax;
		}
        else if(!this.addedToDesk()) {
	        var heightMax = this.$stageContainer.height() - this.$stage.offset().top + this.$stageContainer.offset().top;
	        heightMax *= 1/this.deskScale();
	        heightMax -= this.height();
	        heightMax -= this.bottomLine;
	        return heightMax;
	    }
	    else {
	        //this is annoying, but basically, the width of the block is 
	        //considered to be half cos/sin style rotated + half regular width. 
	        return this.$stage.height() - (this.height()/2 + this.heightRotated()/2);    
	    }
	},
	heightMin: function() {
	    if(this.beingReAnimated) {
			 //bounce off $stageContainer while attached to desk
			 return (this.$stageContainer.offset().top - this.$stage.offset().top)*1/this.deskScale();
		}
        else if(!this.addedToDesk()) return 46;
	    
		return 0 + (this.heightRotated()/2 - this.height()/2); //cos/sign style + regular width
	},
	setCrossedBottomLine: function(y) {
	    //this is the point where the element has been dragged fully out of the carousel
	    if(y < this.stageHeight() - this.height() - 96) {
	        this.bottomLine = 96; 

			this.bottomLinePercentX = this.bottomLinePercentX || (this.x - 193)/(this.$stageContainer.width() - 203); //mark this for usage in reAnimation on other screens, so they start from correct x coordinate
			
	        carousels[slideTypeIndex()].refresh();    
	    }    
	},
	getNewCss: function(x, y) {
		return'translate3d(' + x + 'px,' + y + 'px, 0) rotate('+this.degrees+'deg)';
	},
	updateCss: function(x, y) {  
		$(this.element).hardwareCss('translate3d(' + x + 'px,' + y + 'px, 0) rotate('+this.degrees+'deg)');
	},

	markPivot: function() {
        var newPivot = false;
	    
		//mark direction in first tick
		if(this.noDirX = !this.dirX) this.dirX = this.deltaX >= 0 ? 1 : -1;
		if(this.noDirY = !this.dirY) this.dirY = this.deltaY >= 0 ? 1 : -1;
		
		//get the direction every tick.
		//set to same direction as before if there is no change.
		this.dirXnew = this.deltaX == 0 ? this.dirX : (this.deltaX > 0 ? 1 : -1);
		this.dirYnew = this.deltaY == 0 ? this.dirY : (this.deltaY > 0 ? 1 : -1);
	
		
		//compare new direction to currently stored direction
		//and then update the latter if necessary, and mark pivot time
		if(this.dirXnew != this.dirX || this.noDirX) {
			this.dirX = this.dirXnew;
			this.lastPivotTimeX = Date.now();
			this.lastPivotX = this.x;
            newPivot = true;
		}

		if(this.dirYnew != this.dirY || this.noDirY) {
			this.dirY = this.dirYnew;
			this.lastPivotTimeY = Date.now();
			this.lastPivotY = this.y;
            newPivot = true;
		}
		
        //build this.pivots array for re-animating on other clients ;)
        if(newPivot) this.buildPivotsArray(this.x, this.y, this.mouseDownTime);
	},
	buildPivotsArray: function(x, y, mouseDownTime) {
		console.log(x, y, mouseDownTime);
		
        setTimeout(function() {
            var pivot = {duration: Date.now() - mouseDownTime, x: x, y: y};
            this.pivots.push(pivot); 
        }.bind(this), 0);
	},
	reAnimateOld: function() {
		var timeElapsed = 0;
		console.log('PIVOTS', this.slide.pivots);
		$.each(this.slide.pivots, function(k, v) {
			var duration = v.duration - timeElapsed; //get just the milliseconds since last time elapsed tracked

			console.log(v, duration);
			 
			$(this.element).hardwareAnimate({translateX: v.x, translateY: v.y}, {translateX: true, translateY: true}, duration, 'swing');
	
			timeElapsed += v.duration;

		}.bind(this));
	},
	placeInCorner: function() {
		this.vx = this.slide.vx;
		this.vy = this.slide.vy;	
		
		this.x = this.slide.bottomLinePercentX * this.$stageContainer.width();
		this.y = this.$stageContainer.height() - 95 + -1 * (this.$stage.offset().top - 46);
		
		this.startAnimationTime = Date.now();
		this.beingReAnimated = true;
	},
	reAnimate: function() {
		var time = Date.now() - this.startAnimationTime;
		
	    if(time < this.duration) {

	        nextFrame(function() {
				this.reAnimate();
			}.bind(this));
			
	        this.render(time);
	    }
		else this.beingReAnimated = false;

	}
});