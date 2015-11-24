/**
 * Created by hyochan on 8/29/15.
 */

'use strict';

var defaultChatRoom = { name : '전체방', cnt : 3};

app
    .controller('ChatCtrl', function($scope, $location, HttpServ){
        // ==> START : navBar active Class 부여하기
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기

        /*************  START ==> 채팅 방 불러오기  *************/
        $scope.selectedChatRoom = defaultChatRoom;
        $scope.chatRooms = [
            defaultChatRoom,
            { name : 'MY', cnt : 5},
            { name : 'BP', cnt : 7}
        ];
        $scope.selectChatRoom = function(chatRoom){
            $scope.selectedChatRoom = chatRoom;
        };
        //////////////  END <== 채팅 방 불러오기  //////////////

        /*************  START ==> 채팅 방 나가기  *************/
        $scope.exitChatRoom = function(){
            if($scope.selectedChatRoom === defaultChatRoom){
                // alert('전체방은 나갈 수 없습니다');
            }else{
                // alert('exit chat room');
            }
        };
        //////////////  END <== 채팅 방 나가기  //////////////

        /*************  START ==> 채팅 검색 : chatSearchMODAL  *************/
        $scope.selectChatQuery = function(select){
            $scope.chatQueryBy = select;
        };
        $scope.chatQuery = {};
        $scope.chatQueryBy = { name : '전체', value : '$' };
        $scope.chatQueryIndexes =[
            { name : '전체', value : '$' },
            { name : '아이디', value: 'id' },
            { name : '이름', value : 'name'},
            { name : '메시지', value : 'msg'}
        ];
        $scope.chats = [
            {
                'id' : 'id',
                'img' : 'http://lorempixel.com/30/30/people/1/',
                'name' : 'Mahesh Pachangane',
                'msg' : 'Hi~ There.',
                'date' : new Date().getMonth() + '월 ' +
                        new Date().getDate() + '일, ' +
                        new Date().getHours() + '시 ' +
                        new Date().getMinutes() + '분 '
            },
            {
                'id' : 'id',
                'img' : 'http://lorempixel.com/30/30/people/1/',
                'name' : 'Brijesh Shah',
                'msg' : 'Hi! Everybody. Whatsup??',
                'date' : new Date().getMonth() + '월 ' +
                        new Date().getDate() + '일, ' +
                        new Date().getHours() + '시 ' +
                        new Date().getMinutes() + '분 '
            }
        ];
        $scope.orderProp='name';
        //////////////  END ==> 채팅 검색 : chatSearchMODAL  //////////////

        /*************  START ==> 맴버 초대 : memberInviteModal *************/
        $scope.selectMemberQuery = function(select){
            $scope.memberQueryBy = select;
        };
        $scope.checkAllMembers = function(checked){
            angular.forEach($scope.members, function (member) {
                member.selected = checked;
            });
        };
        $scope.memberQuery = {};
        $scope.memberQueryBy = { name : '전체', value : '$' };
        $scope.memberQueryIndexes =[
            { name : '전체', value : '$' },
            { name : '아이디', value: 'id' },
            { name : '이름', value : 'name'},
            { name : '폰번호', value : 'phone'},
            { name : '이메일', value : 'email'}
        ];
        $scope.memberChecked = false;
        $scope.members = [
            {
                'selected' : false,
                'id' : 'id',
                'img' : 'http://lorempixel.com/30/30/people/1/',
                'name' : 'Mahesh Pachangane',
                'phone' : '01099999999',
                'email' : 'email@email.com'
            },
            {
                'selected' : false,
                'id' : 'id',
                'img' : 'http://lorempixel.com/30/30/people/1/',
                'name' : 'Brijesh Shah',
                'phone' : '01088888888',
                'email' : '8888d@email.com'
            }
        ];
        $scope.orderProp='name';
        //////////////  END ==> 맴버 초대 : memberInviteMODAL //////////////
    });