Slideable = Class.extend({
	lastX: 0,
    lastY: 0,
    mouseDown: false,
    isScrolling: false,
    isDragging: false,
	init: function(slide) {
		this.$element = $('#'+slide.id);
		this.slide = slide;
		
		this.bindStart();
		console.log(this.$element);
	},
	bindStart: function() {
		var _this = this;

		this.$element.bind(START_EV, function(e) {
console.log(123);
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
	
        var new_id = 'cloned_'+Date.now()+'_'+this.slide.id,
			left = this.$element.offset().left + 1,
		    top = this.$element.offset().top + 1,
			transform = prefixCSSstyle('transform', 'translate3d('+left+'px,'+top+'px,0px)');
		

			var slide = Slides.findOne({_id: this.slide._id});
			slide.id = new_id;
			slide.zIndex = 1000;
			slide.transform = prefixCSSstyle('transform', 'translate3d('+left+'px,'+top+'px,0px)');
			
			draggable = Meteor.render(function() {
				return Template.draggable(slide);
			});
		
		$('body').prepend(draggable);

        this.$element.hide().appendTo('.carouselInner');
        carousels[slideTypeIndex()].refresh();
				
		new Draggable('#'+new_id, 'body', this.slide.id, e.originalEvent);    
    }
});