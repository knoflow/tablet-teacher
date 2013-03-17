var ImageGrid = Class.extend({
	init: function(selector, pageClass) {
		this.selector = selector;
		this.pageClass = pageClass;
		//this.setupDimensions(); 
	},
	render: function() {
		this.setupDimensions();
		this.masonize();
	},
	setupDimensions: function() {
		this.rowHeight = ($(this.selector).parent().height()-5)/3 - 8; //-5 cuz of .imagePage padding; 8px margin bottom between rows
		this.containerWidth = $(this.selector).parent().width() - 16; //10px is the sum of padding left + right for the imagePage
		
		/**
		f20f09-f23e5b
		006cea-32d8ff
		ead700-f3f608
		00ea3d-10fa04
		**/
		this.colors = ['#f20f09', '#006cea', '#ead700', '#00ea3d', '#FF00CC', '#FF6A00'].shuffle();	
	},
	masonize: function() {
		var that = this,
			achievedWidth = 0, 
			achievedHeight = 0,
			currentImagePage = 0,
			row = 1,
			rowClass='row1',
			imagePages = [];
		
		imagePages.push($('<p />', {
			class: that.pageClass
		}).css('width', this.containerWidth)); 
		
		$(this.selector).find('img').each(function(index) {
			var colorToggle = index % 5, width, widthHeightRatio = this.width/this.height;   
					
			$(this).parent().css('box-shadow', '0px 0px 10px -2px '+that.colors[colorToggle]);
			
			width = that.rowHeight*widthHeightRatio;				
			achievedWidth += width;
			
			//prepare next row (here the current image floats on to the next row)
			if(achievedWidth > (that.containerWidth - 10)) { //subtract 10 so we never have images squished in a row with no spacing between em				
				achievedHeight += that.rowHeight;					
				rowClass = 'row'+(++row);
				console.log('new row', row, achievedHeight, achievedWidth);
				achievedWidth = width;
			}

			//if adding the width of the current image will necessitate a 4th row, create a new page
			if(achievedHeight >= 3*that.rowHeight) {	
				imagePages.push($('<p />', {
					class: that.pageClass
				}).css('width', that.containerWidth));
				
				currentImagePage++;
				achievedHeight = 0;
				row = 1;
				rowClass = 'row1';
				console.log('new page');
			}
			
			//set sizes for img and container element (and for videos, some stuff for the info text elements)
			if(that.pageClass != 'videoPage')  {
				$(this).css('width', width);
			}
			else {
				$(this).parent().find('.infoLabel, .videoTitle').css('text-shadow', '1px 1px 5px '+that.colors[colorToggle]);
			}
			
			var $img = $(this).parent().css({width: width, height:that.rowHeight});
			$img.addClass(rowClass);
			imagePages[currentImagePage].append($img);
			
		});
		
		//remove last page of video search cuz it only has 2 items and it looks weird
		if(that.pageClass == 'videoPage') {
			imagePages.pop();
		}
		
		
		//add each imagePage to the scrollable container
		//but first add the appropriate amount of margin left to each image to make them have equal spacing and appear centered
		imagePages.forEach(function(imagePage, k) {
			var $row1 = imagePage.find('.row1'),
				$row2 = imagePage.find('.row2'),
				$row3 = imagePage.find('.row3'),
				row1Width=0, row2Width=0, row3Width=0;
					
			//determine the sum of the widths of all images (well, the image containers)
			$row1.each(function() {
				row1Width += $(this).outerWidth(true);
			});
			$row2.each(function() {
				row2Width += $(this).outerWidth(true);
			});
			$row3.each(function() {
				row3Width += $(this).outerWidth(true);
			});
	
			//determine thea mount of margin to add to each image by finding the extra space by subtracting image width sum from total row width
			//and then dividing that by the # of images in the row minus the first image since it doesnt need any margin-left
			var row1marginLeft = Math.floor((that.containerWidth - row1Width) / ($row1.length - 1)), //guarantee 20px of spacing so
				row2marginLeft = Math.floor((that.containerWidth - row2Width) / ($row2.length - 1)), //images are not too close
				row3marginLeft = Math.floor((that.containerWidth - row3Width) / ($row3.length - 1)); //together
			
			console.log('row1 outer width', row1Width, $row1.length - 1);
			
			//apply the margin-left to all images except the first one in each row
			$row1.each(function(index) {
				if(index > 0) $(this).css('margin-left', row1marginLeft);
			});
			$row2.each(function(index) {
				if(index > 0) $(this).css('margin-left', row2marginLeft);
			});
			$row3.each(function(index) {
				if(index > 0) $(this).css('margin-left', row3marginLeft);
			});
			
			//if a row ever has just 2 images, which looks akward with each far apart, center the second one
			if($row1.length == 2) $($row1[1]).css('margin-left', '30%');
			if($row2.length == 2) $($row2[1]).css('margin-left', '30%');
			if($row3.length == 2) $($row3[1]).css('margin-left', '30%');
			
			$(that.selector).append(imagePage);
		});	
		
		//append a blank page for showing a loading page
		//$(that.selector).append($('<p />', {
		//	class: that.pageClass
		//}).css('width', that.containerWidth));
	}
});