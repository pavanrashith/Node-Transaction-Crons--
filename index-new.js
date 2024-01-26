
//======== Basic configuration ====//
//import Web3 from 'web3';
var express = require('express');
var dateTime = require('node-datetime');
var fs = require('fs');
var app = express();
var MyRNCryptor = require('./rncryptor');
var WAValidator = require('wallet-address-validator');
curl = require('curlrequest');
var math = require('mathjs');
var mysql   = require('./sql');
//======= Start of configuration of Nem ====//
var nemapi = require('nem-api');
var sdknem = require("nem-sdk").default;
NEM   = require('./NEM.js');
var count=0;
var nisconf = {'nis_address': '127.0.0.1'};
var nccconf = {'ncc_address': '127.0.0.1'};
var nem = new NEM(null);
nem.setOptions(nisconf);
nem.setOptions(nccconf);
//======= End of configuration of Nem ====//
const bch = require('bitcoincashjs');
const Address = bch.Address;
const BitpayFormat = Address.BitpayFormat;
const CashAddrFormat = Address.CashAddrFormat;
//==== ripple configuration ====//

//var Ripapi1       = new RippleAPI({ server: 'wss://s1.ripple.com' }) ;
//======== End Ripple ==========//

//======== Ethereum Configuration ====//
var tokens   = require('./tokens');
var bck      = require('eth-balance-checker');
var Web3     = require('web3');
var Eth      = require('web3-eth');
var Accounts = require('web3-eth-accounts');
const net = require('net');
var eth      = new Eth(new Web3.providers.HttpProvider('http://localhost:8545'));
var accounts = new Accounts(new Web3.providers.HttpProvider('http://localhost:8545'));
var web3     = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const IPCweb3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc', net, {}));
var Tx = require('ethereumjs-tx');
var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');
//======== End Ethereum Config ==========//
//======== Tcc Configuration ========//
var ethTcc      = new Eth(new Web3.providers.HttpProvider('http://localhost:8590'));
var accountsTcc = new Accounts(new Web3.providers.HttpProvider('http://localhost:8590'));
var web3Tcc     = new Web3(new Web3.providers.HttpProvider('http://localhost:8590'));
//======== End Tcc Config ==========//
//======== End configuration ========//
var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['SAMEORIGIN']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Content-Type', 'application/json');
    next();
});
Number.prototype.toFixedSpecial = function(n)
{
  var str = this.toFixed(n);
  console.log(str);
  if (str.indexOf('e+') < 0)
    return str;

  // if number is in scientific notation, pick (b)ase and (p)ower
  return str.replace('.', '').split('e+').reduce(function(p, b)
  {
      return p + Array(b - p.length + 2).join(0);
  }); 
};

