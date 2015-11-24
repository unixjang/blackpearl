/**
 * Created by hyochan on 8/29/15.
 */

var room;

// 방 선택
$("#chatgrp ul li.room").click(function(){
    $(this).parent().parent().find('button').html($(this).text() + ' <span class="caret"></span>');
    room = $(this).text();
});

// 방 추가
$("#addChatGrpModal form div a#btn_addChatGrp").click(function(){
    alert("방 추가 : " + $("div input[name=chatgrp_name]").val());
});

/*
// 초대 : 현재 채팅방에 친구 초대
$("button#invite").click(function(){
    alert("invite");
});
*/

// 채팅 검색 Modal
$("#chatSearchModal").on('shown.bs.modal', function () {
    $("div input[name=search_chat]").focus();
});
// 채팅 검색 : 현재 채팅방 글 검색 (완료)
$("div input[name=search_chat]").keyup(function(){
    // Retrieve the input field text and reset the count to zero
    var filter = $(this).val();

    // Loop through the comment list
    $("div div#chat-list").each(function(){
        // If the list item does not contain the text phrase fade it out
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).fadeOut();

            // Show the list item if the phrase matches and increase the count by 1
        } else {
            $(this).show();
        }
    });
});

// 친구 검색 Modal
$("#inviteModal").on('shown.bs.modal', function () {
    $("div input[name=search_member]").focus();
});
// 친구 검색
$("div input[name=search_member]").keyup(function(){
    var rex = new RegExp($(this).val(), 'i');
    $('table tbody#member-list tr').hide();
    $('table tbody#member-list tr').filter(function () {
        return rex.test($(this).text());
    }).show();
});
// 친구 선택
$('table tbody#member-list tr').click(function(){
    if($(this).hasClass("selected")){
        $(this).removeClass("selected");
    }else{
        $(this).addClass("selected");
    }
});
// 친구 초대 버튼 클릭
$('div a#btn_invite').click(function(){
    $('table tbody#member-list tr').each(function(){
        if($(this).hasClass("selected")){
            alert("친구 초대 : " + $(this).find("td.user_id").text());
        }
    });
});

// 방 나가기
$("button#exit").click(function(){
    if(room !== "전체방"){
        alert("exit");
    }else{
        // show alert modal
        alert("전체방은 나갈 수 없습니다");
    }
});

// 사진 전송 : Modal 띄우기
$("div ul li#act_pic").click(function(){
    alert("act_pic");
});

// 파일 전송 : Modal 띄우기
$("div ul li#act_file").click(function(){
    alert("act_file");
});

// 동영상 전송 : Modal 띄우기
$("div ul li#act_mov").click(function(){
    alert("act_mov");
});

// 전송 : 채팅 글 전송
$("button#send_message").click(function(){
    var chat = {
        message : $('input #message').val(),
        type : 0,
        path : "",
        send_date : ""
    };
    if((chat != undefined || chat != "") && room != undefined){
        socket.emit('evt_msg_owner', {mar_id: room}, chat);
    }
});


$(document).ready(function () {

    console.log("load chatCtrl");
    room = "전체방";
    var socket = io.connect("http://www.blackpearl.me:52273");

    socket.on('message_peers', function(owner, chat){
        var send_date = new Date();
        send_date = send_date.getMonth() + "월 " +
            send_date.getDate() + "일 " +
            send_date.getHours() +":"+send_date.getMinutes() + ":" + send_date.getSeconds();

        // 메시지 보낸 마켓이 선택된 마켓이면 메시지 내용을 바로 append 한다
        if(room == owner.mar_id) {
            // msg I sent : img, sender, send_date, message
            var html = getPeerChatHtml("http://lorempixel.com/30/30/people/1/", owner.mar_name, send_date, chat.message);
            $('#chat-list').append(html);
            $('#chat-list').animate({
                scrollTop: $("#chat-list")[0].scrollHeight
            }, 300);
        }
        // 메시지를 보낸 마켓이 선택된 마켓이 아니면 메시지 카운트 1을 ul_room에서 찾아서 증가시킨다.
        else{
            $('#ul_room li').each(function(){
                if($(this).attr('data-name') == owner.mar_id){
                    $(this).find('span').show();
                    var cnt = parseInt($(this).find('span').text());
                    $(this).find('span').text(cnt+1);
                }
            });
        }
    });
    socket.on('message_my', function(clients, chat){
        var send_date = new Date();
        send_date = send_date.getMonth() + "월 " +
            send_date.getDate() + "일 " +
            send_date.getHours() +":"+send_date.getMinutes() + ":" + send_date.getSeconds();
        var html = getMyChatHtml("http://lorempixel.com/30/30/people/1/", clients.cus_id, send_date, chat.message);
        $('#chat-list').append(html);
        $('#chat-list').animate({
            scrollTop: $("#chat-list")[0].scrollHeight
        }, 300);
    });
    socket.on('not_logged_in', function(){
        alert("you are not logged in");
    });
});

