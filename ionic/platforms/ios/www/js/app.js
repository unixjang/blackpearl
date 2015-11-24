// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });
})
.run(function($rootScope, $location, LoginServ, SessionServ){
    var routespermission=['/signup']; //route that doesn't require login
    $rootScope.$on('$routeChangeStart', function(){
        if(routespermission.indexOf($location.path()) === -1){
            var connected = LoginServ.isLogged();
            connected
                .then(function(msg){
                    var data = msg.data;
                    if(data.resultCode === -1){
                        $location.path('/login');
                    }else{
                        if(SessionServ.get('user') === undefined){
                            SessionServ.set('user', data.id);
                        }
                        $location.path('/');
                    }
                })
                .catch(function(){
                    $location.path('/login');
                });
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // 탭은 항상 아래에 보여지게 만든다.
    $ionicConfigProvider.tabs.position('top');
    // 네비게이션바에서 타이틀은 중앙 정렬로 만든다.
    $ionicConfigProvider.navBar.alignTitle('center');

    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.search', {
            url: '/search',
            views: {
              'menuContent': {
                templateUrl: 'templates/search.html'
              }
            }
        })
        .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                  templateUrl: 'templates/browse.html'
                }
            }
        })
        .state('app.playlists', {
            url: '/playlists',
                views: {
                    'menuContent': {
                    templateUrl: 'templates/playlists.html',
                    controller: 'PlaylistsCtrl'
                    }
                }
        })

        .state('app.single', {
            url: '/playlists/:playlistId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlist.html',
                    controller: 'PlaylistCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/playlists');
});