//===== Ripple Functions====//
function convertArrayToString(Myarray)
{ // convert on address array to string for fetching multiple address balance
    var newaddresses=JSON.stringify(Myarray);
    var newaddresses=newaddresses.slice(1, newaddresses.length - 1);
    var newaddresses=newaddresses.replace(/{"address":/g,'');
    var newaddresses=newaddresses.replace(/}/g,'');
    var newaddresses=newaddresses.replace(/"/g,'');
    return newaddresses;
}
app.get('/pendingTranasactionCount',function(req,resp)
{
  console.log(web3.eth.pendingTransactions);
})
app.get('/erc20-account-balance',function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    var myvar= new Object();
    var balanceOBJ        = new Object();
   
      
        var Myaddress       = '0x8E0A601F11e15041aDCEFA16066136C51611832e';
        var adminaddress    = '';
        var nickname        = 'hubbs';
        console.log(nickname+" getting balance...");
        var contC           = "ContractABI";
        var addrC           = "ContractAddress";
        var newAbi          = nickname+""+contC;
        var newAddress      = nickname+""+addrC;
        //console.log(tokens[newAbi]);
        var ContractABI     = tokens[newAbi];
        var ContractAddress = tokens[newAddress];

        // const contract      = new web3.eth.Contract(ContractABI,ContractAddress, { from: From });
        var tokenContract =  new eth.Contract(ContractABI,ContractAddress);
        tokenContract.methods.balanceOf(Myaddress).call().then(function(balance)
        {
          tokenContract.methods.decimals().call().then(function(decimal)
          { 
             if( adminaddress!=null && adminaddress!=undefined && adminaddress!="")
             {
                const data            = tokenContract.methods.transfer(Myaddress, balance).encodeABI();
                web3.eth.estimateGas({from: Myaddress,to: adminaddress,data: data},function(error,gasAmount)
                {
                   if(!error)
                   {
                      web3.eth.getGasPrice(function(error1, gasPrice)
                      {
                        if(balance && !isNaN(balance) && balance > 0)
                        {
                          if(decimal!=0)
                          {
                            var newBalance=balance/Math.pow(10,decimal);
                          }
                          else
                          {
                            var newBalance=balance;
                          }                                 
                        }
                        else
                        {
                          var newBalance=0;
                        }
                        web3.eth.getBalance(Myaddress, function(err, res)
                        {
                          if(!err)
                          {
                            var ethbalance=web3.utils.fromWei(res,"ether");
                          }
                          else
                          {
                            var ethbalance="0";
                          }
                          var estGas=(Math.round(parseInt(gasAmount)*2.5)).toString();
                          var gasAmountXgasPrice=((parseInt(estGas)*parseInt(gasPrice)).toFixedSpecial(0));
                          var newEstimateGas=web3.utils.fromWei(gasAmountXgasPrice,'ether');
                          myvar.status="1";
                          balanceOBJ.balance= newBalance;
                          balanceOBJ.etherbalance= ethbalance;
                          balanceOBJ.estimategas= newEstimateGas;
                          console.log(JSON.stringify(balanceOBJ));
                          myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                          resp.send(JSON.stringify(myvar)); 
                        });
                      });
                   }
                });
             }else{

                  if(balance && !isNaN(balance) && balance > 0)
                  {
                    if(decimal!=0)
                    {
                      var newBalance=balance/Math.pow(10,decimal);
                    }
                    else
                    {
                      var newBalance=balance;
                    }                                 
                  }
                  else
                  {
                    var newBalance=0;
                  }
                  web3.eth.getBalance(Myaddress, function(err, res)
                  {
                    if(!err)
                    {
                      var ethbalance=web3.utils.fromWei(res,"ether");
                    }
                    else
                    {
                      var ethbalance="0";
                    }
                   
                    myvar.status="1";
                    balanceOBJ.balance= newBalance;
                    balanceOBJ.etherbalance= ethbalance;
                    console.log(JSON.stringify(balanceOBJ));
                    myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                    resp.send(JSON.stringify(myvar)); 
                  });              
             }
          });
        });
      
})
app.get('/check-connection',(req,resp)=>
{
  
  //ehter console.log(web3.utils.fromWei('0x13fbe85edc90000',"ether"));
  web3.eth.getTransaction('0xcb2a1a8a3cc7179f48d91761b6723a7e684167c951b9d8dfc646e9d1e2d134d2').then(function (TransactionStatus,error)
  {
      if(!error)
      {
          if(TransactionStatus.blockHash!=null)
          { 
              web3.eth.getTransactionReceipt('0xcb2a1a8a3cc7179f48d91761b6723a7e684167c951b9d8dfc646e9d1e2d134d2').then(function (receipt)
              {
                 console.log('receipt=>',receipt)
                    /*if(receipt!=null)
                    {
                       
                    }
                    else
                    {
                        myvar.status="0";
                        myvar.message="No Record Found.";
                        resp.send(JSON.stringify(myvar));
                    }*/
              });
          }
          else
          {
             console.log('error3')
          }
      }
      else
      {
          console.log('error2 =>',error)

      }
  });
  /*mysql.con.connect((err)=> 
  {
    //if (err) throw err;
    mysql.con.query("SELECT MAX(blockNumber) as blockNumber FROM ether_transactions", function (err, result, fields)
    {
      //if (err) throw err;
      web3.eth.getBlockNumber(function(error,liveBlockNumber)
      { 
        for (var i = result[0].blockNumber; i <= liveBlockNumber; i++) 
        {
          web3.eth.getBlock(i,function(error,response)
          {
            //console.log(response.transactions);
            response.transactions.forEach(function(element)
            {
              mysql.con.query("SELECT transactionHash FROM ether_transactions WHERE transactionHash ="+element, function (err, result, fields)
              {
                if(result.length ==0)
                {
                  web3.eth.getTransactionReceipt(element,function(error,response1)
                  {
                    console.log(response1);
                    var transactionHash=response1.transactionHash;
                    var blockNumber=response1.blockNumber;
                    var blockHash=response1.blockHash;
                    //var timeStamp=response1;
                    if(response1.logs.length>0)
                    {

                      var contractAddress=response1.logs[0].address;
                      var value=web3.eth.abi.decodeParameter('uint256', response1.logs[0].data);
                      var toAddress=web3.eth.abi.decodeParameter('address', response1.logs[0].topics[2]);
                    }
                    else
                    {

                    }
                    // var fromAddress=response1;
                    // var toAddress=response1;
                    // var value=response1;
                      // var sql = "INSERT INTO ether_transactions (transactionHash, blockNumber,blockHash,timeStamp,contractAddress,fromAddress,toAddress,value) VALUES ('Company Inc', 'Highway 37')";
                      // con.query(sql, function (err, result) {
                      //   if (err) throw err;
                      //   console.log("1 record inserted");
                      // });
                  })
                }
              })
            })
          });
        }
      });
    });
  });*/
});
app.listen(43213);
