DeskTabs = Class.extend({
	init: function() {
		var _this = this;
		_this.oldIndex = 0;
		
		$('.sidebarTab').click(function() {
			$(this).addClass('active').siblings().removeClass('active');
			
			var index = $('.sidebarTab').index(this),
				oldIndex = _this.oldIndex;	
			
			
			_this.changeDeskTriangle(oldIndex, index);
			setTimeout(function() {
				_this.changeControlBox(oldIndex, index);
			}, 500);
			setTimeout(function() {
				_this.changeActionButton(oldIndex, index);
			}, 900);
			
			_this.oldIndex = index;
		});

		$('.desk').bind(END_EV, function() {
	       $(this).removeClass('active');
	    });
	
		$('#controlBox .controlBox').eq(0).hardwareAnimate({translateY: 0}, {translateY: true}, 0, 'easeOutBounce');
		$('#controlBox .controlBox').eq(1).hardwareAnimate({translateY: -200}, {translateY: true}, 0, 'easeOutBounce');
		$('#controlBox .controlBox').eq(2).hardwareAnimate({translateY: -200}, {translateY: true}, 0, 'easeOutBounce');
	},
	changeDeskTriangle: function(oldIndex, index) {
		var degrees;
		if(oldIndex == index) {
			degrees = 0;
		}
		else {
			if(oldIndex == 0 && index == 1) degrees = -120;
			else if(oldIndex == 1 && index == 2) degrees = -120;
			else if(oldIndex == 2 && index == 0) degrees = -120;
			else if(oldIndex == 2 && index == 1) degrees = 120;
			else if(oldIndex == 1 && index == 0) degrees = 120;
			else if(oldIndex == 0 && index == 2) degrees = 120;
		}

		//set translateZ values for cube
		var thirdWidth = -1*(172/3.33);		
		$('#triangle_cube .content_cube').hardwareAnimate({translateZ: thirdWidth, rotateY: degrees}, {}, 1000, 'easeOutBounce');		
	},
	changeControlBox: function(oldIndex, index) {
		if(oldIndex != index) {
			$('#controlBox .controlBox').eq(oldIndex).hardwareAnimate({translateY: 200}, {translateY: true}, 400, 'easeInExpo', undefined, 'controlBoxCue');
			$('#controlBox .controlBox').eq(oldIndex).hardwareAnimate({translateY: -200}, {translateY: true}, 0, 'easeOutExpo', undefined, 'controlBoxCue');
			$('#controlBox .controlBox').eq(index).hardwareAnimate({translateY: 0}, {translateY: true}, 400, 'easeOutBack', undefined, 'controlBoxCue');
		}
	},
	changeActionButton: function(oldIndex, index) {
		var degrees;
		//set degrees for action_button to rotate 2
		switch(index) {
			case 0:
				degrees = 0;
				break;
			case 1:
				degrees = -90;
				break;
			case 2:
				degrees = -180;
				break;
		}
		
		var halfHeight = -1*(62/2);		
		$('.action_button_container .content_cube').hardwareAnimate({translateZ: halfHeight, rotateX: degrees}, {rotateX: true}, 20, 'easeInExpo');		
	}
});



ActionButton = Class.extend({
	init: function() {
		var _this = this;
		$('.action_button').each(function() {
			$(this).bind(START_EV, _this.down);
		});
	},
	up: function() {
		$(this).removeClass('active');
        $('.action_button').unbind(START_EV, actionButton.up);
        $('.action_button').bind(START_EV, actionButton.down);

		var buttonText = $(this).attr('up');
        $(this).text(buttonText);
	},
	down: function() {
		$(this).addClass('active');
        $('.action_button').unbind(START_EV, actionButton.down);
        $('.action_button').bind(START_EV, actionButton.up);

        var buttonText = $(this).attr('down');
        $(this).text(buttonText);
	}
});


SearchTabs = Class.extend({
	init: function() {
		this.oldIndex = -1;
		this.setupTabClicks();
		this.timeLastClicked = Date.now();
		this.setupSearchField();
	},
	setupSearchField: function() {
		var _this = this;
		$('#searchField input').focus(function() {
			var index = $('.searchTab').index($('.searchTab.active'));
			//this is setup to display the search_start page for the corresponding tab that was selected by .key tabs, which
			//don't by themselves immediately trigger the display of search_start pages
			_this.searchTabs.click(index);
		});
	},
	setupTabClicks: function() {
		that = this;
		$('.searchTab').bind(START_EV, function() {
			that.click($('.searchTab').index(this), true);
		});
	},
	click: function(index) {
		that.newIndex = index;
	
		$('.searchTab').eq(that.newIndex).addClass('active').siblings().removeClass('active');
		$('.key').eq(that.newIndex).addClass('active').siblings().removeClass('active');
		
		that.switchContent(that.oldIndex, that.newIndex); 				
		that.oldIndex = that.newIndex;
	},
	switchContent: function(oldIndex, newIndex) {
		var direction = oldIndex < newIndex ? 'left' : 'right';
		Session.set('cube_flip_direction', direction);
		switch(newIndex) {
			case 0:
				Session.set('side', 'search_start_webpages');
				Session.set('search_type', 'webpages');
				break;
			case 1:
				Session.set('side', 'search_start_images');
				Session.set('search_type', 'images');
				break;
			case 2:
				Session.set('side', 'search_start_videos');
				Session.set('search_type', 'videos');
				break;
			case 3:
				Session.set('side', 'search_start_quizzes');
				Session.set('search_type', 'quizzes');
				break;
		}
		contentKeys.switchContentCarouselCubeSide(newIndex);
	}
});


ContentKeys = Class.extend({
	init: function() {
		this.is_searching = false;
		this.setupKeys();
	},
	setupKeys: function() {
		var _this = this;
		$('.key').click(function() {
			$(this).addClass('active').siblings().removeClass('active');

			var index = $('.key').index(this);
			if(_this.is_searching) {
				searchTabs.click(index)
			}
			else {
				$('.searchTab').eq(index).addClass('active').siblings().removeClass('active');
				_this.switchContentCarouselCubeSide(index);
			}
		});
	},
	switchContentCarouselCubeSide: function(index) {
		var degrees;
		switch(index) {
			case 0:
				degrees = 0;
				Session.set('current_type', 'webpages');
				break;
			case 1: 
				degrees = -90;
				Session.set('current_type', 'images');
				break;
			case 2:
				degrees = -180;
				Session.set('current_type', 'videos');
				break;
			case 3:
				degrees = -270;
				Session.set('current_type', 'quizzes');
				break;
		}
		$('#carousel_cube .content_cube').hardwareAnimate({translateZ: -42, rotateX: degrees}, {rotateX: true}, 600, 'easeOutBack');
	}
});




