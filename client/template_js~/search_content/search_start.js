Template.search_start_webpages.rendered = function() {
	console.log('search_start_webpages rendered');
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent');
}
Template.search_start_images.rendered = function() {
	console.log('search_start_images rendered');
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent');
}
Template.search_start_videos.rendered = function() {
	console.log('search_start_videos rendered');
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent');
}
Template.search_start_quizzes.rendered = function() {
	console.log('search_start_quizzes rendered');
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent');
}