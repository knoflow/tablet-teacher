Template.slide.rendered = function() {
	console.log('slide rendered', this.data.id);
	
	//new Slideable('#'+this.data.id, this.data.width, this.data.height);
	new Slideable(this.data);
	
	if(carousels[slideTypeIndex()]) carousels[slideTypeIndex()].refresh();
};

Template.draggable.rendered = function() {
	console.log('draggable rendered');
};

Template.slide.adjusted_width = function() {
	return this.width/this.height*75;
};

Template.slide.iframe_left = function() {
	return this.left * 75/this.height;
};

Template.slide.iframe_top = function() {
	return this.top * 75/this.height;
};

Template.slide.iframe_width = function() {
	return this.viewport_width;
};

Template.slide.iframe_height = function() {
	return this.viewport_height + this.top;
};

Template.slide.scale = function() {
	return 75/this.height;
}
Template.slide.scale_transform = function() {
	console.log('heightRatio', this.heightRatio);
	return prefixCSSstyle('transform', 'scale('+75/this.height*this.heightRatio+')') + ' ' + prefixCSSstyle('transform-origin', '0 0');
};

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

