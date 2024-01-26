var mysql  = require('mysql');
 
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Micro@123#@",
    database: 'fiveexchange',
    port: '3306',
    dateStrings: true
});
 
var query = function(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null);
        }else{
            conn.query(sql,function(err,results){
                callback(err,results);
            });
            conn.release();
        }
    });
};
 
module.exports = query;