/**
 * Created by hyochan on 8/29/15.
 */

// 폼 submit : 암호 업데이트
$("div form#update_pw").on('submit',(function(e){
    console.log("update_pw submit");

    var pw = $(this).find("input[name='pw']").val();
    var pw_ok = $(this).find("input[name='pw_ok']").val();
    console.log("pw : " + pw + ", pw_ok : " + pw_ok);

    // var formData = new FormData(this);
    var formData = $(this).serialize();
    var promise = parent.Server.updatePassword(formData);
    promise
        .success(function(data){
            if(data.resultCode === resCode.SUCCESS){
                console.log("password update success");
                $("div div#password_update_alert").removeClass("hidden");
                $("div div#password_update_alert").removeClass("alert-danger");
                $("div div#password_update_alert").addClass("alert-success");
                $("div div#password_update_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 암호가 변경되었습니다."
                );
            }
            else{
                console.log("password update failed");
                $("div div#password_update_alert").removeClass("hidden");
                $("div div#password_update_alert").removeClass("alert-success");
                $("div div#password_update_alert").addClass("alert-danger");
                $("div div#password_update_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 암호가 올바르지 않습니다."
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

// 폼 submit : 프로필 업데이트
$("div form#update_profile").on('submit',(function(e){
    console.log("update_profile submit");
    var formData = new FormData(this);

    var promise = Server.updateProfile(formData);
    promise
        .success(function(data){
            if(data.resultCode === resCode.SUCCESS){
                var user = data.user;
                console.log("profile update success");
                $("div div#profile_update_alert").removeClass("hidden");
                $("div div#profile_update_alert").removeClass("alert-danger");
                $("div div#profile_update_alert").addClass("alert-success");
                console.log ("img src : " + API_URL + user.img);
                $("div#user img").attr("src", API_URL+user.img + "?" + new Date().getTime());
                $("#file-3").fileinput('reset');
                $("div div#profile_update_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 프로필이 수정되었습니다."
                );
            }
            else{
                console.log("login failed");
                $("div div#profile_update_alert").removeClass("hidden");
                $("div div#profile_update_alert").removeClass("alert-success");
                $("div div#profile_update_alert").addClass("alert-danger");
                $("div div#profile_update_alert").html(
                    "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
                    " 프로필이 수정시 문제가 발생했습니다. 다시 시도해주세요."
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
$(document).ready(function () {
    console.log("load profileCtrl");
    var promise = Server.getProfile();
    promise
        .success(function(data){
            if(data.resultCode == resCode.SUCCESS){
                var user = data.user;
                $("div#user p#id").text(user.id);
                $("div#user img").attr("src", API_URL + user.img + "?" + new Date().getTime());
                $("form#update_profile input[name='name']").val(user.name);
                $("form#update_profile input[name='phone']").val(user.phone);
                $("form#update_profile input[name='email']").val(user.email);
            }
        })
        .error(function(request,status,error){
            // console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            console.log("code : " + request.status + "\nerror : " + error);
        });
});

$("#file-3").fileinput({
    'allowedFileExtensions' : ['jpg', 'png','gif'],
    showUpload: false,
    showCaption: false,
    browseClass: "btn btn-primary btn-sm",
    /*fileType: "any",*/
    previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
});
