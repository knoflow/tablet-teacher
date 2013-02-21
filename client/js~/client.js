Meteor.startup(function () {	
	Meteor.autosubscribe(function() {
		Meteor.subscribe('desks');
	});
	
	prepareDesk();

	//prevent touch events from causing the typical crummy safari scroll of the entire web page
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	resizeable = new Resizeable;	
	
	Cube = new CubeController(new HCube, new VCube);
	
	deskTabs = new DeskTabs;
	actionButton = new ActionButton;	
	searchTabs = new SearchTabs;
	contentKeys = new ContentKeys;
	
	screenCropper = new ScreenCropper;
	searcher = new Searcher(true);
	
	imageGrid = new ImageGrid('#imageSearchInner', 'imagePage');
	videoGrid = new ImageGrid('#videoSearchInner', 'videoPage');
	
	iframeCropper = new IframeCropper;
	croppedIframe = new CroppedIframe;
});


prepareDesk = function() {
	//get desk from cookie or create new desk
	if((desk_id = $.getCookie('desk_id')) == undefined) {
		console.log('creating new desk')
		var desk_id = Desks.insert({name: 'Anonymous', status: ACTIVE, last_keepalive: (new Date()).getTime()});
		$.setCookie('desk_id', desk_id);
	}	
	Session.set('desk_id', desk_id);
	
	//tell server that this desk is alive every 20 seconds
	Meteor.setInterval(function() {
		if(Meteor.status().connected) {
			Meteor.call('keepalive', Session.get('desk_id'));
		}
	}, 60*1000);
};







