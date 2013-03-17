ScreenCropper = Class.extend({
	init: function() {
		this.socket = io.connect("http://sheltered-sierra-1610.herokuapp.com:80/request");
	},
	preloadUrlAndHeight: function(url, callback) {
		this.url = url;
		var urlKey = this.createUrlKey(url);
		this.socket.emit('preload', url, urlKey);
		this.socket.on('urlKey_'+urlKey, callback)
	},
	crop: function(callback) {		
		this.socket.emit("render", this.url, this.createImageName(), this.phantomPageConfig);		

		this.socket.on('image_ready_'+this.imageName, function(imageName) {
			console.log('screenshot url: http://knoflow.s3.amazonaws.com/large/'+imageName);
			if(callback) callback('http://knoflow.s3.amazonaws.com/large/'+imageName, imageName);
		});
	},
	url: 'http://www.crimetv.com',
	imageName: '',
	phantomPageConfig: {
		settings: {userAgent: navigator.userAgent},
		viewportSize: {
			width: 1024,
			height: 600
		},
		clipRect: {
			left: 200,
			top: 0, 
			width: 600, 
			height: 600
		},
		scrollPosition: { 
			top: 0,
			left: 0
		}
	},
	setPhantomPageConfig: function(jCropCoords) {
		this.url = $('.siteIframe').attr('src');
		
		this.phantomPageConfig.clipRect.left = Math.round(jCropCoords.x) - parseInt($('.siteIframe').css('margin-left')); //margin-left from centered images
		this.phantomPageConfig.clipRect.top = Math.round(jCropCoords.y) + -1*($('.iframeInner').offset().top - 46); //scroll included
		this.phantomPageConfig.clipRect.width = Math.round(jCropCoords.w);
		this.phantomPageConfig.clipRect.height = Math.round(jCropCoords.h);
		
		this.phantomPageConfig.viewportSize.width = Math.round($('#contentContainer').width());
		this.phantomPageConfig.viewportSize.height = Math.round($('#contentContainer').height());
		
		this.createImageName();
	},
	createUrlKey: function(url) {
		var url = url || this.url
			parts = url.replace('http://', '').replace('https://', '').split('/'),
			host = parts.shift(),
			path = parts || [''],
			imageName = host.split('.').reverse().join('_')+'-'+path.join('-').replace('.', '_');			
		
		if(imageName.substr(-1) == '-' || imageName.substr(-1) == '_') imageName = imageName.substr(0, imageName.length - 1);
		
		imageName = imageName.replace(/\(|\)|:|\?|\+|=|~|\./g, '_');
	    
		return imageName;
	},
	createImageName: function() {
		var imageName = this.createUrlKey(),
			config = this.phantomPageConfig;
				
		imageName += '-' + config.clipRect.top + '-' + config.clipRect.left + '-' + config.clipRect.width + '-' + config.clipRect.height + '-';
		imageName += config.viewportSize.width + '-' + config.viewportSize.height + '-'; 
		imageName += config.scrollPosition.top + '-' + config.scrollPosition.left;
		
		imageName = imageName.replace(/\(|\)|:|\?|\+|=|~|\./g, '_');
		
		imageName += '.png';

		return this.imageName = imageName;
	},
	imageNameNOpng: function() {
		return this.imageName.replace('.png', '');
	}
});