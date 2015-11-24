const CONTENT_VIEW_ID = '#content';
const PARTIALS_DIR = 'partials/components/';

const view = {
    /* MAIN NAVS */
    LOGIN : PARTIALS_DIR + 'login/login.html',
    SIGNUP : PARTIALS_DIR + 'signup/signup.html',
    TITLE : PARTIALS_DIR + 'title/title.html',
    HOME : PARTIALS_DIR + 'home/home.html',
    CHAT : PARTIALS_DIR + 'chat/chat.html',
    MEMBER : PARTIALS_DIR + 'member/member.html',
    BOARD : PARTIALS_DIR + 'board/board.html',
    PHOTO : PARTIALS_DIR + 'photo/photo.html',
    /* SETTING NAVS */
    PROFILE : PARTIALS_DIR + 'profile/profile.html'
};

var SEE_USER = "";

function backToMyPage(){
    SEE_USER = "";
    $('#page_info').addClass("hidden");
    location.hash = "#home";
    $(CONTENT_VIEW_ID).load(view.HOME);
}

function loadDivContent(){
    var hash = location.hash;
    console.log("hashchange : " + hash);
    $('#myNavbar ul li.active').removeClass('active');

    /* START ==> SET PAGE INFO */
    if(SEE_USER === "")
        $('#page_info').addClass("hidden");
    else {
        $('#page_info').removeClass("hidden");
        $('#page_info').html(
            "<div style='display: inline; line-height: 1.77'>" +
            SEE_USER + "님의 페이지를 열람하고 계십니다. &nbsp;&nbsp;" +
            "<button onclick='backToMyPage()' class='btn btn-primary'>내 페이지로 돌아가기</button>"  +
            "<div>");
    }
    /* END => PAGE INFO */

    var promise = Server.checkLogin();
    promise
        .success(function(data){
            if(data.resultCode === resCode.SUCCESS){ // 로그인 o 페이지
                $('#myNavbar ul li').removeClass('disabled disableClick');
                switch(hash){
                    case "#login":
                    case "#signup":
                        location.hash = "#home";
                        break;
                    case "#title":
                        $('#title_lnk').addClass('active');
                        $(CONTENT_VIEW_ID).load(view.TITLE);
                        break;
                    case "#home":
                        $('#home_lnk').addClass('active');
                        $(CONTENT_VIEW_ID).load(view.HOME);
                        break;
                    case "#chat":
                        $('#chat_lnk').addClass('active');
                        $(CONTENT_VIEW_ID).load(view.CHAT);
                        break;
                    case "#member":
                        $('#member_lnk').addClass('active');
                        $(CONTENT_VIEW_ID).load(view.MEMBER);
                        break;
                    case "#board":
                        $('#board_lnk').addClass('active');
                        $(CONTENT_VIEW_ID).load(view.BOARD);
                        break;
                    case "#photo":
                        $('#photo_lnk').addClass('active');
                        $(CONTENT_VIEW_ID).load(view.PHOTO);
                        break;
                    case "#profile":
                        $('#extra_lnk').addClass('active');
                        $(CONTENT_VIEW_ID).load(view.PROFILE);
                        break;
                }
            }
            else{ // 로그인 x 페이지
                $('#myNavbar ul li').addClass('disabled disableClick');
                switch(hash){
                    case "#signup":
                        $(CONTENT_VIEW_ID).load(view.SIGNUP);
                        break;
                    case "#login":
                        $(CONTENT_VIEW_ID).load(view.LOGIN);
                        break;
                    default :
                        location.hash = "#login";
                        break;
                }
            }
        })
        .error(function(){
            location.hash = "#login";
        });
}

$(window).on('hashchange', function() {
    loadDivContent();
});

var started = false;
var loginId;

$(document).ready(function(){
	// ajaxPrefilter는 content html 로드시 script를 불러올 때 생기는 warning을 없애준다
	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    	options.async = true;
	});

    // 처음 페이지 불러올 때 hash로 부터 불러옴 ==> for backstack
    if(location.hash === "" || location.hash === "#") {
        location.hash = "#home";
        // location.reload();
    }
    loadDivContent();

    /********************* 앱 시작을 알림 **************************/
    started = true;

    // navbar 클릭시 active class 교체하기
/*
    $('#myNavbar ul').on('click', 'li', function() {
        if(started == true){
            $('#myNavbar ul li.active').removeClass('active');
        }
        $(this).addClass('active');
    });
*/

    // 로그아웃
    $("#logout").on('click', function(e){
        e.preventDefault(); // STOP default action
        var promise = Server.doLogout();
        promise
        .success(function(data){
            if(data.resultCode === resCode.SUCCESS){
                console.log("logout success");
                location.hash = "#login";
            }
        });
    });
});