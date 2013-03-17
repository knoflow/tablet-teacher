//I need to add a loading animation before the image/iframe shows
Template.iframe.trueRendered = function(callback) {
	var $frame;
	
	if(Session.get('isImage')) {
		$frame = $('<img />', {
			src: Session.get('origSrc'),
			class: 'siteIframe'
		}).css({
			display: 'none'
		}).error(function() {
			this.src = Session.get('imgSrc');
		}).load(function() {
			console.log('img loaded'); 
			
			//set the height to the height of #contentContainer
			var newHeight = $(window).height() - 144; 
			Session.set('heightRatio', newHeight/$(this).height()); 
			$(this).css('height', newHeight); 
			
			//center the image
			var marginLeft = ($(window).width() - 204 - $('img.siteIframe').width())/2;
			if(marginLeft > 0) $('img.siteIframe').css('margin-left', marginLeft);
			
			$('img.siteIframe').show();
			iframeCropper.prepareNewIframe(); 
		});	
		
	}
	else {
		var shown = false;
		
		Session.set('heightRatio', 1);
		
		$frame = $('<iframe />', {
			scrolling: 'no', 
			src: Session.get('iframeSrc'),
			class: 'siteIframe'
		}).css({
			display: 'none'
		}).bind('load', function() {
			if(!shown) { //iframes seem to continually call the load function once loaded...weird
				$('iframe.siteIframe').show();
				iframeCropper.prepareNewIframe();
				//callback.call();
			}
			shown = true;
		});
	}	
	
	$('.iframeInner').prepend($frame);
	callback.call();
};

