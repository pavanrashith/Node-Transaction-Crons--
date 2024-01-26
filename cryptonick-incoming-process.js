var forever = require('forever-monitor');
  var child = new (forever.Monitor)('--max-old-space-size=8192 incoming-txns.js', {
    max: 3,
    pidFile: 'c://inetpub/vhosts/btrlexchange.com/httpdocs/nodeErrorLog/incoming_eth_app.pid',
    sourceDir: '.',
    watch: true,
    watchDirectory: 'c://inetpub/vhosts/btrlexchange.com/httpdocs/chpz_node',
    watchIgnoreDotFiles: null,
    watchIgnorePatterns: null,
    silent: false, //true,
    args: [],
    logFile: 'c://inetpub/vhosts/btrlexchange.com/httpdocs/nodeErrorLog/incoming_eth_forever1.log',
    outFile: 'c://inetpub/vhosts/btrlexchange.com/httpdocs/nodeErrorLog/incoming_eth_out.log', // Path to log output from child stdout
    errFile: 'c://inetpub/vhosts/btrlexchange.com/httpdocs/nodeErrorLog/incoming_eth_err.log', //Path to log output from child stderr
  });
child.on('watch:restart', function(info) {
    console.error('Restaring script becauses ' + info.file + ' changed');
});
child.on('error:restart', function(info) {
    console.error('Restaring script because ' + info.file + ' changed');
});
child.on('exit:code', function(code) {
    console.error('Forever detected script exited with code ' + code);
});
child.start();



