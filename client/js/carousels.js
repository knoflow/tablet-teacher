/**
iScroll for the 3 different desk tabs
**/
var desksDesksScroll, desksQuizzesScroll, desksGroupsScroll;

function setupDesksDesks() {
	return (desksDesksScroll == undefined) ? desksDesksScroll = vScroll('desksDesksScroll') : desksDesksScroll.refresh(); 
}
function setupDesksQuizzes() {
	return (desksQuizzesScroll == undefined) ? desksQuizzesScroll = vScroll('desksQuizzesScroll') : desksQuizzesScroll.refresh(); 
}
function setupDesksGroups() {
	return (desksGroupsScroll == undefined) ? desksGroupsScroll = vScroll('desksGroupsScroll') : desksGroupsScroll.refresh(); 
}


/**
iScroll carousels for the bottom content slider
**/
var carouselWebpages, carouselImages, carouselVideos, carouselQuizzes, carousels = [];

function setupCarouselWebpages() {
	$('#carouselWebpages').imagesLoaded(function() {
		carousels[0] = carouselWebpages = hScroll('carouselWebpages');
	});
}

function setupCarouselImages() {
	$('#carouselImages').imagesLoaded(function() {
		carousels[1] = carouselImages = hScroll('carouselImages');
	});
}

function setupCarouselVideos() {
	$('#carouselVideos').imagesLoaded(function() {
		carousels[2] = carouselVideos = hScroll('carouselVideos');
	});
}

function setupCarouselQuizzes() {
	$('#carouselQuizzes').imagesLoaded(function() {
		carousels[3] = carouselQuizzes = hScroll('carouselQuizzes');
	});
}



/**
iScroll for web, image and video search
**/
var webScroll, imageScroll, videoScroll;

function setupWebpagesScroll(cubeFlipCallback) {
	resizeable.elements.resizeSearchScroll($(window).width(), $(window).height());
	webScroll = vScroll('webScroll');

	var colors = ['#f23e5b', '#32d8ff', '#f3f608', '#10fa04'].shuffle();
	$('.webResults h2').each(function(index) {
		$(this).css('color', colors[index % 4]);
	});
	
	cubeFlipCallback.call(cubeFlipCallback);
}

function setupImageScroll(cubeFlipCallback) {
	$(imageGrid.selector).imagesLoaded(function() {
		resizeable.elements.resizeImageSearchScroll($(window).width(), $(window).height());
		
		imageGrid.render();

		imageScroll = newScroll('imageSearch', {
			hScroll: true, 
			snap: 'p', 
			onScrollMove: function() {
				imageScroll.is_moving = true;
			},
			onScrollEnd: function() {
				imageScroll.is_moving = false;
			}
		});
		
		cubeFlipCallback.call(cubeFlipCallback);
	});
}

function setupVideoScroll(cubeFlipCallback) {
	$(videoGrid.selector).imagesLoaded(function() {
		resizeable.elements.resizeVideoSearchScroll($(window).width(), $(window).height());
		
		videoGrid.render();

		videoScroll = newScroll('videoSearch', {hScroll: true, snap: 'p'});
		
		cubeFlipCallback.call(cubeFlipCallback);
	});
}
