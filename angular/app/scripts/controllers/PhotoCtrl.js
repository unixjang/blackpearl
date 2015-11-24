/**
 * Created by hyochan on 9/7/15.
 */
'use strict';

app
    .controller('PhotoCtrl', function($scope, $location, HttpServ){

        // ==> START : navBar active Class 부여하기
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기
    });