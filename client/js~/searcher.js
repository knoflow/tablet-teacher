Searcher = Class.extend({
	init: function(useSocket) { 
		//if(useSocket) this.socket = io.connect("http://sheltered-sierra-1610.herokuapp.com:80/search");
	},
	performSearch: function(searchType, keywords) {				
		if(this.socket) return this.performSocketSearch(searchType, keywords);
		return this.performAjaxSearch(searchType, keywords);
	},
	performSocketSearch: function(searchType, keywords) {
		var _this = this,
			url = 'http://www.fake-url.com?type='+searchType+'&keywords='+keywords; //server code expects a URL like original ajx version. sorry.

		this.socket.emit("search", url);		
		this.socket.on('search_results_'+searchType+'_'+keywords.replace(' ', '-'), function(searchResultsJson) {
			_this.updatePage(searchType, searchResultsJson);
		});
	},
	performAjaxSearch: function(searchType, keywords) {
		var _this = this;
		$.get('http://sheltered-sierra-1610.herokuapp.com:80/search', {type: searchType, keywords: keywords}, function(searchResultsJson) {
			_this.updatePage(searchType, searchResultsJson);	
		});
	},
	updatePage: function(searchType, searchResultsJson) {
		searchResultsJson = JSON.parse(searchResultsJson);
		console.log(searchResultsJson);
		Session.set('side', 'search_'+searchType);
		Session.set('search_results_'+searchType, searchResultsJson);
	}
});