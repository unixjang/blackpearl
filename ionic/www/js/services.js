/**
 * Created by hyochan on 9/26/15.
 */

'use strict';

// var app = angular.module('starter.services', []);

app
    .factory('LoginServ', function($http, $location, SessionServ){
        return {
            login:function(user, scope){
                // console.log('enter function service');
                var $promise=$http.post(API_URL + "/login", user); //send data to localhost:3000/login
                $promise.then(function(msg){
                    var data = msg.data;
                    if(data.resultCode === 1){
                        scope.msgtxt="login success";
                        SessionServ.set('user', data.id);
                        $location.path('/');
                    }
                    else{
                        scope.msgtxt="login failed";
                        $location.path('/login');
                    }
                });
            },
            logout:function(){
                var $promise=$http.get(API_URL + "/login/logout");
                $promise.then(function(msg){
                    var data = msg.data;
                    if(data.resultCode ===1){
                        SessionServ.destroy('user');
                        $location.path('/login');
                    }
                });
            },
            isLogged:function(){
                var $checkSessionServer=
                    $http.get(API_URL + "/login/check");
                return $checkSessionServer;
                /*
                 if(SessionServ.get('user')) return true;
                 else return false;
                 */
            }
        };
    });

app
    .factory('SessionServ', function(){
        return{
            set:function(key, value){
                return sessionStorage.setItem(key,value);
            },
            get:function(key){
                return sessionStorage.getItem(key);
            },
            destroy:function(key){
                return sessionStorage.removeItem(key);
            }
        };
    });