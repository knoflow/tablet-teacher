Template.carouselWebpages.slides = function() {
	return Slides.find({type: 'webpages'});
};
Template.carouselImages.slides = function() {
	return Slides.find({type: 'images'});
};
Template.carouselVideos.slides = function() {
	return Slides.find({type: 'videos'});
};
Template.carouselQuizzes.slides = function() {
	return Slides.find({type: 'quizzes'});
};


Template.carouselWebpages.rendered = function() {
	console.log('carousel web pages rendered!!');
	setupCarouselWebpages();
};


Template.carouselImages.rendered = function() {
	setupCarouselImages();
}

Template.carouselVideos.rendered = function() {
	setupCarouselVideos();
};

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

