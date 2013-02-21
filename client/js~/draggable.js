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
		friction: .96

	},
	
	/**
	SETUP METHODS
	**/
	init: function(element, stage, e) {
		for(prop in this.defaults) this[prop] = this.defaults[prop];
		
		this.setupStage(stage);
		this.setupElement(element);
		
		this.$stageContainer = $('body');
        if(e) this.start(this.positionX(e), this.positionY(e));
	},
	setupStage: function(stage) {
		this.$stage = $(stage);

	},
	setupElement: function(element) {
		if(this.element) this.tearDown();
		

		this.id = element;
		this.element = $(element)[0];
		this.element.addEventListener(START_EV, this, false);
		
		if(hasTouch) {
		    this.element.addEventListener('gesturestart', this, false);
		    this.element.addEventListener('gesturechange', this, false);
		    this.element.addEventListener('gestureend', this, false);    
		}

	},
	tearDown: function() {
		this.element.removeEventListener(START_EV, this, false);
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
        
        if(newWidth >= this.$stageContainer.width() * .5) {
            newHeight = this.$stageContainer.width() * .5 * newHeight/newWidth;
            newWidth = this.$stageContainer.width() * .5;
        }       
        else if(newHeight >= this.$stageContainer.height() * .5) {
            newWidth = this.$stageContainer.height() * .5 * newWidth/newHeight;
            newHeight = this.$stageContainer.height() * .5;
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
	    console.log('start');
	    this.mouseDownTime = Date.now();

	    
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

			//setup for future gesture
			this.mouseDownTime = null; 
			this.dirX = null;
			this.dirY = null;
			
			//animate the post-release movement
	        this.startAnimationTime = Date.now();
	        
	        if(Date.now() - this.lastMoveTime < 200) {//make sure the user didn't manually stop the element
	            this.animate();
	        }
	        else this.prepareAddToDesk();

	    }
	},
	render: function(time) {		
	    var acc = this.acceleration(time, 0, 1, this.duration), //get percentage animation complete
			dx = 600 * (50/this.width())  * this.vx * acc,
			dy = 600 * (50/this.height()) * this.vy * acc;
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
	    else this.prepareAddToDesk();

	},
	prepareAddToDesk: function() {
	    if(!this.addedToDesk) {
            this.addedToDesk = true; //only do this task once, i.e. the first time dragged from the carousel

            setTimeout(function() {
                this.addToDesk();
            }.bind(this), 0);    
        }
	},
	addToDesk: function() {
	    var x = ($(this.element).offset().left - $('.mainDeskInner').offset().left) * (1/this.deskScale()),
	        y = ($(this.element).offset().top - $('.mainDeskInner').offset().top)  * (1/this.deskScale());
	                
	     this.updateCss(x, y);  
	              
	     $(this.element).css({ //make element normal size again since zoomed desk is now in charge of its size
	         width: $(this.element).width() * 1/this.deskScale(),    
	         height: $(this.element).height() * 1/this.deskScale(),
	     })
	     .prependTo('.mainDeskInner'); 
	        
	     this.$stage = $('.mainDeskInner');
	     this.$stageContainer = $('#contentContainer');

	    
         this.scrollToFront();         
	},
	scrollToFront: function() {
	    //carousels[0].scrollTo(0,0,200);
	    
	    $(this.id.replace('cloned_', '')).show();
		setTimeout(function() {
		    carousels[0].refresh();    
		}.bind(this), 0);   
	},
	deskScale: function() {
	    if(!this.addedToDesk) return 1;
	    return mainDesk.scale;    
	},
	stageWidth: function() {
	    return this.$stageContainer.width();    
	},
	stageHeight: function() {
	    return this.$stageContainer.height();    
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
	        elementX = $(this.element).offset().left - this.$stage.offset().left + this.rotationFactorX(),
	        diffX = cursorX - elementX;

	    return diffX;
	},
	startDistanceFromSideY: function(y) {
        var cursorY = y,

	        elementY = $(this.element).offset().top - this.$stage.offset().top + this.rotationFactorY(),
	        diffY = cursorY - elementY;
	    
	    return diffY;

	},
	cosWidth: function() {
	    return Math.abs(Math.cos(this.degrees/180*Math.PI)) * this.width()/2;     
	},
	sinHeight: function() {
	    return Math.abs(Math.sin(this.degrees/180*Math.PI)) * this.height()/2;     
	},
	sinWidth: function() {
	    return Math.abs(Math.sin(this.degrees/180*Math.PI)) * this.width()/2;     
	},
	cosHeight: function() {
	    return Math.abs(Math.cos(this.degrees/180*Math.PI)) * this.height()/2;     
	},
    rotationFactorX: function() {
        var a = this.cosWidth() + this.sinHeight(); 
        return (this.width()/2 - a) * -1 * this.deskScale();

    },
    rotationFactorY: function() {        
        var b = this.cosHeight() + this.sinWidth(); 
        return (this.height()/2 - b) * -1 * this.deskScale();  
    },
	velocityX: function() {
	    return (this.x - this.lastPivotX) / (Date.now() - this.lastPivotTimeX);  
	},
	velocityY: function() {
	    return (this.y - this.lastPivotY) / (Date.now() - this.lastPivotTimeY);  
	},
	moveHitWallsX: function(x) {       
        if (x > this.widthMax()) return this.widthMax(); 
          
	    if (x < this.widthMin()) return this. widthMin();
	        
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
	    var widthMax = this.$stageContainer.width() - this.$stage.offset().left + this.$stageContainer.offset().left;
	    widthMax *= 1/this.deskScale();
	    widthMax -= this.width(); 
	    

	    if(!this.addedToDesk) widthMax -= 10;
	    
	    return widthMax;
	},
	widthMin: function() {
	    if(!this.addedToDesk) return 193;
	    return (this.$stageContainer.offset().left - this.$stage.offset().left)*1/this.deskScale();
	},
	heightMax: function() {
	    var heightMax = this.$stageContainer.height() - this.$stage.offset().top + this.$stageContainer.offset().top;
	    heightMax *= 1/this.deskScale();
	    heightMax -= this.height();
	    
	    if(!this.addedToDesk) heightMax -= this.bottomLine;
	    
	    return heightMax;
	},
	heightMin: function() {
	    if(!this.addedToDesk) return 46;
	    return (this.$stageContainer.offset().top - this.$stage.offset().top)*1/this.deskScale();
	},
	setCrossedBottomLine: function(y) {
	    //this is the point where the element has been dragged fully out of the carousel
	    if(y < this.stageHeight() - this.height() - 96) {
	        this.bottomLine = 96; 

	        carousels[0].refresh();    
	    }    
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

        setTimeout(function() {
            var pivot = {time: Date.now() - mouseDownTime, x: x, y: y};
            this.pivots.push(pivot);  
        }.bind(this), 0);
	}
});



