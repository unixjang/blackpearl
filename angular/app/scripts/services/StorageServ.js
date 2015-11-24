/**
 * Created by hyochan on 9/28/15.
 */
'use strict';

app
    .factory('StorageServ', function(){
        return{
            set:function(key, value){
                return localStorage.setItem(key,value);
            },
            get:function(key){
                return localStorage.getItem(key);
            },
            destroy:function(key){
                return localStorage.removeItem(key);
            }
        };
    });