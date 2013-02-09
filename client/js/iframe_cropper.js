IframeCropper = Class.extend({
	init:function() {
		
	},
	
	
	//main entry point method
	prepareNewIframe: function(callback) {
		this.setupBackButton();		
		this.setupJcrop();
		this.prepareIframeScrollbars();
		
		callback.call();
	},
	setupBackButton: function() {
		$('.jcrop-holder').prepend('<div class="backx"></div>');
		$('.backx').click(backButton);
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
		var _this = this;
		
		//extract coordinates from jCrop
		screenCropper.setPhantomPageConfig(coords);
		
		//prepare imageName and carousel to put content into
		this.imageName = screenCropper.createImageName();
		this.imageNameNOpng = screenCropper.imageNameNOpng();
		this.carouselIndex = this.currentCarouselIndex();
		
		//add temp content
		var interval = this.addTempImageToCarousel(coords);
		this.displayTempIframeOnDesk();
		
		//utilize our server side phantomjs-powered screenCropper uility and add the clipping to current carousel
		screenCropper.crop(function(imgSrc, imageName) {
			var imageNameNOpng = imageName.replace('.png', '');
			
			_this.replaceCroppedIframeWithActualImage(imgSrc, imageNameNOpng);
			var $img = _this.addCroppedImageToCarousel(imgSrc, imageNameNOpng, interval);				
			_this.prepareCarouselImageForDragging($img);
		});
	},
	
	
	//add temporary content before cropped image is ready
	addTempImageToCarousel: function(coords) {
		var carouselIndex = this.carouselIndex,
			width = 75*(coords.w/coords.h),
			$tmpDiv = $('<div />', { 
				id: 'temp_loading_'+this.imageNameNOpng,
				class: 'tmp_loading_div'
			})
			.css('width', width)
			.prependTo('.carouselInner:eq('+carouselIndex+')');
			
		//make ... elipsis tick in image just prepended
		var interval = this.setLoadingAnimation($tmpDiv);
		
		//refresh carousel to properly contain the new increased width
		carousels[carouselIndex].refresh();
		
		return interval;
	},
	displayTempIframeOnDesk: function() {
		Session.set('new_iframe_src',  {url: $('#iframeScroll iframe').attr('src'), imageName: this.imageNameNOpng});				
		Session.set('cube_flip_direction', 'down');
		Session.set('side', 'graph_paper');
	},
	
	
	//update temp content with real cropped image
	replaceCroppedIframeWithActualImage: function(imgSrc, imageNameNOpng) {
		$('#iframeHolder_'+imageNameNOpng).replaceWith('<img class="draggable" src="'+imgSrc+'" id="'+imageNameNOpng+'" />');
	},
	addCroppedImageToCarousel: function(imgSrc, imageNameNOpng, interval) {
		var _this = this;
		
		//create new image of cropped iframe portion
		var $img = $('<img />', {
			src: imgSrc,
			id: 'carousel_'+imageNameNOpng
		});
		
		//replace temp loading div with new actual image
		$('#temp_loading_'+imageNameNOpng).replaceWith($img);	
					
		//when image is loaded, refresh the corresponding carousel
		$('#'+imageNameNOpng).imagesLoaded(function() {
			carousels[_this.carouselIndex].refresh();
		});
		
		clearInterval(interval);
		
		return $img;	
	},
	prepareCarouselImageForDragging: function($img) {
		$img.bind(START_EV, function() {
			var $newImg = $(this).clone(),
				newId = 'cloned_'+$newImg.attr('id'),
				left = $(this).offset().left,
				top = $(this).offset().top;
				
			$newImg.attr('id', newId).css({
				position: 'absolute',
				height: $(this).css('height'),
				zIndex: 999999
			})
			.hardwareCss('translate3d('+left+'px,'+top+'px,0px)')
			.prependTo('body');
			
			new Draggable('#'+newId, 'body');
		});
	},
	
	
	//kinda unrelated task compared to the rest of em -- add custom scrollbars
	prepareIframeScrollbars: function() {
		var iframeSrc = Session.get('iframeSrc');
		
		screenCropper.preloadUrlAndHeight(iframeSrc, function(iframeHeight) {
			
			//set height of iframe to correct height as received from phantomjs on the server, and apply scroll
			$('#iframeScroll iframe').css('height', iframeHeight);
			var iframeScroll = new IframeScroll(iframeHeight);

			//this is crummy, but we dont know how long we need the scrollbar, 
			//so when the iframe is gone, we kill it
			var interval = setInterval(function() {
				if($('#iframeScroll iframe').length == 0) {
					console.log('iframe destroyed');

					iframeScroll.tearDown();
					clearInterval(interval);
				}
			}, 500);
		});
	},
	
	
	//utilities
	currentCarouselIndex: function() {
		return $('.searchTab').index($('.searchTab.active')); //0 = webpages, 1 = images, etc
	},
	setLoadingAnimation: function($tmpDiv) {
		var i=0;
		
		//make it Say Loading. Loading.. Loading... in repeat
		var interval = setInterval(function() {
			var j = i % 3;
		
			switch(j) {
				case 0:
					$tmpDiv.html('loading.&nbsp;&nbsp;');
					break;
				case 1:
					$tmpDiv.html('loading..&nbsp;');
					break;
				case 2:
					$tmpDiv.html('loading...');
					break;
			}
			
			i++;
		}, 300);
		
		return interval;
	}
});





