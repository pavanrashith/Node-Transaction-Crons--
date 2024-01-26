/*var rpc = require('json-rpc2');
var server = rpc.Server.$create();
//server.enableAuth('an', 'pass');
module.exports=server;*/
var rpc = require('jsonrpc2');
var server = new rpc.Server();
var util = require('util');
function add(args, opt, callback) {
  callback(null, args[0] + args[1]);
}
var client = new rpc.Client(8000, 'localhost');

client.call('add', [1, 2], function(err, result) {
    util.puts('1 + 2 = ' + result);
});
server.expose('add', add);
server.listen(3001, 'localhost');
