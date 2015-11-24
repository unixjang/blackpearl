'use strict';

/**
 * @ngdoc overview
 * @name blackpearlAngularApp
 * @description
 * # blackpearlAngularApp
 *
 * Main module of the application.
 */

var app = angular.module('blackpearlApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'ui.checkbox',
        'angularUtils.directives.dirPagination',
        'angularModalService'
    ]);

app
    .controller('IndexCtrl', function ($scope, $rootScope, $location, $route, HttpServ, SessionServ) {

        // ==> START : navBar Active class 부여하기
        $scope.$route = $route;
        // <== END : navBar Active class 부여하기

        $rootScope.changeVisitPage = function(memberId){
            if(!memberId){
                $rootScope.userId = SessionServ.get('user');
                $rootScope.visitId = $rootScope.userId;
            }else{
                $rootScope.userId = SessionServ.get('user');
                $rootScope.visitId = memberId;
            }
            var $promise = HttpServ.getVisitProfile($rootScope.visitId);
            $promise.then(function(msg){
                var data = msg.data;
                var user = data.user;
                var greetingText = '';
                if(data.resultCode === HttpServ.resCODE.SUCCESS){
                    if($rootScope.userId === $rootScope.visitId) {
                        greetingText = '안녕하세요. ' + user.id + '님';
                    }
                    else {
                        greetingText = user.id + '님의 페이지입니다.';
                    }

                    $rootScope.visitGreetingText = greetingText;
                    $rootScope.visitId = user.id;
                    $rootScope.visitName = user.name;
                    $rootScope.visitPhone = user.phone;
                    $rootScope.visitEmail = user.email;
                    $rootScope.visitImg = HttpServ.apiURL + user.img + '?' + new Date().getTime();
                    $location.path('/');
                }
            });
        };

        /**  START : check login  **/
        if(!SessionServ.get('user')){
            var $promise = HttpServ.isLogged();
            $promise
                .then(function(msg){
                    var data = msg.data;
                    if(data.resultCode === -1){
                        $location.path('/login');
                    }else{
                        if(!SessionServ.get('user')){
                            SessionServ.set('user', data.id);
                            $rootScope.changeVisitPage('');
                        }
                    }
                })
                .catch(function(){
                    $location.path('/login');
                });
        }else{
            $rootScope.changeVisitPage('');
        }
        /**  END : check login  **/

        $scope.logout=function(){
            var $promise = HttpServ.logout();
            $promise.then(function(msg){
                var data = msg.data;
                if(data.resultCode === HttpServ.resCODE.SUCCESS){
                    SessionServ.destroy('user');
                    delete $rootScope.userId;
                    delete $rootScope.visitId;
                    $location.path('/login');
                }
            });
        };
    });

app
  .config(function ($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
          })
        .when('/signup', {
          templateUrl: 'views/signup.html',
          controller: 'SignupCtrl'
        })
        .when('/', { // home
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          activeTab: 'home'
        })
        .when('/chat', { // chat
          templateUrl: 'views/chat.html',
          controller: 'ChatCtrl',
          activeTab: 'chat'
        })
        .when('/member', { // member
          templateUrl: 'views/member.html',
          controller: 'MemberCtrl',
          activeTab: 'member'
        })
        .when('/board', { // board
          templateUrl: 'views/board.html',
          controller: 'BoardCtrl',
          activeTab: 'board'
        })
        .when('/photo', { // photo
          templateUrl: 'views/photo.html',
          controller: 'PhotoCtrl',
          activeTab: 'photo'
        })
        .when('/profile', { // profile
          templateUrl: 'views/profile.html',
          controller: 'ProfileCtrl',
          activeTab: 'profile'
        })
        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          activeTab: 'about'
        })
        .otherwise({
            redirectTo: '/',
            activeTab: 'home'
        });
  })
  .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ]);

app
    .run(function($rootScope, $location, HttpServ, SessionServ){
        var routespermission=['/signup']; //route that doesn't require login
            $rootScope.$on('$routeChangeStart', function(){
                if(routespermission.indexOf($location.path()) === -1){
                    var $promise = HttpServ.isLogged();
                    $promise
                        .then(function(msg){
                            var data = msg.data;
                            if(data.resultCode === -1){
                                delete $rootScope.userId;
                                delete $rootScope.visitId;
                                $location.path('/login');
                            }else{
                                if(!SessionServ.get('user')){
                                    SessionServ.set('user', data.id);
                                }
                            }
                        })
                        .catch(function(){
                            $location.path('/login');
                        });
                }
            });
    });

/*
    var routespermission=['/']; //route that require login
    $rootScope.$on('$routeChangeStart', function(){
      if(routespermission.indexOf($location.path()) !== -1){
        var connected = LoginServ.isLogged();
        connected.then(function(msg){
          var data = msg.data;
          if(data.resultCode === -1){ 
            $location.path('/login');
          }else{
            if(SessionServ.get('user') === undefined){
              SessionServ.set('user', data.id);
            }
          }
        });
      }
    });
    */