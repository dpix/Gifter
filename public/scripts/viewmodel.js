define(['knockout'], function(ko){

	return function (){
	var self = this;
	self.initialised= ko.observable(false);
	self.searchString= ko.observable('');
	self.friends= ko.observableArray([]);

	self.filteredFriends = ko.computed(function(){
		if(self.searchString().trim() != ""){
			return self.friends().filter(function(f){
				return f.name.toLowerCase().indexOf(self.searchString().toLowerCase()) != -1;
			})
		}
		else
			return self.friends();
	});

	return self;
	}
})