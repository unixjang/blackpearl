/**
 * Created by hyochan on 9/23/15.
 */
var mysql = require('mysql');

// ****** NOT USED ****** //

var pool = mysql.createConnection({
    host : '127.0.0.1',
    // socketPath : '/opt/local/var/run/mysql56/mysqld.sock',
    user : 'root',
    port : '3306',
    password : 'wlvlwlrl87!',
    database : 'blackpearl',
    multipleStatements : true
});

module.exports = pool;