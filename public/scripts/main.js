function Friend(data) { // constructor for friend object
 var distanceFromNow = function(raw){
if(!raw)return null;

    var now = new Date();

    if(Date.parse(raw)){
        var d = new Date(raw);
        d.setYear(now.getFullYear())
        return d - now;
    }
    return new Date(raw + '/' + now.getFullYear()) - now;
 }


    var self = this;
    self.selected = ko.observable(false);
    self.imageUrl = "http://graph.facebook.com/" + data.id + "/picture?type=square&height=100&width=100";
    self.id = data.id;
    self.name = data.name;
    self.likes = ko.observableArray();
    self.birthdayDistance = distanceFromNow(data.birthday);
    self.birthdayDistanceInDays = Math.floor(new Date(self.birthdayDistance).getTime() /1000/60/60 / 24)
    self.birthday = data.birthday;
    self.getLikes = function () {
        if (self.likes.length) return;

        FB.api('/' + self.id + '/likes', function (r) {
            self.parseLikes(r)
        });
    };

    self.parseLikes = function (r, cb) {
        cb = cb || function () { };

        for (var i = 0; i < r.data.length; i++) {
            self.likes.push(new Like(r.data[i]));
        }

        // recursion :O
        if (r.paging && r.paging.next) {
            FB.api(r.paging.next, function (response) {
                self.parseLikes(response, cb);
            });
        } else {
            cb();
        }
    };

    self.getLikes();

    return self;
}

function Like(data) {
    var self = this;

    var tmSearchUrl = 'https://api.trademe.co.nz/v1/Search/General.json?search_string=';
    self.selected = ko.observable(false);
    self.name = data.name;
    self.imageUrl = 'url("http://graph.facebook.com/' + data.id + '/picture?type=normal")';
    self.listings = ko.observableArray([]);
    self.getListings = function () {
        $.get(tmSearchUrl + self.name)
        .done(function (data) {
            data.List.forEach(function (d) {
                self.listings.push(new Listing(d));
            });
        });
    };

    return self;
}


function BSViewModel(){
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

    self.upcomingBirthdayFriends = ko.computed(function(){
        return self.friends().filter(function(f){
            return f.birthdayDistance > 0;
        }).sort(function(f1, f2){
            return f1.birthdayDistanceInDays - f2.birthdayDistanceInDays;
        });
    })

    return self;
}

var vm = new BSViewModel();
$(function(){
    vm.initialised.subscribe(function(newValue){
        if(newValue) {
                FB.api('/me/friends?fields=birthday,name', function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        vm.friends.push(new Friend(response.data[i]));
                    }
            });
        }
    })

    ko.applyBindings(vm);

    $('#login').click(function(e){
        FB.login(function (response) {
                if (response.status != 'connected')
                    alert('derp');
                else {
                    vm.initialised(true);
                }
          });
    });
});
