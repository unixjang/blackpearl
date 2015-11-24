/**
 * Created by hyochan on 8/29/15.
 */

var board;

// 게시판 선택
$("#boardgrp ul li").click(function(){
    $(this).parent().parent().find('button').html($(this).text() + ' <span class="caret"></span>');
    room = $(this).text();
});

// jquery data table library
$('#myBoard').DataTable();

// 폼 submit : 게시판 추가 (boardGrpAddModal)
$("form#board_grp_add").on('submit',(function(e) {
    e.preventDefault();
    //var formData = $(this).serialize();
    var formData = $(this).serialize();
    alert("form board_grp_add submit");

}));

/**************** 게시판 보기 (readModal) ******************/
// click : 게시판 리스트 클릭 시 게시판 보기 (readModal)
$('.board_list').click(function() {
    var board_id = $(this).data('id');
    $('#readModal .modal-title .badge').text(board_id);
    // 숨기기
    $('#readModal .modal-body .content').addClass('hide');
    // 보이기
    $('#readModal .modal-body .file').removeClass('hide');
});

/***************** 게시판 수정 (updateModal) ******************/
// 게시판 읽기에서 수정 버튼 클릭
// P.S : 게시판 수정은 게시판 쓰기 모달 (writeModal)에 content를 불러와서 수정
// click : readModal 업데이트 버튼 클릭
$('#readModal #btn_update').click(function(){
    var board_id = $('#readModal .modal-title .badge').text();
    $('#writeModal .modal-title').text("글 수정 - " + board_id);
});
// 게시판 읽기에서 삭제 버튼 클릭
// click : readModal 삭제 버튼 클릭
$('#readModal #btn_delete').click(function(){
    alert("삭제");
});

/***************** 게시판 쓰기 (writeModal) ******************/
// writeModal이 숨김이 되면 modal-title이랑 content reset
$("#writeModal").on("hidden.bs.modal", function(){
    $('#writeModal .modal-title').text("글 쓰기");
    $('#writeModal input[name="title"]').val("");
    $('#writeModal textarea[name="content"]').val("");
    $('#writeModal input[name="upload"]').val("");
});

$(document).ready(function(){

    console.log("load boardCtrl");
    board = "전체";


/*
    if(SEE_USER === "")
        $('#user_greeting').html('안녕하세요. ' + data.id + "님");
    else {
        $('#user_greeting').html(
            data.id + "님의 페이지를 방문하셨습니다.<br><br>" +
            "<button onclick='backToMyPage()' class='btn btn-primary'>내 페이지로 돌아가기</button>"
        );
    }
*/
});

$('.fileinput').fileinput({
    'showUpload':false,
    'showPreview': false
});