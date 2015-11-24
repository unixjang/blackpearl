/**
 * Created by hyochan on 8/17/15.
 */

// local controller for home.html

$(document).ready(function(){

    console.log("load homeCtrl");

    var promise;
    if(SEE_USER == ""){
        promise = parent.Server.getProfile(); //GET User profile
    }else{
        promise = parent.Server.getUserProfile(); //GET Peer profile
    }

    promise
        .success(function(data){
            var user = data.user;
            if(SEE_USER === "")
                $('#user_greeting').html('안녕하세요. ' + user.id + "님");
            else {
                $('#user_greeting').html(user.id + "님의 페이지를 방문하셨습니다.");
            }
            $('div#user ul li#id').text(user.id);
            $('div#user ul li#name').text(user.name);
            $('div#user ul li#phone').text(user.phone);
            $('div#user ul li#email').text(user.email);
            $("div#user img").attr("src", API_URL+user.img + "?" + new Date().getTime());
        });
});
