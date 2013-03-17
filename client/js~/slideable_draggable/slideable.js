Slideable = Class.extend({
	lastX: 0,
    lastY: 0,
    mouseDown: false,
    isScrolling: false,
    isDragging: false,
	init: function(slide) {
		this.$element = $('#'+slide.id);
		this.slide = slide;
		
		console.log('THIS IS SLIDEABLE!!!!', this.slide);
		
		this.bindStart();
	},
	bindStart: function() {
		var _this = this;

		this.$element.bind(START_EV, function(e) {

	        _this.lastX = getPageX(e);
	        _this.lastY = getPageY(e);
	        _this.mouseDown = true;
			
			_this.bindMove();
			_this.bindEnd();
	    });
	},
	bindMove: function() {
		this.$element.bind(MOVE_EV+'.slideable', function(e) {
			this.move(e);
		}.bind(this));
	},
	move: function(e) {
		if(this.isScrolling || this.isDragging) return;
        
        var x = getPageX(e),
            y = getPageY(e),
            deltaX = Math.abs(x - this.lastX),
            deltaY = Math.abs(y - this.lastY);
            
        this.moved = false;    

        if(this.mouseDown && deltaX > deltaY && deltaX > 4) this.isScrolling = true;
        if (this.mouseDown && !this.moved && deltaY > deltaX && deltaY > 4) {
            this.moved = true;
            this.isDragging = true;
            this.setupDraggable(e);    
        }
	},
	bindEnd: function() {
		var _this = this;
		
		$('body').bind(END_EV+'.slideable', function() {
			_this.mouseDown = false;    
	        _this.isScrolling = false;
	        _this.isDragging = false;
	
			_this.$element.unbind(MOVE_EV+'.slideable');
			$('body').unbind(END_EV+'.slideable');
		});
	},
	setupDraggable: function(e) {
	
        var new_id = 'cloned_'+Date.now()+'_old_id___'+this.slide.id,
			left = this.$element.offset().left + 1,
		    top = this.$element.offset().top + 1,
			transform = prefixCSSstyle('transform', 'translate3d('+left+'px,'+top+'px,0px)'),
			self = this,
			newDraggable = $.extend({}, self.slide),
			draggable;
			
		newDraggable.id = new_id;
		newDraggable.zIndex = 1000;
		newDraggable.transform = transform;
		newDraggable.event = e.originalEvent;
		
		draggable = Meteor.render(function() {
			return Template.draggable(newDraggable);
		});
	
		$('body').prepend(draggable);
		//console.log('NEW DRAGGABLE from slideable', this.slide.owner_desk_id, this.slide.old, this.slide.addedToDesk, this.slide);
		//new Draggable(this.slide, e.originalEvent); //pass this.slide so draggable can utilize its info for its placement, etc
		
		//hide original slideable element until new draggable sticks in place, and refresh carousel
        this.$element.hide();
		setTimeout(function() {
			this.$element.show();
			carousels[slideTypeIndex()].refresh();
		}.bind(this), 1000);
		
        carousels[slideTypeIndex()].refresh();		   
    }
});