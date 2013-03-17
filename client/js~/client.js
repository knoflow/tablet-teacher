var Cube;
Meteor.startup(function () {
	//prevent touch events from causing the typical crummy safari scroll of the entire web page
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	
	resizeable = new Resizeable;	
	
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
	iframeScrollbars = new IframeScrollbars;
	
	
	Session.set('cube_flip_direction', 'left');
	Session.set('current_type', 'webpages');
	
	var room_id = 'RnrgnqjFbFCak6qok';
	Session.set('current_room_id', room_id);
	setRoom();	
	Meteor.autorun(setRoom);

	$('.backx').live(START_EV, backButton);
	
});

// BASIC SUBSCRIPTIONS: Room, its Desks, and Slides (all dependent on 'current_room_id')
function setRoom() {
	Meteor.subscribe('room', Session.get('current_room_id'), setDesk);
	Meteor.subscribe('slides', Session.get('current_room_id'), Session.get('current_type'));
	Meteor.subscribe('desks', Session.get('current_room_id'), setDesk);
}



/**
* SET INITIAL "CURRENT_DESK_ID" based on "current_room_id"
**/
var setDeskReady = 0, runAlready = false;
function setDesk() {
	if(++setDeskReady < 2) return;
	
	Meteor.autorun(function() {
		
		var room_id = Session.get('current_room_id'),
			room = Rooms.findOne(room_id);
			
		if(room && !runAlready) {
			
			runAlready = true;
			
			//insert a Desk if no desks yet and assign to room
			var desk = room.current_desk_id && Desks.findOne(room.current_desk_id),
				current_desk_id = desk && desk._id;
				
			if(!current_desk_id) {
				current_desk_id = Desks.insert({
					name: "James", //prompt('Please enter your Name:', ''), 
					room_id: room_id,
					status: ACTIVE, 
					last_keepalive: (new Date()).getTime()
				});
				
				Rooms.update(room_id, {$set: {current_desk_id: current_desk_id}});
				$.setCookie('desk_id', current_desk_id); //this will also set desk_id if no desks yet
			}
			Session.set('current_desk_id', current_desk_id); //set currently selected Abstract desk


			//update the currently selected Abstract desk when other clients change it
			Rooms.find(room_id).observeChanges({
				changed: function(id, fields) {
					console.log('NEW CURRENT_DESK_ID', fields.current_desk_id);
					if(fields.current_desk_id) Session.set('current_desk_id', fields.current_desk_id);
				}
			});

			
			
			//set Abstract desk_id for current user
			var desk_id;
			
			if(!(desk_id = $.getCookie('desk_id')) || !Desks.find(desk_id)) {
				desk_id = Desks.insert({
					name: "Emilio", //prompt('Please enter your Name:', ''), 
					room_id: room_id,
					status: ACTIVE, 
					last_keepalive: (new Date()).getTime()
				});
				
				$.setCookie('desk_id', desk_id);
			}		
			Session.set('desk_id', desk_id);
	
	
	
			console.log("##### SET CURRENT DESK ID RUN AGAIN", room_id, room, desk_id || 'bla');
			
			setDeskAlive();
			startOtherAutoruns();
		}		
	});
}

function startOtherAutoruns() {
	/**
	* LIVESLIDE SUBSCRIPTIONS: first to LiveSlides of Abstract "current_desk_id",
	* and then to concrete "current_child_desk_id"
	**/
	
	Meteor.autorun(function() {
		console.log("##### subscribe(LIVESLIDES -- ABSTRACT current_desk_id)", Session.get('current_desk_id'));
		Meteor.subscribe('liveSlides', Session.get('current_desk_id'), createConcreteChildDesk);
	});
	
}


/**
* The magic to switch Concrete "current_child_desk_id" when Abstract "current_desk_id" changes, and then observe LiveSlides
* added to Abstract desk and then add them to Concrete desk
**/
function createConcreteChildDesk() {
	var props = {parent_desk_id: Session.get('current_desk_id'), owner_desk_id: Session.get('desk_id'), room_id: Session.get('current_room_id')},
		desk = Desks.findOne(props),
		child_desk_id = desk && desk._id || Desks.insert(props);

	Session.set('current_child_desk_id', child_desk_id);
	console.log('!!!! CURRENT_CHILD_DESK_ID !!!!!', child_desk_id);
	
	Meteor.autorun(function() {
		console.log("##### subscribe(LIVESLIDES -- CONCRETE CHILD)", Session.get('current_child_desk_id'));
		Meteor.subscribe('concreteChildDeskSlides', Session.get('current_child_desk_id'), observeAbstractDesk);
	});
}

var handle;
function observeAbstractDesk() {
	console.log("##### OBSERVE HANDLE RE-RUN", Session.get('current_child_desk_id'));
	var child_desk_id = Session.get('current_child_desk_id'),
		query = LiveSlides.find({desk_id: Session.get('current_desk_id')});
	
	if(handle) handle.stop();
	handle = query.observe({
		_suppress_initial: true, //could silently changed in the future since it's undocumented
		added: function(slide) {
			
			delete slide._id;
			slide.desk_id = child_desk_id;
			slide.id = slide.old_id + "_"+ Date.now();
			
			setTimeout(function() {
				var newSlideID = LiveSlides.insert(slide);
				console.log(newSlideID, 'NEW FUCKING SLIDEE', slide.owner_desk_id, slide.old, slide.addedToDesk, slide);
				Meteor.flush();
			}, 0);
		}
	});
}

function setDeskAlive() {
	//tell server that this desk is alive every 20 seconds
	Meteor.setInterval(function() {
		if(Meteor.status().connected) {
			Meteor.call('keepalive', Session.get('desk_id'));
		}
	}, 20*1000);
};







