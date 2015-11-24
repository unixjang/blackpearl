/**
 * Created by hyochan on 8/29/15.
 */

'use strict';

app
    .controller('BoardCtrl', function($scope, $location, filterFilter, HttpServ, SessionServ, ModalService){

        $scope.$fi = $('.fileinput');
        $scope.initFile = function(){
            $scope.$fi.fileinput({
                'showUpload':false,
                'showPreview': false,
                initialPreview: [],
                overwriteInitial: false
            });
        };
        $scope.initFile();

        /** START : sample data for board **/
        $scope.boards = [
            {
                _id : 1,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'asdf123',
                title : '안녕하세요. 1',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 5,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            },
            {
                _id : 2,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'asdf123',
                title : '안녕하세요. 2',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 7,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            },
            {
                _id : 3,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'asdf123',
                title : '안녕하세요. 2',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 7,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            },
            {
                _id : 4,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'asdf123',
                title : '안녕하세요. 2',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 7,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            },
            {
                _id : 5,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'qwer123',
                title : '안녕하세요. 2',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 7,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            },
            {
                _id : 6,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'qwer123',
                title : '안녕하세요. 2',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 7,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            },
            {
                _id : 7,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'qwer123',
                title : '안녕하세요. 2',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 7,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            },
            {
                _id : 8,
                ownerId : SessionServ.get('user'),
                boardGrpName : '',
                writerId : 'qwer123',
                title : '안녕하세요. 2',
                content : '글 내용입니다. 여보세요.',
                createAt : new Date(),
                updateAt : new Date(),
                readCnt : 7,
                secret : false,
                upload : {
                    cnt : 0,
                    files : undefined
                }
            }
        ];
        /// END : sample data for board ///

        // ==> START : navBar active Class 부여하기
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기

        $scope.predicate = 'name';
        $scope.reverse = true;
        $scope.currentPage = 1;
        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        /**  START : boardGrpName  **/
        $scope.selectedBoardGrpName = '전체';
        $scope.boardGrpNames = ['전체', '개인', '회사'];
        $scope.selectBoardGrp = function(boardGrpName){
            $scope.selectedBoardGrpName = boardGrpName;
        };
        ///  END  : boardGrpName  **/

        /**  START : boardQuery  **/
        $scope.selectBoardQuery = function(select){
            $scope.boardQueryBy = select;
        };
        $scope.boardQuery = {};
        $scope.boardQueryBy = { name : '$', value : '$' };
        $scope.boardQueryIndexes =[
            { name : '$', value : '$' },
            { name : '제목', value: 'title' },
            { name : '글쓴이', value : 'writer_id'},
            { name : '글', value : 'content'}
        ];
        ///  END : boardQuery ///

        /**  START : pagination  **/
        $scope.totalItems = $scope.boards.length;
        $scope.numPerPage = 5;
        $scope.paginate = function (value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.boards.indexOf(value);
            console.log('begin : ' + begin + ', end : ' + end + ', index : ' + index);
            return (begin <= index && index < end);
        };
        ///  END : pagination  ///

        /**  START : 글 쓰기 체크박스 클릭  **/
        $scope.writeChange = function(){
            if(!$scope.isWrite){
                if($scope.writeMode !== '글 쓰기'){
                    $scope.writeMode = '글 쓰기';
                    delete $scope.write;
                }
            }
        };

        /**  START : 게시판 글쓰기 버튼 클릭  **/
        $scope.writeMode = '글 쓰기';
        $scope.writeBoard = function(write){
            if(write){
                if(!write.title) console.log('writeBoard title is missing');
                else if(!write.content) console.log('writeBoard content is missing');
                else{
                    var writeBoardForm = document.querySelector('form#writeBoardForm');
                    var formData = new FormData(writeBoardForm);
                    /*$scope.boards.push(
                        {
                            _id : 9,
                            owner_id : SessionServ.get('user'),
                            boardgrp_name : '',
                            writer_id : 'asdf123',
                            title : '안녕하세요. 1',
                            content : '글 내용입니다. 여보세요.',
                            create_at : new Date(),
                            update_at : new Date(),
                            read_cnt : 5,
                            secret : false,
                            upload : {
                                cnt : 0,
                                files : undefined
                            }
                        }
                    );*/
                    console.log('writeBoard - title : ' + write.title + ', content : ' + write.content);
                }
            }else{
                console.log('writeBoard variables are missing');
            }
        };
        $scope.readModalOn = function(board){
            ModalService.showModal({
                templateUrl: 'readModal.html',
                controller: 'ReadModalCtrl',
                inputs: {
                    board : board
                }
            }).then(function(modal) {
                modal.element.modal();
                $scope.isWrite = false;
                if($scope.writeMode === '글 수정'){
                    $scope.writeMode = '글 쓰기';
                    delete $scope.write;
                }
                modal.close
                    .then(function(result) {
                        console.log('readModal close : ' + result);
                        switch (result){
                            case 'update':
                                $scope.isWrite = true;
                                $scope.writeMode = '글 수정';
                                $scope.write = board;
                                break;
                            case 'delete':
                                $scope.boards.splice($scope.boards.indexOf(board),1);
                                break;
                            default :
                                if($scope.write){
                                    $scope.isWrite = true;
                                }
                                break;
                        }
                    }).catch(function(error) {
                        // error contains a detailed error message.
                        console.log(error);
                    });
            });
        };
        $scope.boardGrpAddModalOn = function(){
            ModalService.showModal({
                templateUrl: 'boardGrpAddModal.html',
                controller: 'BoardGrpAddCtrl'
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    // $scope.message = 'You said ' + result;
                });
            }).catch(function(error) {
                // error contains a detailed error message.
                console.log(error);
            });
        };
        //////////////  END : MODALS  //////////////
    })

    .controller('BoardGrpAddCtrl', function($scope, $element, HttpServ, close) {
        $scope.close = function (result) {
            $element.modal('hide'); //  모바일에서 모달 없어졌을 때 까만 화면 방지 ==> Manually hide the modal using bootstrap.
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
        $scope.addBoardGrp = function(boardGrp){
            if(!boardGrp){
                console.log('please write boardGrp');
            }else{
                console.log('boardGrp.title : ' + boardGrp.title);
            }
        };
    })
    .controller('ReadModalCtrl', function($scope, $element, HttpServ, board, close) {
        $scope.close = function (result) {
            $element.modal('hide'); //  모바일에서 모달 없어졌을 때 까만 화면 방지 ==> Manually hide the modal using bootstrap.
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
        $scope.board = board;
    });