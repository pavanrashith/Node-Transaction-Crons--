var nemapi = require('nem-api');
//var san = new nemapi('http://san.nem.ninja:7890');
var bob = new nemapi("http://bob.nem.ninja:7890/")


bob.connectWS(function () {
    getNewBlocks();
}, function() {
  console.log("This runs in case of a failure.");
});
module.export = bob;
