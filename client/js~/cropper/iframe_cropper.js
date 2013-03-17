IframeCropper = Class.extend({
	init:function() {
		
	},	
	//main entry point method
	prepareNewIframe: function(callback) {	
		this.setupJcrop();
		if(!Session.get('isImage')) iframeScrollbars.setup();

		if(callback) callback.call();
	},
	setupJcrop: function() {
		var _this = this;
		
		this.jcrop_api = $.Jcrop('#iframeScroll');
		this.jcrop_api.enable();
		
		this.jcrop_api.setOptions({
			bgFade: true,
			onSelect: function(coords) {
				_this.crop(coords);
			}
		});
	},
	
	
	//secondary entry point method
	crop: function(coords) {
		//extract coordinates from jCrop		
		screenCropper.setPhantomPageConfig(coords); 
		
		//get unique image				
		this.imageNameNOpng = screenCropper.imageNameNOpng(); 
		
		//add temp slide 
		this.addSlide(); 
		
		//crop via phantomjs
		screenCropper.crop(function(imgSrc, imageName) {			
			this.updateSlide(imgSrc); //update temp slide with image	
		}.bind(this));
	},
		
	addSlide: function(coords) {
		Slides.insert({
			id: this.imageNameNOpng,
			room_id: Session.get('current_room_id'),
			url: $('.siteIframe').attr('src'),
			time: Date.now(),
			type: slideType(),
			
			isImage: Session.get('heightRatio') != 1,
			heightRatio: Session.get('heightRatio'),
			
			left: screenCropper.phantomPageConfig.clipRect.left,
		    top: screenCropper.phantomPageConfig.clipRect.top,
		
			width: screenCropper.phantomPageConfig.clipRect.width,
		    height: screenCropper.phantomPageConfig.clipRect.height,
			
			viewport_width: screenCropper.phantomPageConfig.viewportSize.width,
		    viewport_height: screenCropper.phantomPageConfig.viewportSize.height,
		
			user_agent: screenCropper.phantomPageConfig.settings.userAgent
		});	
	},
	updateSlide: function(imgSrc) {
		Slides.update({id: this.imageNameNOpng}, {$set: {src: imgSrc}});
	}
});





