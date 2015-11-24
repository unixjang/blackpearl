/**
 * Created by unix.jang on 2015-08-05.
 */
'use strict';

app
    .controller('AboutCtrl', function($scope, $location, HttpServ){

        // ==> START : navBar active Class 부여하기
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기
    });