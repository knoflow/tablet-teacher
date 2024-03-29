function getPageX(e) {
	if(e.originalEvent) e = e.originalEvent;
    if(hasTouch) return e.changedTouches[0].pageX;
    else return e.pageX;
}

function getPageY(e) {
	if(e.originalEvent) e = e.originalEvent;
    if(hasTouch) return e.changedTouches[0].pageY;
    else return e.pageY;
}

var acceleration = function(t, b, c, d) {
	return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
};


/** NEW ANIMATION UTILITIES **/

$.globalAnimationCue = {};
jQuery.fn.hardwareAnimate = function(endProperties, dontAdd, duration, easing, callback, cueName) {
	var element = this[0],
		dontAdd = dontAdd || {},
		duration = duration == undefined ? 1000 : duration,
		easing = easing || 'easeOutExpo',
		callback = callback || function() {
			console.log('animation complete');
		};
	
	if(cueName) {
		$.globalAnimationCue[cueName] = $.globalAnimationCue[cueName] || [];
		var cue = $.globalAnimationCue[cueName];
	}
	else {
		element.cuedAnimations = element.cuedAnimations || [];
		var cue = element.cuedAnimations;
	}
	
	element.startProperties = element.startProperties || {
			translateX: 0,
			translateY: 0,
			translateZ: 0,
			scaleX: 0,
			scaleY: 0,
			scaleZ: 0,
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0
	};
	
	endProperties.translateZ = endProperties.translateZ || 0;
	
	var transformString = function(percentComplete, isComplete) {
		var transform='';
		
		transform = 'translateZ('+endProperties.translateZ+'px)';
		for(prop in endProperties) {
			 if(prop != 'translateZ') {
				
				if(dontAdd[prop] == true) {
					var change = endProperties[prop] - element.startProperties[prop];
					var value = element.startProperties[prop] + (percentComplete*change);
				}
				else {
					var value = element.startProperties[prop] + (percentComplete*endProperties[prop]);
				}
				
				transform += prop+'('+value;
				
				if(prop.indexOf('rotate')===0) transform +='deg';
				if(prop.indexOf('translate')===0) transform +='px';
				transform += ')';
				
				if(isComplete) element.startProperties[prop] = value;
			}
		}

		return transform;
	}
	
	var beginAnimation = function() {
		var startAnimationTime = Date.now();
		var performAnimation = function() {

			var time = Date.now() - startAnimationTime,
				percentComplete = jQuery.easing[easing](time, time, 0, 1, duration);

			if(time < duration) {			
			 	element.style[transform] = transformString(percentComplete);		
				nextFrame(performAnimation);
			}
			else {			
				element.style[transform] = transformString(1, true);	
				callback.call(element);

				cue.shift();
			 	if(cue.length > 0) cue[0].call();
			}
		}
		performAnimation();
	};
	
	cue.push(beginAnimation);
	if(cue.length == 1) cue[0].call();
	
	return this;
}

jQuery.fn.hardwareCss = function(translateScaleRotate) {
	this[0].style[transform] = translateScaleRotate;
	return this;
}