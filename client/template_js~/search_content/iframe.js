Template.iframe.src = function() {
	return Session.get('iframeSrc');
};

Template.iframe.imgSrc = function() {
	return Session.get('imgSrc');
};

Template.iframe.origSrc = function() {
	return Session.get('origSrc');
};

Template.iframe.isImage = function() {
	return Session.get('isImage');
};


Template.iframe.trueRendered = function(callback) {
	//there is also html code that does the same shit, but all hacked up to deal with images and onerror, etc.
	if(!Session.get('isImage')) iframeCropper.prepareNewIframe();
	callback.call()
};

function imageMarginLeft() {
	var marginLeft = ($(window).width() - 204 - $('img.siteIframe').width())/2;
	if(marginLeft > 0) $('img.siteIframe').css('margin-left', marginLeft);	
}
