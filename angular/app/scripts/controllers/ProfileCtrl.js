/**
 * Created by hyochan on 8/29/15.
 */

'use strict';

app
    .controller('ProfileCtrl', function($scope, $rootScope, $location, HttpServ){
        /**  START : navBar active Class 부여하기  **/
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기

        $scope.getProfile = function(){
            var $promise = HttpServ.getProfile();
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resultCode){
                    case HttpServ.resCODE.SUCCESS:
                        var user = data.user;
                        user.img = HttpServ.apiURL + user.img + '?' + new Date().getTime();
                        $scope.user = user;
                        break;
                }
            });
        };
        $scope.getProfile();

        $scope.alertProfile = {};
        $scope.updateProfile = function(){
            var formData = new FormData(document.querySelector('form#update_profile'));
            var $promise = HttpServ.updateProfile(formData);
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resultCode){
                    case HttpServ.resCODE.SUCCESS:
                        var user = data.user;
                        /*$('div#user img').attr('src', apiURL+user.img + '?' + new Date().getTime());*/
                        $('#file-3').fileinput('reset');
                        $scope.user.img = HttpServ.apiURL + user.img + '?' + new Date().getTime();
                        if($rootScope.userId === $rootScope.visitId){
                            $rootScope.visitImg = HttpServ.apiURL + user.img + '?' + new Date().getTime();
                        }
                        $scope.alertProfile.flag = 'success';
                        $scope.alertProfile.text = '프로필이 수정되었습니다.';
                        break;
                    default :
                        $scope.alertProfile.flag = 'danger';
                        $scope.alertProfile.text = '프로필이 수정시 문제가 발생했습니다. 다시 시도해주세요.';
                        break;
                }
            });
        };
        $scope.updatePassword = function(pw){
            var $promise = HttpServ.updatePassword(pw);
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resultCode){
                    case HttpServ.resCODE.SUCCESS:
                        $scope.alertProfile.flag = 'success';
                        $scope.alertProfile.text = '암호가 변경되었습니다.';
                        break;
                    default :
                        $scope.alertProfile.flag = 'danger';
                        $scope.alertProfile.text = '암호가 올바르지 않습니다.';
                        break;
                }
            });
        };
    });
