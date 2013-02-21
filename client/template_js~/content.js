Session.set('side', 'graph_paper');
Template.selected_content.side = function(side) {
	if(side == Session.get('side')) {
		console.log('new side!');
		return true;
	} 
	return false;
};


Template.selected_content.rendered = function() {
	console.log('selected_content rendered');
}


Template.graph_paper.rendered = function() {
	
	contentKeys.is_searching = false;
	
	if(Session.get('new_iframe_src')) croppedIframe.addToDesk();
	else Cube.rotate('up', '.selectedContent'); //setup current desk
	
	
	setTimeout(function() {
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
	}, 3000);
	
};