// 로그인 버튼 클릭
$('button#login').click(function () {
    var formData = $("#form_login").serialize();

    var promise = parent.Server.doLogin(formData);
    promise
        .success(function(data){
            if(data.resultCode === resCode.SUCCESS){
                console.log("login success");
                location.hash = "#home";
            }
            else if(data.resultCode == resCode.FAILED){
                console.log(resCode.errMsg);
                $("div div#login_alert").removeClass("hidden");
                $("div div#login_alert").removeClass("alert-success");
                $("div div#login_alert").addClass("alert-danger");
                $("div div#login_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 아이디 또는 비밀번호 오류입니다. 다시 시도해주세요."
                );
            }
            else if(data.resultCode == resCode.NO_REQ_PARAM){
                console.log("no request parameters");
                $("div div#login_alert").removeClass("hidden");
                $("div div#login_alert").removeClass("alert-success");
                $("div div#login_alert").addClass("alert-danger");
                $("div div#login_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 아이디와 암호를 입력해주세요."
                );
            }
        });
});

// ==> 시작
$(document).ready(function(){
	console.log("load loginCtrl");
});

