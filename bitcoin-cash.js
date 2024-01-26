//======== Basic configuration ====//
var express = require('express');
var app = express();
const Client = require('bitcoin-core');
const client = new Client({ network: 'regtest' });
/*const bch = require('bitcoincashjs');
const Address = bch.Address;*/
var BCC = require("bitcoin-cash-rpc");
var BtcCash = new BCC('127.0.0.1', 'amitkumar', 'amit@123', 3001, 3000);
var info =  BtcCash.getInfo();

app.get('/bch-account-generate',function(req,resp){
  resp.send(info);
  //console.log(BtcCash.getNewAddress());
});
 console.log(info);
/*p = Promise.resolve(bcc.getInfo());
 p.then(info=>{
    console.log(info);
 })*/
//======== End configuration ========//

//======= Ends Ethereum Functions =========//
app.listen(3001);
