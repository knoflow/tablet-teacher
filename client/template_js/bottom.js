Template.carouselWebpages.contentItems = [1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];
Template.carouselImages.contentItems = [1,2,3,3,1,2,3,3,3,3,3,3,3,3,3,3,];
Template.carouselVideos.contentItems = [1,2,3,3,3,3,3,3,3,1,2,3,3,3,3,3,3,3,3,3,3,];
Template.carouselQuizzes.contentItems = [1,2,3,3,3,3,3,3,3,3,3,3,3];

Template.carouselWebpages.rendered = function() {
	setupCarouselWebpages();
};

Template.carouselImages.rendered = function() {
	setupCarouselImages();
}

Template.carouselVideos.rendered = function() {
	setupCarouselVideos();
};;

Template.carouselQuizzes.rendered = function() {
	setupCarouselQuizzes();
};

Template.carousel_cube.rendered = function() {
	//rotate and push out sides for horizontally rotating cube
	var halfHeight = (84/2)+'px';
	$('#carousel_cube .content_cube .front')[0].style[transform] = 'rotateX(0deg) translateZ('+halfHeight+')';
	$('#carousel_cube .content_cube .top')[0].style[transform] = 'rotateX(90deg) translateZ('+halfHeight+')';
	$('#carousel_cube .back')[0].style[transform] = 'rotateX(-180deg) translateZ('+halfHeight+')';
	$('#carousel_cube .content_cube .bottom')[0].style[transform] = 'rotateX(-90deg) translateZ('+halfHeight+')';
}

