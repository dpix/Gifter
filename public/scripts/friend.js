define(['knockout'], function(ko){
function Friend(data) { // constructor for friend object
    var self = this;
    self.selected = ko.observable(false);
    self.imageUrl = "http://graph.facebook.com/" + data.id + "/picture?type=square&height=100&width=100";
    self.id = data.id;
    self.name = data.name;
    self.likes = ko.observableArray();
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
});