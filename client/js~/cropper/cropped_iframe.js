CroppedIframe = Class.extend({
	init: function() {
		
	},
	addToDesk: function() {
		var _this = this;
		
		//get iframe url and imageName to use as ID
		var iframeInfo = Session.get('new_iframe_src');
		
		//nul out to act as flag trigger this when not null
		Session.set('new_iframe_src', null);
		
		//add iframe to desk in the middle of rotation
		Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent', function(callback) {
			_this.setup(iframeInfo); //start all the magic this object is all about
			callback.call(callback);	
		});
	},
	setup: function(iframeInfo) {
		
		//create iframe-related elements
		var $iframeHolder = this.createIframeHolder(iframeInfo.imageName),
			$iframeCover = this.createIframeCover(),
			$iframe = this.createIframe(iframeInfo.url);
		
		//append iframe-related elements to each other and then the dom
		$iframeHolder.append($iframeCover)
		$iframeHolder.append($iframe);
		$iframeHolder.prependTo('.graphPaper');
		
		//make iframe draggable
		//var draggable = new Draggable('#'+'iframeHolder_'+iframeInfo.imageName, '.graphPaper');
	},
	createIframeHolder: function(imageName) {
		return $('<div/>', {	
			class: 'iframeHolder',
			id: 'iframeHolder_'+imageName	
		}).css({
			overflow: 'hidden', 
			position: 'absolute', 
			border: '1px solid black',
			width: screenCropper.phantomPageConfig.clipRect.width,
			height: screenCropper.phantomPageConfig.clipRect.height
		});
	},
	createIframeCover: function() {
		return $('<div />').css({
			position: 'absolute', 
			width: '100%',
			height: '100%',
			zIndex: 99
		});
	},
	createIframe: function(url) {
		return $('<iframe/>', {
			scrolling: 'no',
			src: url	
		}).css({
			display: 'block', 
			position: 'relative',
			border: 'none',
			width: screenCropper.phantomPageConfig.viewportSize.width,
			height: screenCropper.phantomPageConfig.viewportSize.height + screenCropper.phantomPageConfig.clipRect.top,
			left: (screenCropper.phantomPageConfig.clipRect.left * -1) + 'px',
			top: (screenCropper.phantomPageConfig.clipRect.top * -1) + 'px'
		});
	} 
});