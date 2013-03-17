Template.selected_content.side = function(side) {
	if(side == Session.get('side')) {
		console.log('new side!');
		return true;
	} 
	return false;
};

Template.selected_content.trueRendered = function() {	
	setTimeout(function() {
		if(!Cube) {
			Cube = new CubeController(new HCube, new VCube);
			Session.set('cube_flip_direction', 'down');
			Session.set('side', 'graph_paper');
		}
		
		Cube.rotate(Session.get('cube_flip_direction'), '.selectedContent', function(callback) {
			var side = Session.get('side');		
			
			//this is some nasty (but useful) stuff to call fake 'trueRendered' callbacks on selected_content the first time its rendered	
			if(Template[side] && Template[side].trueRendered) return Template[side].trueRendered(callback);
			return callback();
		});
		
	}, 0);	
};


Template.selected_content.rendered = function() {
	console.log('selected_content rendered');
}

Template.draggables.slides = function() {
	return LiveSlides.find({desk_id: Session.get('current_child_desk_id')});
};


Template.graph_paper.trueRendered = function(callback) {
	contentKeys.is_searching = false;
	mainDesk = newScroll('mainDesk', {
		hScroll: true, 
		vScroll: true,
		lockDirection: false,
		bounce: false,
		zoom: true,
		wheelAction: 'zoom',
		zoomMin: .5,
		zoomMax: 10
	});
	callback.call();
};