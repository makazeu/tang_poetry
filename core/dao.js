/*
 * Name  : MySQL Dabatase Access Object
 * Author: Makazeu
 */
var mysql      = require('mysql');
var db_config  = require('./config');



exports.query = function(querystring, func) {
    var connection = mysql.createConnection(db_config.getDatabseConfig());
    connection.connect();
    
    connection.query(querystring, function(err, rows, fields) {
        connection.end();
        if (err) {
            console.log('=========== SQL ERROR ===========');
            console.log('query: ' + querystring);
            console.log('error: ' + err);
            console.log('=================================');
            func(-1);
        }
        func(rows);
    });
    //connection.end();
}
