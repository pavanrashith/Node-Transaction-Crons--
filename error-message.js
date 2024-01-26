 { Error: connect ECONNREFUSED 127.0.0.1:22556
 at Object._errnoException (util.js:1022:11)
 at _exceptionWithHostPort (util.js:1044:20)
 at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1182:14)
 code: 'ECONNREFUSED',
 errno: 'ECONNREFUSED',
 syscall: 'connect',
 address: '127.0.0.1',
 port: 22556
  }

var dogeconfig={
host: '127.0.0.1',
port: 22556,
user: 'aniek2wet232!',
pass: 'anil2332',
}
var dogecoin = require('node-dogecoin')(dogeconfig);
