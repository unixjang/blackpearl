/**
 * Created by hyochan on 8/29/15.
 */

// filter : 맴버 검색
$("div.input-group input#filter_member").keyup(function(){
    // Retrieve the input field text and reset the count to zero
    var filter = $(this).val();

    // 북마크 필터링
    $("div#book_member a").each(function(){
        // If the list item does not contain the text phrase fade it out
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).fadeOut();

        // Show the list item if the phrase matches and increase the count by 1
        } else {
            $(this).show();
        }
    });

    // 전체 회원 필터링
    $("div#all_member a").each(function(){

        // If the list item does not contain the text phrase fade it out
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).fadeOut();

        // Show the list item if the phrase matches and increase the count by 1
        } else {
            $(this).show();
        }
    });
});

// #book_member && #all_member에서 리스트 선택시 모달 불러오기전 함수
function seeMember(member){
    var promise = Server.getMember(member);
    promise
        .success(function(data){
            if(data.resultCode == resCode.SUCCESS){
                var user = data.user;
                if(data.bookmark === true){
                    $("div#memberModal a.btn_bookmark_add").addClass("hidden");
                    $("div#memberModal a.btn_bookmark_remove").removeClass("hidden");
                }else{
                    $("div#memberModal a.btn_bookmark_remove").addClass("hidden");
                    $("div#memberModal a.btn_bookmark_add").removeClass("hidden");
                }
                $("div#memberModal img.user_img").attr("src", API_URL + user.img + "?" + new Date().getTime());
                $("div#memberModal li.user_id").text(user.id);
                $("div#memberModal li.user_name").text(user.name);
                $("div#memberModal li.user_phone").text(user.phone);
                $("div#memberModal li.user_email").text(user.email);
            }
        })
        .error(function(request,status,error){
            // console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            console.log("code : " + request.status + "\nerror : " + error);
        });
}
// 맴버 모달 열었을 때 action
$("div#book_member").delegate('a', 'click', function(e){
    e.preventDefault();
    $("div div#bookmark_alert").addClass("hidden");
    var member = $(this).data('id');
    seeMember(member);
});
$("div#all_member").delegate('a', 'click', function(e){
    e.preventDefault();
    $("div div#bookmark_alert").addClass("hidden");
    var member = $(this).data('id');
    seeMember(member);
});

// 맴버 페이지 방문
$("div#memberModal a.btn_visit").click(function(e){
    e.preventDefault();
    $("div#memberModal").on('hidden.bs.modal',function(e){ // ** hide가 끝나고 나서 실행되어야 한다. 안 그럼 뻑남
        e.preventDefault();
        SEE_USER = $(this).parent().parent().find("div#user li.user_id").text();
        location.hash = "#home";
    });
});

// TODO : 맴버 북마크
$("div#memberModal a.btn_bookmark_add").click(function(e){
    e.preventDefault();
    // user : {"id":"id", "name":"name", "phone":"phone", "email":"email"}
    var user_id = $(this).parent().parent().find("div#user li.user_id").text();
    var promise = Server.addBookmark(user_id);
    promise
        .success(function(data) {
            switch (data.resultCode){
                case resCode.ALREADY_INSERTED:
                case resCode.SUCCESS:
                    $("div#memberModal a.btn_bookmark_add").fadeOut();
                    $("div#memberModal a.btn_bookmark_remove").fadeIn();
                    $("div#memberModal a.btn_bookmark_add").addClass("hidden");
                    $("div#memberModal a.btn_bookmark_remove").removeClass("hidden");

                    $("div div#bookmark_alert").removeClass("hidden");
                    $("div div#bookmark_alert").addClass("alert-success");
                    $("div div#bookmark_alert").removeClass("alert-danger");
                    $("div div#bookmark_alert").html(
                        "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                        " 다음 회원이 북마크에 추가되었습니다."
                    );
                    getBookmarkMember();
                    break;
                case resCode.FAILED:
                    $("div div#bookmark_alert").removeClass("hidden");
                    $("div div#bookmark_alert").removeClass("alert-success");
                    $("div div#bookmark_alert").addClass("alert-danger");
                    $("div div#bookmark_alert").html(
                        "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                        " 로그인이 되지 않았습니다. 로그인 후 시도해주세요."
                    );
                    break;
            }
        })
        .error(function(request,status,error){
            // console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            console.log("code : " + request.status + "\nerror : " + error);
        });
});

