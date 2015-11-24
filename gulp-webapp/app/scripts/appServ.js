/**
 * Created by hyochan on 8/17/15.
 */
const resCode = {
    NO_REQ_PARAM : -4,
    ERR_PARAM : -3, // 정수형이어야 되는데 문자가 들어오는 경우
    ALREADY_INSERTED : -2,
    FAILED : -1,
    NO_DATA : 0,
    SUCCESS : 1
};

var Server = {
    doLogin : function(formData){
        return $.ajax({
            url : API_URL + "api/login",
            type : "POST",
            data : formData,
            cache : false,
            dataType : "json",
            //html, xml, text, script, json, jsonp
            xhrFields : {
                withCredentials: true
            }
        });
    },
    checkLogin : function(){ // checkLogin : 서버에 session이 살아 있는지 확인
        return $.ajax({
            url : API_URL + "api/login/check",
            type : "GET",
            cache : false,
            dataType : "json",
            //html, xml, text, script, json, jsonp
            xhrFields : {
                withCredentials: true
            }
        });
    },
    doLogout : function(){
        return $.ajax({
            url : API_URL + "api/login/logout",
            type : "GET",
            cache : false,
            dataType : "json",
            xhrFields : {
                withCredentials: true
            }
        });
    },
    doSignup : function(formData){
        return $.ajax({
            url : API_URL + "api/signup",
            type : "POST",
            data : formData,
            mimeType:"multipart/form-data",
            contentType : false,
            cache : false,
            processData : false,
            dataType : "json",
            //html, xml, text, script, json, jsonp
            xhrFields : {
                withCredentials: true
            }
        });
    },
    getProfile : function(){ // 본인 프로필 불러오기
        return $.ajax({
            url : API_URL + "api/profile/select",
            type : "GET",
            cache : false,
            dataType : "json",
            xhrFields : {
                withCredentials: true
            }
        });
    },
    getUserProfile : function(){
        return $.ajax({
            url : API_URL + "api/profile/select/" + SEE_USER,
            type : "GET",
            cache : false,
            dataType : "json"
        });
    },
    updateProfile : function(formData){
        return $.ajax({
            url : API_URL + "api/profile/update",
            type : "POST",
            data : formData,
            mimeType:"multipart/form-data",
            contentType : false,
            cache : false,
            processData : false,
            dataType : "json",
            //html, xml, text, script, json, jsonp
            xhrFields : {
                withCredentials: true
            }
        });
    },
    updatePassword : function(formData){
        return $.ajax({
            url : API_URL + "api/password/update",
            type : "POST",
            data : formData,
/*
            contentType : false,
*/
            cache : false,
            processData : false,
            dataType : "json",
            xhrFields : {
              withCredentials: true
            }
        });
    },
    getMembers : function(){
        return $.ajax({
            url : API_URL + "api/member/all",
            type : "GET",
            cache : false,
            dataType : "json",
            xhrFields : {
                withCredentials: true
            }
        });
    },
    getMember : function(member){ // get member profile with bookmark
        return $.ajax({
            url : API_URL + "api/member/one/" + member,
            type : "GET",
            cache : false,
            dataType : "json",
            xhrFields : {
                withCredentials: true
            }
        });
    },
    addBookmark : function(user_id){
        return $.ajax({
            url : API_URL + "api/bookmark/add/" + user_id,
            type : "GET",
            cache : false,
            dataType : "json",
            xhrFields : {
                withCredentials: true
            }
        });
    },
    removeBookmark : function(user_id){
        return $.ajax({
            url : API_URL + "api/bookmark/remove/" + user_id,
            type : "GET",
            cache : false,
            dataType : "json",
            xhrFields : {
                withCredentials: true
            }
        });
    },
    getBookmarks : function(){
        return $.ajax({
            url : API_URL + "api/bookmark/my",
            type : "GET",
            cache : false,
            dataType : "json",
            xhrFields : {
                withCredentials: true
            }
        });
    }
}
