Template.desks_side_desks.desks = function() {
	return Desks.find({status: {$gt: AWAY}});
};
Template.desks_side_quizzes.desks = function() {
	return Desks.find({status: {$gt: AWAY}});
};
Template.desks_side_groups.desks = function() {
	return Desks.find({status: {$gt: AWAY}});
};

Template.triangle_cube.preserve({
	'.content_cube': function(node) {
		return true;
	}
});

Template.desks_side_desks.rendered = function() {
	setupDesksDesks();
};
Template.desks_side_quizzes.rendered = function() {
	setupDesksQuizzes();
};
Template.desks_side_groups.rendered = function() {
	setupDesksGroups();
};

Template.user_desk.status_class = function() {
	return this.status == IDLE ? 'orange' : (this.status == SOLOED ? 'red' : 'green'); 
}



var desk_triangle_is_rendered = false;
Template.desk_triangle.rendered = function() {	
	if(!desk_triangle_is_rendered) {
		//rotate and push out sides for horizontally rotating cube
		var thirdWidth = (172/3.33);
		$('#triangle_cube .content_cube .front')[0].style[transform] = 'rotateY(0deg) translateZ('+thirdWidth+'px)';
		$('#triangle_cube .content_cube .left')[0].style[transform] = 'rotateY(120deg) translateZ('+thirdWidth+'px)';
		$('#triangle_cube .content_cube .right')[0].style[transform] = 'rotateY(-120deg) translateZ('+thirdWidth+'px)';

		$('#triangle_cube .content_cube')[0].style[transform] = 'translateZ(-'+thirdWidth+'px) rotateY(0deg)';
		desk_triangle_is_rendered = true;
	}
	console.log('desk_triangle rendered');
};

var action_button_is_rendered = false;
Template.action_button.rendered = function() {
	if(!action_button_is_rendered) {
		//rotate and push out sides for horizontally rotating cube
		var halfHeight = (62/2)+'px';
		$('.action_button_container .content_cube .front')[0].style[transform] = 'rotateX(0deg) translateZ('+halfHeight+')';
		$('.action_button_container .content_cube .top')[0].style[transform] = 'rotateX(90deg) translateZ('+halfHeight+')';
		$('.action_button_container .content_cube .back')[0].style[transform] = 'rotateX(-180deg) translateZ('+halfHeight+')';
		$('.action_button_container .content_cube .bottom')[0].style[transform] = 'rotateX(-90deg) translateZ('+halfHeight+')';

		$('.action_button').each(function() {
			$(this).text($(this).attr('up'));
		});
		action_button_is_rendered = true;
	}
	console.log('action_button rendered');
};

Template.user_desk.rendered = function() {
	
};

Template.user_desk.active = function() {
	return Session.equals('current_desk_id', this._id) ? 'active' : '';
}

Template.user_desk.events({
	'click .desk': function(e) {
		Session.set('cube_flip_direction', 'down');
		Session.set('side', 'loading');
		
		Rooms.update(Session.get('current_room_id'), {$set: {current_desk_id: this._id}});
		
		setTimeout(function() {
			Session.set('side', 'graph_paper');
		}.bind(this), 1200);
		
		console.log('CURRENT_DESK_ID', Session.get('current_desk_id'));
	}
});