prepareCarouselImageForDragging = function() {	
    var lastX, 
        lastY,
        mouseDown = false,
        isScrolling = false,
        isDragging = false,


        setupDraggable = function(e) {

            var left = $(this).offset().left + 1,
			    top = $(this).offset().top + 1,
			    scale = $(this).attr('scale') || 2,
			    newID = 'cloned_'+$(this).attr('id');
			
		    $(this).clone().css({
			    position: 'absolute',
			    height: $(this).height() * scale * mainDesk.scale,
			    width: $(this).width() * scale * mainDesk.scale,
			    zIndex: 999999
		    })
    		.attr('id', newID)
    		.hardwareCss('translate3d('+left+'px,'+top+'px,0px)')
    		.prependTo('body');
    
            $(this).hide().appendTo('.carouselInner');
            carousels[0].refresh();
    		
    		
    		DR = new Draggable('#'+newID, 'body', e.originalEvent);    
        };
        
    $('.carouselInner img').bind(START_EV, function(e) {
        lastX = getPageX(e);
        lastY = getPageY(e);
        mouseDown = true;
    });
    $('body').bind(END_EV, function() {
        mouseDown = false;    
        isScrolling = false;
        isDragging = false;
    });
    
	$('.carouselInner img').each(function() {

	    $(this).bind(MOVE_EV, function(e) {
            if(isScrolling || isDragging) return;
            
	        var x = getPageX(e),
                y = getPageY(e),
                deltaX = Math.abs(x - lastX),
                deltaY = Math.abs(y - lastY),
                moved = false;
	    
	        console.log(deltaX, deltaY);
	        if(mouseDown && deltaX > deltaY && deltaX > 5) isScrolling = true;
	        if (mouseDown && !moved && deltaY > deltaX && deltaY > 5) {
	            moved = true;
	            isDragging = true;
	            setupDraggable.call(this, e);    
            }
	    });    
	});
}

$(function() {
	setTimeout(function() {
		console.log('draggable ready!');
	    prepareCarouselImageForDragging();
	}, 3000);
});
