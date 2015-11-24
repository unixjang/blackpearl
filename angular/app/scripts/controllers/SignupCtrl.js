'use strict';

app
	.controller('SignupCtrl', function($scope, $rootScope, $location, SessionServ, HttpServ){
		$scope.msgtxt='';
        $scope.isSuccess = false;
        $scope.isAlert = false;
        $scope.isAlphaNumeric = function(){
			var regex=/^[0-9A-Za-z]+$/; //^[a-zA-z]+$/
			$scope.signupForm.id.$error.isAlphaNumeric = !regex.test($scope.user.id);
		};
		$scope.hasSpecialChar = function(){
			// alphanumeric + one or more special characters
			var regex=/[~!@\#$%<>^&*\()\-=+_\’]/gi;
			$scope.signupForm.pw.$error.hasSpecialChar = !regex.test($scope.user.pw);
			$scope.msgtxt= $scope.signup.pw.$error.hasSpecialChar;
		};
		// check if pw and pwOk match
		$scope.checkPwMatch = function () {
		    $scope.signupForm.pwOk.$error.dontMatch = $scope.user.pw !== $scope.user.pwOk;
		};
		// user : id, pw, pwOk, name, phone, email
		$scope.signup=function(){
            console.log('signupCtrl : $scope.signup()');
            var signupForm = document.querySelector('form#signupForm');
            var formData = new FormData(signupForm);
			var $promise = HttpServ.signup($scope, formData); // call signup service
            $promise.then(function(msg){
                var data = msg.data;
                if(data.resultCode === HttpServ.resCODE.SUCCESS){
                    SessionServ.set('user', data.id);
                    $scope.isSuccess = true;
                    $scope.isAlert = true;
                    $scope.signupAlert=
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        ' 회원가입이 완료되었습니다.';
                    $rootScope.changeVisitPage(data.id);
                    $location.path('/');
                }
                else if(data.resultCode === HttpServ.resCODE.ALREADY_INSERTED){
                    $scope.isAlert = true;
                    $scope.signupAlert=
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        ' 중복된 아이디입니다. 다른 아이디로 시도해주세요.';
                }
                else if(data.resultCode === HttpServ.resCODE.NO_REQ_PARAM){
                    $scope.isAlert = true;
                    $scope.signupAlert=
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        ' 회원정보를 모두 입력해주세요.';
                }
            });
		};
	});