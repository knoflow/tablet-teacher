IframeScrollbars = Class.extend({
	init: function() {
		
	},
	setup: function() {
		var iframeSrc = $('.siteIframe').attr('src');
		
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
	}	
});