// 북마크 해제
$("div#memberModal a.btn_bookmark_remove").click(function(e){
    e.preventDefault();
    // user : {"id":"id", "name":"name", "phone":"phone", "email":"email"}
    var user_id = $(this).parent().parent().find("div#user li.user_id").text();
    var promise = Server.removeBookmark(user_id);
    promise
        .success(function(data) {
            switch (data.resultCode){
                case resCode.NO_DATA:
                    $("div div#bookmark_alert").removeClass("hidden");
                    $("div div#bookmark_alert").removeClass("alert-success");
                    $("div div#bookmark_alert").addClass("alert-danger");
                    $("div div#bookmark_alert").html(
                        "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                        " 북마크에서 제외할 회원이 없습니다."
                    );
                    break;
                case resCode.SUCCESS:
                    $("div#memberModal a.btn_bookmark_add").fadeIn();
                    $("div#memberModal a.btn_bookmark_remove").fadeOut();
                    $("div#memberModal a.btn_bookmark_add").removeClass("hidden");
                    $("div#memberModal a.btn_bookmark_remove").addClass("hidden");

                    $("div div#bookmark_alert").removeClass("hidden");
                    $("div div#bookmark_alert").addClass("alert-success");
                    $("div div#bookmark_alert").removeClass("alert-danger");
                    $("div div#bookmark_alert").html(
                        "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                        " 다음 회원이 북마크에서 제외되었습니다."
                    );
                    getBookmarkMember();
                    break;
                case resCode.FAILED:
                    $("div div#bookmark_alert").removeClass("hidden");
                    $("div div#bookmark_alert").removeClass("alert-success");
                    $("div div#bookmark_alert").addClass("alert-danger");
                    $("div div#bookmark_alert").html(
                        "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                        " 로그인이 되지 않았습니다. 로그인 후 시도해주세요."
                    );
                    break;
            }
        })
        .error(function(request,status,error){
            // console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            console.log("code : " + request.status + "\nerror : " + error);
        });
});


// ul bookmark-list click ==> 북마크 리스트만 보이기
$("ul.nav li#bookmark-list").click(function() {
    $('ul.nav li#all-list').removeClass('active');
    $(this).addClass("active");
    $('div#all_member').addClass("hidden");
    $('div#book_member').removeClass("hidden");
});
// ul all-list click ==> 전체 리스트 보기
$("ul.nav li#all-list").click(function(){
    $('ul.nav li#bookmark-list').removeClass('active');
    $(this).addClass("active");
    $('div#book_member').addClass("hidden");
    $('div#all_member').removeClass("hidden");
});

function getBookmarkMember(){
    var promiseBookmarks = Server.getBookmarks();
    promiseBookmarks
        .success(function(data){
            $('div#book_member').empty();
            if(data.resultCode == resCode.SUCCESS){
                for(var i in data.bookmarks){
                    // console.log("img : " + data.users[i].img);
                    $('div#book_member').append(getMemberThumbHtml(data.bookmarks[i].id, data.bookmarks[i].name,
                        API_URL + data.bookmarks[i].img));
                }
            }else if(data.resultCode == resCode.NO_DATA){
                $('div#book_member').append(getEmptyMemberHtml());
            }
        })
        .error(function(request,status,error){
            // console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            console.log("code : " + request.status + "\nerror : " + error);
        });
}

// ==> 시작
$(document).ready(function () {
    console.log("load memberCtrl");

    getBookmarkMember();

    var promiseMembers = Server.getMembers();
    promiseMembers
        .success(function(data){
            $('div#all_member').empty();
            if(data.resultCode == resCode.SUCCESS){
                for(var i in data.users){
                    // console.log("img : " + data.users[i].img);
                    $('div#all_member').append(getMemberThumbHtml(data.users[i].id, data.users[i].name,
                        API_URL + data.users[i].img));
                }
            }else if(data.resultCode == resCode.NO_DATA){
                $('div#all_member').append(getEmptyMemberHtml());
            }
        })
        .error(function(request,status,error){
            // console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            console.log("code : " + request.status + "\nerror : " + error);
        });
});

// 맴버가 있을 때 뿌려주는 썸네일
function getMemberThumbHtml(user_id, user_name, user_img){
    var html =
        '<div class="col-xs-6 col-md-3 col-lg-2" style="padding: 15px; text-align:center;">' +
        '<a href="#" data-toggle="modal" data-target="#memberModal" data-id="' +
            user_id
        + '">' +
        '<img src="' +
            user_img
        + '" class="center-block img-circle" width="96" height="96">' +
        '<h3 class="text-center">' +
            user_name
        + '</h3>' +
        '<p class="user_id text-center">' +
            user_id
        + '</p>' +
        '</a>' +
        '<br>' +
        '</div>';
    return html;
}

// 맴버가 없을 때 뿌려주는 div
function getEmptyMemberHtml(){
    var html =
        '<div class="row text-center" style="margin-top: 30px; color: #31708f; font-size: medium">' +
        '등록된 회원이 없습니다.' +
        '</div>';
    return html;
}
