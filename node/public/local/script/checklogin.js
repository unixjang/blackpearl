/**
 * Created by hyochan on 8/14/15.
 */
function getHTTPObject(){
    if(window.ActiveXObject){
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest){
        return new XMLHttpRequest();
    }
    else{
        alert("Your browser does not support AJAX.");
        return null;
    }
}

$(document).ready(function () {

    getHTTPObject();

    $.ajax({
        type: "get",
        url: "/api/login/check",
        dataType: "json",
        success: function (data) {
            if (data.resultCode == -1) {
                location.href = "/login";
            }
        },
        error: function (request, status, error) {
            alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });
});