Meteor.publish('room', function(id) {
	return Rooms.find(id);
});

Meteor.publish('slides', function (room_id, type) {
    return Slides.find({room_id: room_id, type: type});
});

Meteor.publish('desks', function (room_id) {
    return Desks.find({room_id: room_id});
});


Meteor.publish('liveSlides', function (desk_id) {
    return LiveSlides.find({desk_id: desk_id});
});
Meteor.publish('concreteChildDeskSlides', function (desk_id) {
    return LiveSlides.find({desk_id: desk_id});
});

Meteor.methods({
	keepalive: function (desk_id) {
	    Desks.update({_id: desk_id},
	                  {$set: {last_keepalive: (new Date()).getTime(),
	                          status: ACTIVE}});
	}
});

Meteor.setInterval(function () {
	var now = (new Date()).getTime();
	var idle_threshold = now - 70*1000; // 70 sec
	var away_threshold = now - 140*1000;//60*60*1000; // 1hr
	
	Desks.update({last_keepalive: {$lt: idle_threshold}}, 
				{$set: {status: IDLE}}, 
				{multi: true});
				
	Desks.update({last_keepalive: {$lt: away_threshold}}, 
				{$set: {status: AWAY}}, 
				{multi: true});


}, 5*1000);


