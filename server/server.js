Meteor.publish('desks', function () {
    return Desks.find();
});

Meteor.publish('slides', function () {
    return Slides.find();
});

Meteor.publish('liveSlides', function () {
    return LiveSlides.find();
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


