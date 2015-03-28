define(['jquery', 'knockout', 'viewmodel', 'friend'],
function   ($, ko, viewmodel, Friend) {

    var vm = new viewmodel();

    
window.fbAsyncInit = function () {
              FB.init({
                  appId: '338878622923960', // App ID
                  status: true, // check login status
                  cookie: true, // enable cookies to allow the server to access the session
                  oauth: true,
                  xfbml: true  // parse XFBML
              });

              FB.getLoginStatus(function (response) {
                if(response.status == 'connected'){
                  vm.initialised(true);
                }else{
                  $("#login").show();
                }
              }, { scope: 'publish_stream,user_photos' });

            };

            (function (d) {
                var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement('script'); js.id = id; js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                ref.parentNode.insertBefore(js, ref);
            } (document));

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