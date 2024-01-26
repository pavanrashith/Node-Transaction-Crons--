  var express = require('express');
  var fs = require('fs');
  var app = express();
  var Eth      = require('web3-eth');
  var Web3     = require('web3');
  var Accounts = require('web3-eth-accounts');
  var eth      = new Eth(new Web3.providers.HttpProvider('http://localhost:8545'));
  var accounts = new Accounts(new Web3.providers.HttpProvider('http://localhost:8545'));
  var web3     = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  var Tx 	   = require('ethereumjs-tx');
  var Wallet   = require('ethereumjs-wallet');
  var EthUtil  = require('ethereumjs-util');


  app.get('/eth-account-generate', function(req,resp)
  {
          var myvar= new Object();
          var out=accounts.create(); // create adderss here
          var outputOBJ= new Object();
          outputOBJ.address=out.address;
          outputOBJ.privateKey=out.privateKey;
          myvar.status="1";
          myvar.response=outputOBJ;
          resp.send(JSON.stringify(myvar));
  });

 app.get('/eth-generate-wallet', function(req,resp)
 {
          var myvar= new Object();
          var out=accounts.wallet.create(1); 
          console.log(out);
 });


 app.get('/eth-wallet-add', function(req,resp)
 {
          var myvar= new Object();
          var out=accounts.wallet.add('0x22134a17ee867499e2ec3f99d1fbc5ada6cce777c37ae201bb73a249b7958d7f'); 
          console.log(out);
 });


 app.get('/eth-wallet-save', function(req,resp)
 {
          var myvar= new Object();
          var out=accounts.wallet.save('Tasleem Ali'); 
          console.log(out);
 });

 app.get('/eth-wallet-load', function(req,resp)
 {
          //var myvar= new Object();
          //var out=accounts.wallet; 
          //console.log(out);
          console.log(eth.accounts);
 });


  app.listen(8384);