'use strict';

app
	.controller('LoginCtrl', function($location, $rootScope, $scope, HttpServ, SessionServ){
        $scope.isSuccess = false;
        $scope.isAlert = false;
        $scope.alertClass = function(name){
            var className = 'hidden';
            if (name === 'default') {
                className = 'hidden';
            } else if (name === 'success') {
                className = 'alert alert-success';
            } else if (name === 'failed') {
                className = 'alert alert-danger';
            }  else if (name === 'no_req_param') {
                className = 'alert alert-warning';
            }
            return className;
        };
		// user : id, pw
		$scope.login=function(user){
			var $promise = HttpServ.login(user); // call login service
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resultCode){
                    case HttpServ.resCODE.SUCCESS:
                        $scope.isSuccess = true;
                        $scope.isAlert = true;
                        $scope.loginAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                            ' 로그인 성공.';
                        SessionServ.set('user', data.id);
                        $rootScope.changeVisitPage(data.id);
                        console.log('rootScope.userId : ' + $rootScope.userId);
                        break;
                    case HttpServ.resCODE.FAILED:
                    case HttpServ.resCODE.NO_REQ_PARAM:
                        $scope.isSuccess = false;
                        $scope.isAlert = true;
                        $scope.txtLogin = (data.resultCode === HttpServ.resCODE.FAILED ? '아이디 또는 비밀번호 오류입니다. 다시 시도해주세요.' : '아이디와 비밀번호를 입력해주세요.');
                        console.log($scope.txtLogin);
                        $scope.loginAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                            $scope.txtLogin;
                        $location.path('/login');
                        break;
                }
            });
		};
		$scope.modal = {
			'title': 'Black Pearl 이용 안내',
			'content': 'Black Pearl 서비스를 이용하기 위해서는 계정이 필요합니다. 계정이 없으시면 회원가입을 해주세요.'
		};
	});