Template.slide.rendered = function() {
	new Slideable(this.data);
	if(carousels[slideTypeIndex()]) carousels[slideTypeIndex()].refresh();
};

Template.slide.events({
	'dblclick': function() {
		Slides.remove(this._id);
	}
});


Template.slide.adjusted_width = function() {
	return this.width/this.height*75;
};
Template.slide.iframe_left = function() {
	return this.left * 75/this.height;
};
Template.slide.iframe_top = function() {
	return this.top * 75/this.height;
};
Template.slide.iframe_width = function() {
	return this.viewport_width*1/this.heightRatio;
};
Template.slide.iframe_height = function() {
	return (this.viewport_height + this.top)*1/this.heightRatio;
};
Template.slide.scale = function() {
	return 75/this.height;
}
Template.slide.scale_transform = function() {
	return prefixCSSstyle('transform', 'scale('+75/this.height*this.heightRatio+')') + ' ' + prefixCSSstyle('transform-origin', '0 0');
};