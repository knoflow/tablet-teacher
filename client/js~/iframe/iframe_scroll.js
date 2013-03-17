IframeScroll = Class.extend({
	init: function(iframeHeight) {
		console.log('setting up iframe scroll');
		this.iframeScroll = new iScroll('iframeScroll', {
		    hScrollbar: false,
			vScrollbar: true,
		    hScroll: false,
			hideScrollbar: false,
			fadeScrollbar: false,
			appendScrollbarToBody: true,
			additionalClass: 'scrolly'
		});

		this.scrollBuffer = [];
		this.startY = 0;
		this.lastY = 0;
		this.lastScrollbarPosition = 0;

		this.iframeHeight = iframeHeight;	
		this.contentContainerHeight = $('#contentContainer').height();

		this.lastWheelY = 0;
		this.lastWheelX = 0;

		this.bindScrollbar();
		this.bindMousewheel();
		this.setScrollbarHeight();
	},
	bindScrollbar: function() {
		var _this = this;
		
		$('.scrollyV > div').bind(START_EV, function(event) {
			_this.startY = getPageY(event);
			$(window).bind(MOVE_EV + '.iframeScroll', function(event) {
				_this.scrollFrame(event);
			});
		});

		$(window).bind(END_EV + '.iframeScroll', function(event) {
			_this.startY = getPageY(event),
			$(window).unbind(MOVE_EV + '.iframeScroll', function(event) {
				_this.scrollFrame(event);
			});
		});
	},
	bindMousewheel: function() {
		var _this = this;
		
		$(window).bind('DOMMouseScroll.iframeScroll', function(event) {
			_this.scrollWheelPrep(event);
		});
		$(window).bind('mousewheel.iframeScroll', function(event) {
			_this.scrollWheelPrep(event);
		});
	},
	scrollFrame: function(event) {
		var _this = this;
		this.scrollBuffer.push(getPageY(event));
		nextFrame(function() {
			_this.scrollAnimate();
		});
	},
	scrollFrameWheel: function(y) {
		var _this = this;
		this.scrollBuffer.push(y);
		nextFrame(function() {
			_this.scrollAnimate();
		});
	},
	scrollAnimate: function() {
		var	iframeHeight = this.iframeHeight,
			contentContainerHeight = this.contentContainerHeight,
			iframeTop = $('.iframeInner').offset().top,
			iframeBottom = iframeTop + iframeHeight,

			contentContainerTop = $('#contentContainer').offset().top,
			contentContainerBottom = contentContainerTop + contentContainerHeight,

			newY = this.scrollBuffer.shift(),
			deltaY = this.newY - this.lastY,
			coefficient = (iframeHeight - contentContainerHeight) / contentContainerHeight,
			deltaIframeY = -1 * coefficient * deltaY;
			iframeY = -1 * coefficient * newY;

		//make sure scrollbar cant go past bounds	
		if (iframeY >= 0) {//(iframeTop + deltaIframeY >= contentContainerTop) {//scrolled too far up
			$('.scrollyV > div').hardwareCss('translate(0px, 0px) translateZ(0px)');
			$('.iframeInner').hardwareCss('translate(0px, 0px) translateZ(0px)');
		} 
		else if (iframeY <= -1*(iframeHeight - contentContainerHeight)) {//scrolled too far down
			$('.scrollyV > div').hardwareCss('translate(0px, '+this.lastScrollbarPosition+'px) translateZ(0px)');
			$('.iframeInner').hardwareCss('translate(0px, -'+(iframeHeight - contentContainerHeight)+'px) translateZ(0px)');
		}
		else {
			$('.scrollyV > div').hardwareCss('translate(0px, '+newY+'px) translateZ(0px)');
			$('.iframeInner').hardwareCss('translate(0px, '+iframeY+'px) translateZ(0px)');
			this.lastScrollbarPosition = this.newY; //use this to set in elseif above so scrollbar doesnt go farther down
		}


		this.lastY = this.newY;
	},
	scrollWheelPrep: function(event) {
		var e = event.originalEvent,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale,
			potentialChangeY;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}

		potentialChangeY = -1*(this.lastWheelY + wheelDeltaY);

		if(potentialChangeY >= 0 && potentialChangeY <= $('#contentContainer').height()) {
			console.log('over');
			this.lastWheelX += deltaX = wheelDeltaX;
			this.lastWheelY += deltaY = wheelDeltaY;
		}


		this.scrollFrameWheel(-1*this.lastWheelY);
	},
	setScrollbarHeight: function() {
		$('.scrollyV > div').css('height', 50 + (300 / this.iframeHeight * 200) );
	},
	tearDown: function() {
		$('.scrollyV > div').remove();
		$(window).unbind('.iframeScroll');
	}
});