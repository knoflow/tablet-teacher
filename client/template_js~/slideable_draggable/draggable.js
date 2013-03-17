Template.draggable.rendered = function() {
	console.log("DRAGGABLE RENDERED", this.data.owner_desk_id, this.data.old, this.data.addedToDesk, this.data);
	new Draggable(this.data);
};

Template.draggable.events({
	'dblclick': function() {
		LiveSlides.remove(this._id);
	}
});


Template.draggable.adjusted_width = function() {
	return this.viewport_width * 1/this.heightRatio;
};
Template.draggable.adjusted_height = function() {
	return this.viewport_height * 1/this.heightRatio;
};
Template.draggable.scale_transform = function() {
	return prefixCSSstyle('transform', 'scale('+this.heightRatio+')') + ' ' + prefixCSSstyle('transform-origin', '0 0');
};