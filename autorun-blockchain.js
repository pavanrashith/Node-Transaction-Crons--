/*var Service = require('node-windows').Service;
// Create a new service object
var blockchainWalletServiceStart = new Service({
	name:'cryptBlockchainWallet',
   description: 'start blockchain wallet service.',
   script: 'C:\\inetpub\\vhosts\\default\\htdocs\\chpz_node\\blockchainwalletstart.js'
});
// Listen for the "install" event, which indicates the
// process is available as a service.
blockchainWalletServiceStart.on('install',function(){
  blockchainWalletServiceStart.start();
});

// Listen for the "start" event and let us know when the
// process has actually started working.
blockchainWalletServiceStart.on('start',function(){
  console.log(blockchainWalletServiceStart.name+' started!\nVisit http://127.0.0.1:3000 to see it in action.');
});

// Install the script as a service.
blockchainWalletServiceStart.install();*/