function getChatRoom(){
    // set chat room on the left side div (div_chat)
    $.ajax({
        type: "post",
        url: "/CustomerRoomTask/select",
        dataType: "json",
        success: function (data){
            if(data.resultCode == 1){
                $('#ul_room').empty();
                if(data.chatroom.length == 0){
                    $('#div_chat').hide();
                }
                else {
                    $('#div_chat').show();
                    // set chatroom title and value
                    if(room == undefined){
                        // set room name
                        mar_name = data.chatroom[0].mar_name;
                        setChatRoom(data.chatroom[0].mar_id);
                        for (var i in data.chatroom) {
                            var html;
                            if (i == 0) {
                                html = '<li href="#" class="active list-group-item" ' +
                                    'data-uid="' + data.chatroom[i].mar_name + '"' +
                                    'data-name="' + data.chatroom[i].mar_id + '">'
                                    + data.chatroom[i].mar_name.substring(0,8)
                                    + '<span class="badge">0</span></li>';
                            } else {
                                html = '<li href="#" class="list-group-item" ' +
                                    'data-uid="' + data.chatroom[i].mar_name + '"' +
                                    'data-name="' + data.chatroom[i].mar_id + '">'
                                    + data.chatroom[i].mar_name.substring(0,8)
                                    + '<span class="badge">0</span></li>';
                            }
                            $('#ul_room').append(html);
                        }
                    }else{
                        for (var i in data.chatroom) {
                            var html;
                            if (data.chatroom[i].mar_id == room) {
                                html = '<li href="#" class="active list-group-item" ' +
                                    'data-uid="' + data.chatroom[i].mar_name + '"' +
                                    'data-name="' + data.chatroom[i].mar_id + '">'
                                    + data.chatroom[i].mar_name.substring(0,8)
                                    + '<span class="badge">0</span></li>';
                            } else {
                                html = '<li href="#" class="list-group-item" ' +
                                    'data-uid="' + data.chatroom[i].mar_name + '"' +
                                    'data-name="' + data.chatroom[i].mar_id + '">'
                                    + data.chatroom[i].mar_name.substring(0,8)
                                    + '<span class="badge">0</span></li>';
                            }
                            $('#ul_room').append(html);
                        }
                    }
                    hideAllRoomCntIfZero();
                }
            }else if(data.resultCode == -1){
                alert("로그인이 되지 않았습니다. 다시 시도해주세요");
            }
        },
        error : function (req, status, err){
            alert("code:" + req.status + "\\n" + "message:" + req.responseText + "\n" + "error:" + err);
        }
    });
}

// 내가 보낸 메시지 html
function getMyChatHtml(img, sender, send_date, message){
    var html =
        '<div style="padding: 15px;" class="media">' +
        '<a href="#" class="pull-left">' +
        '<img src="'+ img + '" style="width:50px;" alt="" class="media-object img-circle"/>' +
        '</a>' +
        '<div style="padding-left: 10px" class="media-body">' +
        '<h4 class="media-heading" style="#0000ed">' + sender +
        '<span style="font-size:small;" class="small pull-right">' + send_date +'</span></h4>' +
        '<p>' + message + '</p>' +
        '</div>' +
        '</div>' +
        '<hr/>';
    return html;
}

// 상대가 보낸 메시지 html
function getPeerChatHtml(img, sender, send_date, message){
    var html =
        '<div style="padding: 15px;" class="media"><a href="#" class="pull-left">' +
        '<a href="#" class="pull-left">' +
        '<img src="'+ img + '" style="width:50px;" alt="" class="media-object img-circle"/>' +
        '</a>' +
        '<div style="padding-left: 10px" class="media-body">' +
        '<h4 class="media-heading">' + sender +
        '<span style="font-size:small;" class="small pull-right">' + send_date +'</span></h4>' +
        '<p>' + message + '</p>' +
        '</div>' +
        '</div>' +
        '<hr/>';
    return html;
}