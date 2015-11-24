/**
 * Created by hyochan on 8/29/15.
 */

'use strict';

app
    .controller('MemberCtrl', function($scope, $rootScope, $location, ModalService, HttpServ){

        // ==> START : navBar active Class 부여하기
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기

        /*************  START ==> 북마크 맴버 nav-tab 제어  *************/
        $scope.selectedTab = 'bookmarks';
        $scope.selectTab = function(select){
            $scope.selectedTab = select;
        };
        //////////////  END ==> 북마크 맴버 nav-tab 제어  //////////////

        /*************  START ==> 맴버 && 북마크 불러오기  *************/
        $scope.getMembers = function(){
            var $promise = HttpServ.getMembers();
            $promise.then(function(msg){
                var data = msg.data;
                if(data.resultCode === HttpServ.resCODE.SUCCESS){
                    $scope.members = data.users;
                    angular.forEach($scope.members, function(user){
                        user.img = HttpServ.apiURL + user.img + '?' + new Date().getTime();
                    });
                }
            });
        };
        $scope.getBookmarks = function(){
            var $promise = HttpServ.getBookmarks();
            $promise.then(function(msg){
                var data = msg.data;
                if(data.resultCode === HttpServ.resCODE.SUCCESS){
                    $scope.bookmarks = data.bookmarks;
                    angular.forEach($scope.bookmarks, function(user){
                        user.img = HttpServ.apiURL + user.img + '?' + new Date().getTime();
                    });
                }else if(data.resultCode === HttpServ.resCODE.NO_DATA){
                    delete $scope.bookmarks;
                }
            });
        };
        $scope.getMembers();
        $scope.getBookmarks();
        //////////////  END ==> 맴버 && 북마크 불러오기  //////////////

        /*************  START ==> 맴버 && 북마크 검색  *************/
        $scope.memberQuery = {};
        $scope.memberQueryBy = '$';
        $scope.orderProp='name';
        //////////////  END ==> 맴버 검색  //////////////

        /*************  START : MODALS  *************/
        $scope.bookmark = false;
        $scope.selectedMemeber = '';
        $scope.memberModalOn = function(memberId){
            ModalService.showModal({
                templateUrl: 'memberModal.html',
                controller: 'MemberModalCtrl',
                inputs: {
                    memberId : memberId,
                    parentScope : $scope
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    switch (result){
                        /** 1. 맴버 방문 **/
                        case 'visit':
                            $rootScope.changeVisitPage(memberId);
                            break;
                    }
                    // $scope.getBookmarks();
                });
            });
        };
        //////////////  END : MODALS  //////////////
    })

    .controller('MemberModalCtrl', function($scope, parentScope, $rootScope, $element, HttpServ, memberId, close) {
        $scope.close = function(result) {
            $element.modal('hide'); //  모바일에서 모달 없어졌을 때 까만 화면 방지 ==> Manually hide the modal using bootstrap.
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

        console.log('memberModalOn : ' + memberId);
        var $promise = HttpServ.getMember(memberId);
        $promise.then(function(msg) {
            var data = msg.data;
            if (data.resultCode === HttpServ.resCODE.SUCCESS) {
                $scope.bookmarkAlert.flag = '';
                data.user.img = HttpServ.apiURL + data.user.img;
                $scope.selectedMember = data.user;
                $scope.bookmark = data.bookmark;
            }
        });

        /*************  START ==> 2. 북마크 3. 북마크 해제  *************/
        /** 2.북마크 **/
        $scope.bookmarkAlert = {};
        $scope.addBookmark = function(memberId){
            var $promise = HttpServ.addBookmark(memberId);
            $promise.then(function(msg) {
                var data = msg.data;
                switch (data.resultCode){
                    case HttpServ.resCODE.ALREADY_INSERTED:
                    case HttpServ.resCODE.SUCCESS:
                        $scope.bookmark = true;
                        $scope.bookmarkAlert.flag = 'success';
                        $scope.bookmarkAlert.text = '다음 회원이 북마크에 추가되었습니다.';
                        parentScope.getBookmarks();
                        break;
                    case HttpServ.resCODE.FAILED:
                        $scope.bookmarkAlert.flag = 'danger';
                        $scope.bookmarkAlert.text = '로그인이 되지 않았습니다. 로그인 후 시도해주세요.';
                        break;
                }
            });
        };
        /** 3. 북마크 해제 **/
        $scope.removeBookmark = function(memberId){
            var $promise = HttpServ.removeBookmark(memberId);
            $promise.then(function(msg) {
                var data = msg.data;
                switch (data.resultCode){
                    case HttpServ.resCODE.SUCCESS:
                        $scope.bookmark = false;
                        $scope.bookmarkAlert.flag = 'warning';
                        $scope.bookmarkAlert.text = '다음 회원이 북마크에서 제외되었습니다.';
                        parentScope.getBookmarks();
                        break;
                    case HttpServ.resCODE.NO_DATA:
                        $scope.bookmarkAlert.flag = 'danger';
                        $scope.bookmarkAlert.text = '북마크에서 제외할 회원이 없습니다.';
                        break;
                    case HttpServ.resCODE.FAILED:
                        $scope.bookmarkAlert.flag = 'danger';
                        $scope.bookmarkAlert.text = '로그인이 되지 않았습니다. 로그인 후 시도해주세요.';
                        break;
                }
            });
        };
        //////////////  END ==> 2. 북마크 하기 3. 북마크 해제하기  //////////////
    });