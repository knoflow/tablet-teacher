Resizeable = Class.extend({
	init: function() {
		this.resizeAllElements();  
		
		var _this = this;
	    $(window).resize(function() {
			_this.resizeAllElements();
		});
	},
	resizeAllElements: function() {
		var width = $(window).width(), 
			height = $(window).height();
		
		for (var resizeFunc in this.elements) {
			this.elements[resizeFunc].call(this, width, height);
		}
	},
	elements: {
		resizeCarousel: function(width, height) {
		    $('#carousel_cube').css('width', width - 193);
			if(carousels[0] != undefined) carousels[0].refresh();
			if(carousels[1] != undefined) carousels[1].refresh();
			if(carousels[2] != undefined) carousels[2].refresh();
			if(carousels[3] != undefined) carousels[3].refresh();
		},
		resizeSearchField: function(width, height) {
		    $('#searchField').css('width', width - 220);
		},
		resizeDeskContainer: function(width, height) {
		    $('#triangle_cube').css('height', height - 394);
			if(desksDesksScroll != undefined) desksDesksScroll.refresh();
			if(desksQuizzesScroll != undefined) desksQuizzesScroll.refresh();
			if(desksGroupsScroll != undefined) desksGroupsScroll.refresh();
		},
		resizeMain: function(width, height) {
		    $('#main').css('height', height - 132);
		},
		resizeBodyContainer: function(width, height) {
		    $('#bodyContainer').css('height', height);
		},
		resizeImagePage: function(width, height) {
			$('.imagePage').css({
				width: width - 199,
				height: height - 144
			});
		},
		resizeContentContainer: function(width, height) {
			$('#contentContainer').css({
				width: width - 204,
				height: height - 144
			});
		},
		resizeSearchScroll: function(width, height) {
		    $('.searchScroll').css('height', height - 193);
			if(webScroll != undefined) setTimeout(function() { webScroll.refresh(); }, 0);
		},
		resizeImageSearchScroll: function(width, height) {
		    $('#imageSearch').css('height', height - 193);
			if(imageScroll != undefined) setTimeout(function() { imageScroll.refresh(); }, 0);
		},
		resizeVideoSearchScroll: function(width, height) {
		    $('#videoSearch').css('height', height - 193);
			if(videoScroll != undefined) setTimeout(function() { videoScroll.refresh(); }, 0);
		}
	}
});