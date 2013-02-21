/**
Template.search__.rendered
**/

Template.search_webpages.rendered = function() {
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent', setupWebpagesScroll);
	console.log('search_webpages rendered');
}
Template.search_images.rendered = function() {
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent', setupImageScroll);
	console.log('search_images rendered');
}
Template.search_videos.rendered = function() {
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent', setupVideoScroll);
	console.log('search_videos rendered');
}
Template.search_quizzes.rendered = function() {
	console.log('search_quizzes rendered');
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent');
}


/**
TEMPLATE ACCESSIBLE search_results PROPERTY
**/
Session.set("search_results_webpages", []);
Session.set("search_results_images", []);
Session.set("search_results_videos", []);
Session.set("search_results_quizzes", []);

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

Template.scroll_search_webpages.rendered = function() {
	console.log('scroll_search_webpages rendered');
};
Template.scroll_search_images.rendered = function() {
	console.log('scroll_search_images rendered');	

	$('img').bind(END_EV, function() {	
		if(!imageScroll.is_moving) {
			console.log('pressed image');
			Session.set('cube_flip_direction', 'left');
			Session.set('iframeSrc', $(this).attr('origSrc'));
			Session.set('side', 'iframe');
		}
	});
};
Template.scroll_search_videos.rendered = function() {
	console.log('scroll_search_videos rendered');	
};
Template.scroll_search_quizzes.rendered = function() {
	console.log('scroll_search_quizzes rendered');	
};
