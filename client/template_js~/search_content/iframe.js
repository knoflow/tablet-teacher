Template.iframe.src = function() {
	return screenCropper.url = Session.get('iframeSrc');
};

Template.iframe.rendered = function() {	
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent', function(callback) {
		iframeCropper.prepareNewIframe(callback);
	});
};