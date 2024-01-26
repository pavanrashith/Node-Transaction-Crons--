var forever = require('forever-monitor');
  var child = new (forever.Monitor)('index.js', {
    max: 3,
    pidFile: 'xoloex.io/httpdocs/nodeErrorLog/app.pid',
    sourceDir: '.',
    watch: true,
    watchDirectory: 'xoloex.io/httpdocs/chpz_node',
    watchIgnoreDotFiles: null,
    watchIgnorePatterns: null,
    silent: false, //true,
    args: [],
    logFile: 'xoloex.io/httpdocs/nodeErrorLog/forever1.log',
    outFile: 'xoloex.io/httpdocs/nodeErrorLog/out.log', // Path to log output from child stdout
    errFile: 'xoloex.io/httpdocs/nodeErrorLog/err.log', //Path to log output from child stderr
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



