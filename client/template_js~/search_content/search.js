/**
* Template.search__.rendered
**/
Template.search_webpages.trueRendered = function(callback) {
	setupWebpagesScroll(callback);
	console.log('search_webpages rendered');
}
Template.search_images.trueRendered = function(callback) {
	setupImageScroll(callback)
	console.log('search_images rendered');
}
Template.search_videos.trueRendered = function(callback) {
	setupVideoScroll(callback);
	console.log('search_videos rendered');
}
Template.search_quizzes.trueRendered = function(callback) {
	console.log('search_quizzes rendered');
}


/**
TEMPLATE ACCESSIBLE search_results PROPERTY
**/
Template.scroll_search_webpages.search_results = function () {
	return Session.get('search_results_webpages');
};
Template.scroll_search_images.search_results = function () {
	return Session.get('search_results_images');
};
Template.scroll_search_videos.search_results = function () {
	return Session.get('search_results_videos');
};
Template.scroll_search_quizzes.search_results = function () {
	return Session.get('search_results_quizzes');
};


/**
Template.scroll_search__.rendered
**/
Template.scroll_search_images.rendered = function() {
	$('img').bind(END_EV, function() {	
		if(!imageScroll.is_moving) {
			Session.set('isImage', true);
			
			Session.set('origSrc', $(this).attr('origSrc'));
			Session.set('imgSrc', $(this).attr('src'));
			
			Session.set('cube_flip_direction', 'left');
			Session.set('side', 'iframe');
		}
	});
};


Template.search_result_webpage.rendered = function() {
	$('.textResultsBox .arrow').bind(END_EV, function() {	
		Session.set('iframeSrc', $(this).parent().find('h2').text());
		
		Session.set('cube_flip_direction', 'left');
		Session.set('side', 'iframe');
	});
};
