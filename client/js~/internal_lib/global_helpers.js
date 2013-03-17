contentTypes = ['webpages', 'images', 'videos', 'quizzes'];

function current_content_type_index() {
	return $('.key').index($('.key.active')); //0 = webpages, 1 = images, etc
}

function current_content_type() {
	return contentTypes[$('.key').index($('.key.active'))]; //returns: 'webpages', 'images', etc
}

function slideTypeIndex() {
	return current_content_type_index();
}

function slideType() {
	return current_content_type();
}


function getUTCtime() {
	var d = new Date();
	return d.getTime() + d.getTimezoneOffset()*60*1000;
}
