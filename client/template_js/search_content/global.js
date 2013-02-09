function backButton() {
	Session.set('cube_flip_direction', Session.get('cube_flip_direction') == 'left' ? 'right' : 'left');
	Session.set('side', 'search_start_'+Session.get('search_type'));
	setTimeout(function() {
		Session.set('cube_flip_direction', Session.get('cube_flip_direction') == 'left' ? 'right' : 'left');
	}, 2000); //set rotation direction back to the original direction after back rotation is finished
}

Template.search_controls.events({
	'click .leftSelector, click .rightSelector': function(event) {
		var _this = event.currentTarget;
		$(_this).siblings().removeClass('active');
		$(_this).addClass('active');
	},
	'click .backx': function(event) {
		backButton();
	},
});

Template.search_controls.rendered = function() {
	$('.start_cancel_search').css('top', $('#contentContainer').height()/2 - 31);
	contentKeys.is_searching = true;
};

var loadingInterval;
Template.start_cancel_search.rendered = function() {	
	clearInterval(loadingInterval);
	$('.start_search').bind(START_EV, function(event) {
		var _this = event.currentTarget,
			searchType = Session.get('search_type'),
			keywords = $('#searchField input').val();
			
		$(_this).hide();		
		Session.set('side', 'loading');		

		searcher.performSearch(searchType, keywords);
	});
};

Template.loading.rendered = function() {
	//start loading css3 animation
	$('.bar').addClass('barAnimation');
	loadingInterval = setInterval(function() {
		$('.bar').removeClass('barAnimation');
		setTimeout(function() {$('.bar').addClass('barAnimation');}, 0);
	}, 6000);
	
	Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent');
	
	console.log('loading rendered');
}

Template.search_result_webpage.events({
	'click .textResultsBox .arrow': function(event) {
		var _this = event.currentTarget;
		
		Session.set('cube_flip_direction', 'left');
		Session.set('iframeSrc', $(_this).parent().find('h2').text());
		Session.set('side', 'iframe');
	}
});




