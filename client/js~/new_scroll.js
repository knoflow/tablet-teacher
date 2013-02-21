function newScroll(id, options) {
	var defaults = {
	    hScrollbar: false,
	    vScrollbar: false,
	    hScroll: false,
		vScroll: false
	};
	
	for(opt in options) {
		defaults[opt] = options[opt];
	}
	
	return new iScroll(id, defaults);
}


function vScroll(id) {
	return newScroll(id, {vScroll: true});
}

function hScroll(id) {
	return newScroll(id, {hScroll: true});
}

function hvScroll(id) {
	return newScroll(id, {hScroll: true, vScroll: true});
}