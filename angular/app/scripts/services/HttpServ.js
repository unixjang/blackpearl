/**
 * Created by hyochan on 9/28/15.
 */
'use strict';

var apiURL = "http://localhost:52273";
// var apiURL = 'http://hyochan.org:52273';
var resCODE = {
    NO_REQ_PARAM : -4,
    ERR_PARAM : -3, // 정수형이어야 되는데 문자가 들어오는 경우
    ALREADY_INSERTED : -2,
    FAILED : -1,
    NO_DATA : 0,
    SUCCESS : 1
};

app
    .factory('HttpServ', function($http){
        return{
            apiURL : apiURL,
            resCODE : resCODE,
            login:function(user){
                console.log('HttpServ.login');
                return $http.post(apiURL + '/api/login', user);
            },
            logout:function(){
                console.log('HttpServ.logout');
                return $http.get(apiURL + '/api/login/logout');
            },
            isLogged:function(){
                console.log('HttpServ.isLogged');
                return $http.get(apiURL + '/api/login/check');
                /*
                 if(SessionServ.get('user')) return true;
                 else return false;
                 */
            },
            signup:function($scope, formData){
                console.log('HttpServ.signup');
                // var $promise=$http.post(httpServer + "/signup", user);
                return $http({
                    method : 'POST',
                    url : apiURL + '/api/signup',
                    data : formData,
                    responseType : 'json',
                    transformRequest : angular.identity,  // multipart
                    headers : {'Content-Type': undefined} // multipart
                });
            },
            getProfile:function(){
                console.log('HttpServ.getProfile');
                return $http({
                    method : 'GET',
                    url : apiURL + '/api/profile/select',
                    responseType : 'json',
                    withCredentials : true
                });
            },
            getVisitProfile:function(visit){
                console.log('HttpServ.getVisitProfile : ' + visit);
                return $http.get(apiURL + '/api/profile/select/' + visit); //send data to localhost:3000/login
                /*
                 $promise.then(function(msg){
                 var data = msg.data;
                 var user = data.user;
                 $scope.userGreetingHTML = peer + "님의 페이지를 방문하셨습니다.";
                 $scope.user = user;
                 $scope.user = HttpServ.apiURL + user.img + "?" + new Date().getTime();
                 });*/
            },
            updateProfile : function(formData){
                return $http({
                    method: 'POST',
                    url: apiURL + '/api/profile/update',
                    data: formData,
                    responseType : 'json',
                    transformRequest : angular.identity,
                    headers : {'Content-Type': undefined},
                    withCredentials : true
                });
            },
            updatePassword : function(pw){
                return $http({
                    method : 'POST',
                    url : apiURL + '/api/password/update',
                    data : pw,
                    responseType : 'json',
                    withCredentials : true
                });
            },
            getMembers : function(){
                return $http({
                    method : 'GET',
                    url : apiURL + '/api/member/all',
                    responseType : 'json',
                    withCredentials : true
                });
            },
            getMember : function(member){ // get member profile with bookmark
                return $http({
                    method : 'GET',
                    url : apiURL + '/api/member/one/' + member,
                    responseType : 'json',
                    withCredentials : true
                });
            },
            addBookmark : function(userId){
                return $http({
                    type : 'GET',
                    url : apiURL + '/api/bookmark/add/' + userId,
                    responseType : 'json',
                    withCredentials : true
                });
            },
            removeBookmark : function(userId){
                return $http({
                    type : 'GET',
                    url : apiURL + '/api/bookmark/remove/' + userId,
                    responseType : 'json',
                    withCredentials : true
                });
            },
            getBookmarks : function(){
                return $http({
                    type : 'GET',
                    url : apiURL + '/api/bookmark/my',
                    responseType : 'json',
                    withCredentials: true
                });
            }
        };
    });