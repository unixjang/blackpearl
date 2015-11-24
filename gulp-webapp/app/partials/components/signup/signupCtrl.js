// form submit : 회원가입
$("form#signup").on('submit',(function(e){
    //var formData = $(this).serialize();
    var signupForm = document.querySelector('form#signup');
    var formData = new FormData(signupForm);
    var promise = parent.Server.doSignup(formData);
    promise
        .success(function(data){
            if(data.resultCode === resCode.SUCCESS){
                console.log("signup success");
                $("div div#signup_alert").removeClass("hidden");
                $("div div#signup_alert").removeClass("alert-danger");
                $("div div#signup_alert").addClass("alert-success");
                $("div div#signup_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 회원가입이 완료되었습니다."
                );
                location.hash = "#home";
            }
            else if(data.resultCode == resCode.ALREADY_INSERTED){
                console.log("already inserted id");
                $("div div#signup_alert").removeClass("hidden");
                $("div div#signup_alert").removeClass("alert-success");
                $("div div#signup_alert").addClass("alert-danger");
                $("div div#signup_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 중복된 아이디입니다. 다른 아이디로 시도해주세요."
                );
            }
            else if(data.resultCode == resCode.NO_REQ_PARAM){
                console.log("no request parameters");
                $("div div#signup_alert").removeClass("hidden");
                $("div div#signup_alert").removeClass("alert-success");
                $("div div#signup_alert").addClass("alert-danger");
                $("div div#signup_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 회원정보를 모두 입력해주세요."
                );
            }
        })
        .error(function(request,status,error){
            // console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            console.log("code : " + request.status + "\nerror : " + error);
        });

    e.preventDefault(); // STOP default action
    return false; // Very important line, it disable the page refresh.
}));


// ==> 시작
$(document).ready(function(){
	console.log("load signupCtrl");
});

$("#file-3").fileinput({
    'allowedFileExtensions' : ['jpg', 'png','gif'],
    showUpload: false,
    showCaption: false,
    browseClass: "btn btn-primary btn-sm",
    /*fileType: "any",*/
    previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
});





