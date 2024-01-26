var express = require('express');
var dateTime = require('node-datetime');
var fs = require('fs');
var app = express();
var MyRNCryptor = require('./rncryptor');
var WAValidator = require('wallet-address-validator');
curl = require('curlrequest');
var math = require('mathjs');
var litecoin = require('node-litecoin');
var dogecoin = require('node-dogecoin');
var nemapi = require('nem-api');
var sdknem = require("nem-sdk").default;
NEM		= require('./NEM.js');
var count=0;
var nisconf = {'nis_address': '127.0.0.1'};
var nccconf = {'ncc_address': '127.0.0.1'};
var nem = new NEM(null);
nem.setOptions(nisconf);
nem.setOptions(nccconf);

var RippleAPI = require('ripple-lib').RippleAPI

var Web3     = require('web3');
var Eth      = require('web3-eth');
var Accounts = require('web3-eth-accounts');

// var eth      = new Eth(new Web3.providers.HttpProvider('http://localhost:8545'));
// var accounts = new Accounts(new Web3.providers.HttpProvider('http://localhost:8545'));
// var web3     = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// var eth1      = new Eth(new Web3.providers.HttpProvider('https://billowing-red-pine.discover.quiknode.pro/70e3f24573fab66c69a7fe4bf3cf88d3ffd5b13c/'));
// var accounts1 = new Accounts(new Web3.providers.HttpProvider('https://billowing-red-pine.discover.quiknode.pro/70e3f24573fab66c69a7fe4bf3cf88d3ffd5b13c/'));
// var web31     = new Web3(new Web3.providers.HttpProvider('https://billowing-red-pine.discover.quiknode.pro/70e3f24573fab66c69a7fe4bf3cf88d3ffd5b13c/'));
var eth      = new Eth(new Web3.providers.HttpProvider('https://late-flashy-sponge.discover.quiknode.pro/32b94b3ede17ce2abd1a6ae8aecfd84972660c2e/'));
var accounts = new Accounts(new Web3.providers.HttpProvider('https://late-flashy-sponge.discover.quiknode.pro/32b94b3ede17ce2abd1a6ae8aecfd84972660c2e/'));
var web3     = new Web3(new Web3.providers.HttpProvider('https://late-flashy-sponge.discover.quiknode.pro/32b94b3ede17ce2abd1a6ae8aecfd84972660c2e/'));

var ethFSC      = new Eth(new Web3.providers.HttpProvider('http://localhost:8585'));
var accountsFSC = new Accounts(new Web3.providers.HttpProvider('http://localhost:8585'));
var web3FSC     = new Web3(new Web3.providers.HttpProvider('http://localhost:8585'));

var ethTcc      = new Eth(new Web3.providers.HttpProvider('http://localhost:8505'));
var accountsTcc = new Accounts(new Web3.providers.HttpProvider('http://localhost:8505'));
var web3Tcc     = new Web3(new Web3.providers.HttpProvider('http://localhost:8505'));

var ethBsc      = new Eth(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));  // +++++ //
var accountsBsc = new Accounts(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/')); // +++++ //
var web3Bsc     = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/')); // +++++ //


var ethBscTestnet      = new Eth(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));  // +++++ //
var accountsBscTestnet = new Accounts(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/')); // +++++ //
var web3BscTestnet    = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/')); // +++++ //

var client = new litecoin.Client({
    host: 'localhost',
    port: 19332,
    user: 'litecoin@gaffer',
    pass: 'Tas@@Shankar123$'
});

var dogecoin = new dogecoin({
    host: 'localhost',
    port: 19333,
    user: 'dogecoin@gaffer',
    pass: 'Tas@@Shankar123$'
});

var btc = new litecoin.Client({
    host: 'localhost',
    port: 19334,
    user: 'bitcoin@gaffer',
    pass: 'Tas@@Shankar123$'
});
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const ethers = require('ethers')
const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;
const ADDRESS_PREFIX = "41";
var tokensfsc   = require('./tokensfsc');
var tokens   	= require('./tokenserc20');
var tokenstrc   = require('./tokenstrc20');
var tokensbep   = require('./tokensbep20');  // +++++ //

var Tx          = require('ethereumjs-tx');
var Wallet      = require('ethereumjs-wallet');
var EthUtil     = require('ethereumjs-util');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['SAMEORIGIN']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Content-Type', 'application/json');
    next();
});
Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0];
    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;
    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;
    while(mag--) z += '0';
    return str + z;
}
Number.prototype.toFixedSpecial=function(n)
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
 function mytoFixed(num, fixed)
 {
      num = num.toString(); //If it's not already a String
      num = (num.indexOf('.')<0)?num+'.'+'00000000': num+''+'00000000';
      num = num.slice(0, (num.indexOf("."))+fixed+1); //With 3 exposing the hundredths place
      return num;
}

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}
 
  //====== Ether Functions ==========//
app.get('/eth1-account-generate', function(req,resp)
{
  var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
   console.log("eth generating address...");
    var myvar= new Object();
    
        var out=accounts1.create(); // create adderss here
        var outputOBJ= new Object();
        outputOBJ.address=out.address;
        outputOBJ.privateKey=out.privateKey;
        //console.log(newPrvtkey);
        var newprivkey=(out.privateKey).toString();
        var newEthSLPwd=(req.query.EthSLPwd).toString();
        sLocal(newprivkey,newEthSLPwd,type='eth');
        //console.log(out);
        myvar.status="1";
        myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
        resp.send(JSON.stringify(myvar));
      
});
app.get('/eth1-account-balance', function(req,resp)
{
	var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
	console.log("eth getting balance...");
	var myvar= new Object();
	const Myaddress = req.query.Myaddress;
	 web31.eth.getBalance(Myaddress, function(err, res){
	  if(!err)
	  {
		console.log('Myaddress=> '+Myaddress);
	   // console.log(res);
		myvar.status="1";
		var balanceOBJ=new Object();
	   // var balance1 =  res.toNumber();
		var balance1 =  parseInt(res);
		var balance2 = balance1/1000000000000000000;
		balanceOBJ.balance=balance2.toFixed(8);

		myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
	  }
	  else
	  {
		myvar.status="0";
		myvar.message=err;
	  }
	  console.log(JSON.stringify(balanceOBJ));
	  //resp.send(JSON.stringify(myvar));
	  resp.send(JSON.stringify(balanceOBJ));
	});
    
});
app.get('/eth1-transfer', function(req,resp)
{
	var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
	console.log("eth transaction running...");
	const From            = req.query.from
	const To              = req.query.to
	const Amount          = req.query.amount
	const Type            = req.query.type
	const FromPrivateKey  = (req.query.fromPrivateKey).substring(2);
	const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex')
	var balanceOBJ        = new Object();
	web31.eth.getBalance(From, function(err, res)
	{
	  if(!err)
	  {
		web31.eth.getGasPrice(function(error1, gasPrice)
		{
			var estGas=21000;
			console.log('gasPrice=> ',gasPrice);
			var gasPrice= gasPrice*5;//+(gasPrice/8);
			console.log('gasPrice1=> ',gasPrice);
			var fe1 = gasPrice*estGas;
			if(Type=='Move')
			{
			  
				var tfrAmount                 = web31.utils.toWei((math.bignumber(Amount)).toString(),"ether");
				var newTransferAmount         = math.format(tfrAmount-(fe1*2), {notation: 'fixed'});

			}
			else if(Type=='Withdraw')
			{
				var tfrAmount             =  web31.utils.toWei((math.bignumber(Amount.noExponents()).toString()),"ether");
				var newTransferAmount     = tfrAmount;
			}
			else
			{
				 var newTransferAmount=0;
			}
			console.log("newTransferAmount=>",newTransferAmount);
			if(newTransferAmount > 0)
			{
				web31.eth.getTransactionCount(From, "pending", (error3, txCount) =>
				{
					 console.log('txCount=> ',txCount);
					 var newTransferAmount1    = newTransferAmount.toString();
					 const txObject = {
										nonce     : web31.utils.toHex((txCount)),
										to        : To,
										from      : From,
										value     : web31.utils.toHex(newTransferAmount1),
										gasLimit  : web31.utils.toHex(estGas),
										gasPrice  : web31.utils.toHex(gasPrice),
										//gasPrice  : web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
									  }
					const tx = new Tx(txObject)
					tx.sign(FromPrivateKey1)
					const serializedTx = tx.serialize()
					const raw = '0x' + serializedTx.toString('hex')
					web31.eth.sendSignedTransaction(raw, (error4, txHash) =>
					{
					  if(!error4)
					  {
						myvar.status    = "1";
						balanceOBJ.txid = txHash;
						console.log(txHash);
						myvar.message   = "Transaction Pending.";
						myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
						resp.send(JSON.stringify(myvar));
					  }
					  else
					  {
						 var newError= error4.toString();
						 console.log("newError: "+ newError);
						 myvar.status="0";
						 myvar.message=newError.replace("Error: Returned error: ", "");;
						 resp.send(JSON.stringify(myvar));
					  }
					})
				})
			}
			else
			{
			  myvar.status="0";
			  myvar.message="Something Wrong.";
			  resp.send(JSON.stringify(myvar));
			}
		 })
	  }
	  else
	  {
		 myvar.status="0";
		 myvar.message="Something Wrong.";
		 resp.send(JSON.stringify(myvar));
	  }
	});
   
});

app.get('/eth1-transaction-status', function(req,resp)
{
    var myvar= new Object();
	var dt = dateTime.create();
	dt.format('m/d/Y H:M:S');
	console.log(new Date(dt.now()));
//	const transactionHash = req.body.transactionHash;//
	const transactionHash = req.query.transactionHash;
	console.log(transactionHash);
	web31.eth.getTransaction(transactionHash).then(function (TransactionStatus,error)
	{
		if(!error)
		{
			if(TransactionStatus.blockHash!=null)
			{
				web31.eth.getTransactionReceipt(transactionHash).then(function (receipt)
				{
					  if(receipt!=null)
					  {
						  if(receipt.status)
						  {
							  myvar.status="1";
							  myvar.message="Success.";
							  resp.send(JSON.stringify(myvar));
						  }
						  else
						  {
							  myvar.status="2";
							  myvar.message="Failed.";
							  resp.send(JSON.stringify(myvar));
						  }
					  }
					  else
					  {
						  myvar.status="0";
						  myvar.message="No Record Found.";
						  resp.send(JSON.stringify(myvar));
					  }
				});
			}
			else
			{
			   myvar.status="3";
			   myvar.message="Pending.";
			   resp.send(JSON.stringify(myvar));
			}
		}
		else
		{
			myvar.status="3";
			myvar.message="Pending.";
			resp.send(JSON.stringify(myvar));
		}
	}).catch(error=>{
			myvar.status='3';
			myvar.message="Pending.";
			resp.send(JSON.stringify(myvar));
	});
        
});

 //====== BNB binabce smart chain Testnet Functions ==========// // +++++ //
 app.get('/bnb-testnet-account-generate', function(req,resp)
 {
   var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
    console.log("bnb generating address...");
     var myvar= new Object();
     if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
     {
       myvar.status="0";
       myvar.message="Invalid Request.";
       resp.send(JSON.stringify(myvar));
     }
     else
     {
       var token = JSON.stringify(req.headers['x-token']);
       if(MyRNCryptor.authentication(token))
       {
         var out=accountsBscTestnet.create(); // create adderss here
         var outputOBJ= new Object();
         outputOBJ.address=out.address;
         outputOBJ.privateKey=out.privateKey;
         console.log(out.privateKey);
         //var newprivkey=(out.privateKey).toString();
         //var newEthSLPwd=(req.query.EthSLPwd).toString();
        // sLocal(newprivkey,newEthSLPwd,type='bnb');
         //console.log(out);
         myvar.status="1";
         myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
         resp.send(JSON.stringify(myvar));
       }
       else
       {
           myvar.status="0";
           myvar.message="Invalid Request.";
           resp.send(JSON.stringify(myvar));
       }
     }
 });
 app.get('/bnb-testnet-wallet-generate', function(req,resp)
 {
   var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
    console.log("bnb generating address...");
     var myvar= new Object();
     if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
     {
       myvar.status="0";
       myvar.message="Invalid Request.";
       resp.send(JSON.stringify(myvar));
     }
     else
     {
       var token = JSON.stringify(req.headers['x-token']);
       if(MyRNCryptor.authentication(token))
       {
		   //web3.eth.accounts.wallet.create(2,
         var out=web3BscTestnet.accounts.wallet.create(2); // create adderss here
         var outputOBJ= new Object();
         outputOBJ.address=out.address;
         outputOBJ.privateKey=out.privateKey;
         console.log(out.privateKey);
         //var newprivkey=(out.privateKey).toString();
         //var newEthSLPwd=(req.query.EthSLPwd).toString();
        // sLocal(newprivkey,newEthSLPwd,type='bnb');
         //console.log(out);
         myvar.status="1";
         myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
         resp.send(JSON.stringify(myvar));
       }
       else
       {
           myvar.status="0";
           myvar.message="Invalid Request.";
           resp.send(JSON.stringify(myvar));
       }
     }
 });
 app.post('/bnb-testnet-account-balance', function(req,resp)
 {
   var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
   console.log("bnb getting balance...");
   var myvar= new Object();
   if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
   {
     myvar.status="0";
     myvar.message="Invalid Request.";
     resp.send(JSON.stringify(myvar));
   }
   else
   {
     var Myaddress = req.body.address;
     var token = JSON.stringify(req.headers['x-token']);
     if(MyRNCryptor.authentication(token))
     {
          web3BscTestnet.eth.getBalance(Myaddress, function(err, res){
           if(!err)
           {
             console.log('Myaddress=> '+Myaddress);
            // console.log(res);
             myvar.status="1";
             var balanceOBJ=new Object();
            // var balance1 =  res.toNumber();
             var balance1 =  parseInt(res);
             var balance2 = balance1/1000000000000000000;
             balanceOBJ.balance=balance2.toFixed(8);
 
             myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
           }
           else
           {
             myvar.status="0";
             myvar.message=err;
           }
           console.log(JSON.stringify(balanceOBJ));
           resp.send(JSON.stringify(myvar));
         });
     }
     else
     {
         myvar.status="0";
         myvar.message="Invalid Request.";
         resp.send(JSON.stringify(myvar));
     }
   }
 });
 app.post('/bnb-testnet-transfer', function(req,resp)
 {
   var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
   console.log("bnb transaction running...");
 
   var myvar= new Object();
   if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
   {
     myvar.status="0";
     myvar.message="Invalid Request.";
     resp.send(JSON.stringify(myvar));
   }
   else
   {
     var token = JSON.stringify(req.headers['x-token']);
     if(MyRNCryptor.authentication(token))
     {
       const From            = req.body.from
       const To              = req.body.to
       const Amount          = req.body.amount
       const Type            = req.body.type
       const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
       const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex')
       var balanceOBJ        = new Object();
       web3BscTestnet.eth.getBalance(From, function(err, res)
       {
           if(!err)
           {
             web3BscTestnet.eth.getGasPrice(function(error1, gasPrice)
             {
                 var estGas=21000;
                 console.log('gasPrice=> ',gasPrice);
                 var gasPrice= gasPrice*5;//+(gasPrice/8);
                 console.log('gasPrice1=> ',gasPrice);
                 var fe1 = gasPrice*estGas;
                 if(Type=='Move')
                 {
                   
                     var tfrAmount                 = web3BscTestnet.utils.toWei((math.bignumber(Amount)).toString(),"ether");
                     var newTransferAmount         = math.format(tfrAmount-fe1, {notation: 'fixed'});
 
                 }
                 else if(Type=='Withdraw')
                 {
                     var tfrAmount             =  web3BscTestnet.utils.toWei((math.bignumber(Amount.noExponents()).toString()),"ether");
                     var newTransferAmount     = tfrAmount;
                 }
                 else
                 {
                      var newTransferAmount=0;
                 }
                 console.log("newTransferAmount=>",newTransferAmount);
                 if(newTransferAmount > 0)
                 {
                     web3BscTestnet.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                     {
                          console.log('txCount=> ',txCount);
                          var newTransferAmount1    = newTransferAmount.toString();
                          const txObject = {
                                             nonce     : web3BscTestnet.utils.toHex((txCount)),
                                             to        : To,
                                             from      : From,
                                             value     : web3BscTestnet.utils.toHex(newTransferAmount1),
                                             gasLimit  : web3BscTestnet.utils.toHex(estGas),
                                             gasPrice  : web3BscTestnet.utils.toHex(gasPrice),
                                             chainId   : 97
                                             //gasPrice  : web3BscTestnet.utils.toHex(web3Bsc.utils.toWei('100', 'gwei')),
                                           }
                         const tx = new Tx(txObject)
                         tx.sign(FromPrivateKey1)
                         const serializedTx = tx.serialize()
                         const raw = '0x' + serializedTx.toString('hex')
                         web3BscTestnet.eth.sendSignedTransaction(raw, (error4, txHash) =>
                         {
                           if(!error4)
                           {
                             myvar.status    = "1";
                             balanceOBJ.txid = txHash;
                             console.log(txHash);
                             myvar.message   = "Transaction Pending.";
                             myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                             resp.send(JSON.stringify(myvar));
                           }
                           else
                           {
                              var newError= error4.toString();
                              //console.log("newError: "+ newError);
                              myvar.status="0";
                              myvar.message=newError.replace("Error: Returned error: ", "");;
                              resp.send(JSON.stringify(myvar));
                           }
                         })
                     })
                 }
                 else
                 {
                   myvar.status="0";
                   myvar.message="Something Wrong.";
                   resp.send(JSON.stringify(myvar));
                 }
              })
           }
           else
           {
              myvar.status="0";
              myvar.message="Something Wrong.";
              resp.send(JSON.stringify(myvar));
           }
       });
     }
     else
     {
         myvar.status="0";
         myvar.message="Invalid Request.";
         resp.send(JSON.stringify(myvar));
     }
   }
 });
 app.post('/bnb-testnet-transaction-status', function(req,resp)
 {
     var myvar= new Object();
 
     if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
     {
       myvar.status="0";
       myvar.message="Invalid Request.";
       resp.send(JSON.stringify(myvar));
     }
     else
     {
         var token = JSON.stringify(req.headers['x-token']);
         if(MyRNCryptor.authentication(token))
         {
           var dt = dateTime.create();
           dt.format('m/d/Y H:M:S');
             console.log(new Date(dt.now()));
             const transactionHash = req.body.transactionHash;
             console.log(transactionHash);
             web3Bsc.eth.getTransaction(transactionHash).then(function (TransactionStatus,error)
             {
                 if(!error)
                 {
                     if(TransactionStatus.blockHash!=null)
                     {
                         web3Bsc.eth.getTransactionReceipt(transactionHash).then(function (receipt)
                         {
                               if(receipt!=null)
                               {
                                   if(receipt.status)
                                   {
                                       myvar.status="1";
                                       myvar.message="Success.";
                                       resp.send(JSON.stringify(myvar));
                                   }
                                   else
                                   {
                                       myvar.status="2";
                                       myvar.message="Failed.";
                                       resp.send(JSON.stringify(myvar));
                                   }
                               }
                               else
                               {
                                   myvar.status="0";
                                   myvar.message="No Record Found.";
                                   resp.send(JSON.stringify(myvar));
                               }
                         });
                     }
                     else
                     {
                        myvar.status="3";
                        myvar.message="Pending.";
                        resp.send(JSON.stringify(myvar));
                     }
                 }
                 else
                 {
                     myvar.status="3";
                     myvar.message="Pending.";
                     resp.send(JSON.stringify(myvar));
                 }
             }).catch(error=>{
                     myvar.status='3';
                     myvar.message="Pending.";
                     resp.send(JSON.stringify(myvar));
             });
         }
         else
         {
             myvar.status="0";
             myvar.message="Invalid Request.";
             resp.send(JSON.stringify(myvar));
         }
     }
 });

 //====== BNB binabce smart chain Functions ==========// // +++++ //
 app.get('/bnb-account-generate', function(req,resp)
 {
   var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
    console.log("bnb generating address...");
     var myvar= new Object();
     if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
     {
       myvar.status="0";
       myvar.message="Invalid Request.";
       resp.send(JSON.stringify(myvar));
     }
     else
     {
       var token = JSON.stringify(req.headers['x-token']);
       if(MyRNCryptor.authentication(token))
       {
         var out=accountsBsc.create(); // create adderss here
         var outputOBJ= new Object();
         outputOBJ.address=out.address;
         outputOBJ.privateKey=out.privateKey;
         console.log(out.privateKey);
         //var newprivkey=(out.privateKey).toString();
         //var newEthSLPwd=(req.query.EthSLPwd).toString();
        // sLocal(newprivkey,newEthSLPwd,type='bnb');
         //console.log(out);
         myvar.status="1";
         myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
         resp.send(JSON.stringify(myvar));
       }
       else
       {
           myvar.status="0";
           myvar.message="Invalid Request.";
           resp.send(JSON.stringify(myvar));
       }
     }
 });
 app.post('/bnb-account-balance', function(req,resp)
 {
   var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
   console.log("bnb getting balance...");
   var myvar= new Object();
   if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
   {
     myvar.status="0";
     myvar.message="Invalid Request.";
     resp.send(JSON.stringify(myvar));
   }
   else
   {
     var Myaddress = req.body.address;
     var token = JSON.stringify(req.headers['x-token']);
     if(MyRNCryptor.authentication(token))
     {
          web3Bsc.eth.getBalance(Myaddress, function(err, res){
           if(!err)
           {
             console.log('Myaddress=> '+Myaddress);
            // console.log(res);
             myvar.status="1";
             var balanceOBJ=new Object();
            // var balance1 =  res.toNumber();
             var balance1 =  parseInt(res);
             var balance2 = balance1/1000000000000000000;
             balanceOBJ.balance=balance2.toFixed(8);
 
             myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
           }
           else
           {
             myvar.status="0";
             myvar.message=err;
           }
           console.log(JSON.stringify(balanceOBJ));
           resp.send(JSON.stringify(myvar));
         });
     }
     else
     {
         myvar.status="0";
         myvar.message="Invalid Request.";
         resp.send(JSON.stringify(myvar));
     }
   }
 });
 app.post('/bnb-transfer', function(req,resp)
 {
   var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
   console.log("bnb transaction running...");
 
   var myvar= new Object();
   if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
   {
     myvar.status="0";
     myvar.message="Invalid Request.";
     resp.send(JSON.stringify(myvar));
   }
   else
   {
     var token = JSON.stringify(req.headers['x-token']);
     if(MyRNCryptor.authentication(token))
     {
       const From            = req.body.from
       const To              = req.body.to
       const Amount          = req.body.amount
       const Type            = req.body.type
       const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
       const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex')
       var balanceOBJ        = new Object();
       web3Bsc.eth.getBalance(From, function(err, res)
       {
           if(!err)
           {
             web3Bsc.eth.getGasPrice(function(error1, gasPrice)
             {
                 var estGas=21000;
                 console.log('gasPrice=> ',gasPrice);
                 var gasPrice= gasPrice*5;//+(gasPrice/8);
                 console.log('gasPrice1=> ',gasPrice);
                 var fe1 = gasPrice*estGas;
                 if(Type=='Move')
                 {
                   
                     var tfrAmount                 = web3Bsc.utils.toWei((math.bignumber(Amount)).toString(),"ether");
                     var newTransferAmount         = math.format(tfrAmount-fe1, {notation: 'fixed'});
 
                 }
                 else if(Type=='Withdraw')
                 {
                     var tfrAmount             =  web3Bsc.utils.toWei((math.bignumber(Amount.noExponents()).toString()),"ether");
                     var newTransferAmount     = tfrAmount;
                 }
                 else
                 {
                      var newTransferAmount=0;
                 }
                 console.log("newTransferAmount=>",newTransferAmount);
                 if(newTransferAmount > 0)
                 {
                     web3Bsc.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                     {
                          console.log('txCount=> ',txCount);
                          var newTransferAmount1    = newTransferAmount.toString();
                          const txObject = {
                                             nonce     : web3Bsc.utils.toHex((txCount)),
                                             to        : To,
                                             from      : From,
                                             value     : web3Bsc.utils.toHex(newTransferAmount1),
                                             gasLimit  : web3Bsc.utils.toHex(estGas),
                                             gasPrice  : web3Bsc.utils.toHex(gasPrice),
                                             chainId   : 56
                                             //gasPrice  : web3Bsc.utils.toHex(web3Bsc.utils.toWei('100', 'gwei')),
                                           }
                         const tx = new Tx(txObject)
                         tx.sign(FromPrivateKey1)
                         const serializedTx = tx.serialize()
                         const raw = '0x' + serializedTx.toString('hex')
                         web3Bsc.eth.sendSignedTransaction(raw, (error4, txHash) =>
                         {
                           if(!error4)
                           {
                             myvar.status    = "1";
                             balanceOBJ.txid = txHash;
                             console.log(txHash);
                             myvar.message   = "Transaction Pending.";
                             myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                             resp.send(JSON.stringify(myvar));
                           }
                           else
                           {
                              var newError= error4.toString();
                              //console.log("newError: "+ newError);
                              myvar.status="0";
                              myvar.message=newError.replace("Error: Returned error: ", "");;
                              resp.send(JSON.stringify(myvar));
                           }
                         })
                     })
                 }
                 else
                 {
                   myvar.status="0";
                   myvar.message="Something Wrong.";
                   resp.send(JSON.stringify(myvar));
                 }
              })
           }
           else
           {
              myvar.status="0";
              myvar.message="Something Wrong.";
              resp.send(JSON.stringify(myvar));
           }
       });
     }
     else
     {
         myvar.status="0";
         myvar.message="Invalid Request.";
         resp.send(JSON.stringify(myvar));
     }
   }
 });
 app.post('/bnb-transaction-status', function(req,resp)
 {
     var myvar= new Object();
 
     if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
     {
       myvar.status="0";
       myvar.message="Invalid Request.";
       resp.send(JSON.stringify(myvar));
     }
     else
     {
         var token = JSON.stringify(req.headers['x-token']);
         if(MyRNCryptor.authentication(token))
         {
           var dt = dateTime.create();
           dt.format('m/d/Y H:M:S');
             console.log(new Date(dt.now()));
             const transactionHash = req.body.transactionHash;
             console.log(transactionHash);
             web3Bsc.eth.getTransaction(transactionHash).then(function (TransactionStatus,error)
             {
                 if(!error)
                 {
                     if(TransactionStatus.blockHash!=null)
                     {
                         web3Bsc.eth.getTransactionReceipt(transactionHash).then(function (receipt)
                         {
                               if(receipt!=null)
                               {
                                   if(receipt.status)
                                   {
                                       myvar.status="1";
                                       myvar.message="Success.";
                                       resp.send(JSON.stringify(myvar));
                                   }
                                   else
                                   {
                                       myvar.status="2";
                                       myvar.message="Failed.";
                                       resp.send(JSON.stringify(myvar));
                                   }
                               }
                               else
                               {
                                   myvar.status="0";
                                   myvar.message="No Record Found.";
                                   resp.send(JSON.stringify(myvar));
                               }
                         });
                     }
                     else
                     {
                        myvar.status="3";
                        myvar.message="Pending.";
                        resp.send(JSON.stringify(myvar));
                     }
                 }
                 else
                 {
                     myvar.status="3";
                     myvar.message="Pending.";
                     resp.send(JSON.stringify(myvar));
                 }
             }).catch(error=>{
                     myvar.status='3';
                     myvar.message="Pending.";
                     resp.send(JSON.stringify(myvar));
             });
         }
         else
         {
             myvar.status="0";
             myvar.message="Invalid Request.";
             resp.send(JSON.stringify(myvar));
         }
     }
 });
 //====== BEP20 Comman Function ==========// // +++++ //
 app.get('/bep20-account-generate',function(req,resp)
 {
     var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
     var myvar= new Object();
     if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
     {
       myvar.status="0";
       myvar.message="Invalid Request.";
       resp.send(JSON.stringify(myvar));
     }
     else
     {
       var token = JSON.stringify(req.headers['x-token']);
       if(MyRNCryptor.authentication(token))
       {
          console.log("bep20 (binance) generating address...");
          var out=accountsBsc.create(); // create adderss here
          var outputOBJ= new Object();
          outputOBJ.address=out.address;
          outputOBJ.privateKey=out.privateKey;
         //var newprivkey=(out.privateKey).toString();
          //var newEthSLPwd=(req.query.EthSLPwd).toString();
          //sLocal(newprivkey,newEthSLPwd,type='fsc');
          myvar.status="1";
          myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
          resp.send(JSON.stringify(myvar));
       }
       else
       {
           myvar.status="0";
           myvar.message="Invalid Request.";
           resp.send(JSON.stringify(myvar));
       }
     }
 })
 app.post('/bep20-account-balance',function(req,resp)
 {
     var dt = dateTime.create();
     dt.format('m/d/Y H:M:S');
     console.log(new Date(dt.now()));
     var myvar= new Object();
     var balanceOBJ        = new Object();
     if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
     {
       myvar.status="0";
       myvar.message="Invalid Request.";
       resp.send(JSON.stringify(myvar));
     }
     else 
     {
       var token = JSON.stringify(req.headers['x-token']);
       if(MyRNCryptor.authentication(token))
       {
         var Myaddress       = req.body.address;
         var adminaddress    = req.body.adminaddress;
         var nickname        = ((req.body.nickname).toString()).toLowerCase();
         console.log(Myaddress);
         console.log(nickname + " getting balance...");
         var contC           = "ContractABI";
         var addrC           = "ContractAddress";
         var newAbi          = contC+""+nickname;
         var newAddress      = addrC+""+nickname;
         var ContractABI     = tokensbep[newAbi];
         var ContractAddress = tokensbep[newAddress];
		 
         var tokenContract =  new ethBsc.Contract(ContractABI,ContractAddress);
         tokenContract.methods.balanceOf(Myaddress).call().then(function(balance)
         {
           tokenContract.methods.decimals().call().then(function(decimal)
           {
              if( adminaddress!=null && adminaddress!=undefined && adminaddress!="")
              {
                 const data            = tokenContract.methods.transfer(Myaddress, balance).encodeABI();
                 web3Bsc.eth.estimateGas({from: Myaddress,to: adminaddress,data: data},function(error,gasAmount)
                 {
                    if(!error)
                    {
                       web3Bsc.eth.getGasPrice(function(error1, gasPrice)
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
                         web3Bsc.eth.getBalance(Myaddress, function(err, res)
                         {
                           if(!err)
                           {
                             var ethbalance=web3Bsc.utils.fromWei(res,"ether");
                           }
                           else
                           {
                             var ethbalance="0";
                           }
                           var estGas=(Math.round(parseInt(gasAmount)*2.5)).toString();
                           var gasAmountXgasPrice=((parseInt(estGas)*parseInt(gasPrice)).toFixedSpecial(0));
                           var newEstimateGas=web3Bsc.utils.fromWei(gasAmountXgasPrice,'ether');
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
                   web3Bsc.eth.getBalance(Myaddress, function(err, res)
                   {
                     if(!err)
                     {
                       var ethbalance=web3Bsc.utils.fromWei(res,"ether");
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
        
       }
       else
       {
           myvar.status="0";
           myvar.message="Invalid Request.";
           resp.send(JSON.stringify(myvar));
       }
     }
 });
 
 app.post('/bep20-transfer',function(req,resp)
 {
   var dt = dateTime.create();
   dt.format('m/d/Y H:M:S');
   console.log(new Date(dt.now()));
   var myvar = new Object();
   var balanceOBJ        = new Object();
   if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
   {
     myvar.status="0";
     myvar.message="Invalid Request.";
     resp.send(JSON.stringify(myvar));
   }
   else
   {
     var token = JSON.stringify(req.headers['x-token']);
     if(MyRNCryptor.authentication(token))
     {
       const From            = req.body.from
       const To              = req.body.to
       const Amount          = req.body.amount
       const Type            = req.body.type
       const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
       const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex');
       var nickname          = ((req.body.nickname).toString()).toLowerCase();
       console.log(nickname+" transaction running...");
       var contC             = "ContractABI";
       var addrC             = "ContractAddress";
       var newAbi            = contC+""+nickname;
       var newAddress        = addrC+""+nickname;
       var ContractABI       = tokensbep[newAbi];
       var ContractAddress   = tokensbep[newAddress];
       console.log(ContractAddress);
       const contract = new web3Bsc.eth.Contract(ContractABI,ContractAddress, { from: From });
       contract.methods.balanceOf(From).call().then(function(balance)
       {
         contract.methods.decimals().call().then(function(decimal)
         {
           if(decimal > 0)
           {
             var tfrAmount=Number.isInteger(Amount)?Amount:Number.parseFloat(Amount).toFixed(decimal);
             var tfrAmount = tfrAmount* Math.pow(10,decimal);
             var tfrAmount=tfrAmount.toFixedSpecial(0);
           }
           else
           {
             var tfrAmount=parseInt(Amount);
           }
           if(Type=='Move')
           {
             if(nickname=="atcc")
             {
               var minusValueAtcc=(0.5*Math.pow(10,decimal));
               var tfrAmount=((parseInt(tfrAmount)-parseInt(minusValueAtcc)).toFixedSpecial(0)).toString();
             }
           }
            
            if(tfrAmount>0)
            {
               console.log(nickname+" tfrAmount=>",tfrAmount);
               const data = contract.methods.transfer(To, tfrAmount).encodeABI();
               web3Bsc.eth.estimateGas({from: From,to: To,data: data},function(error,gasAmount)
               {
                   console.log('Error=> ',error);
                   console.log('txCount=> ',gasAmount);
                   web3Bsc.eth.getGasPrice(function(error1, gasPrice)
                   {
                     console.log('Error1=> ',error1);
                     console.log('txCount=> ',gasPrice);
                     //var gasPrice=gasPrice*2;//+(gasPrice/8);
                     var gasPrice=gasPrice;//+(gasPrice/8);
                     console.log('txCount1=> ',gasPrice);
                     var estGas=(Math.round(parseInt(gasAmount)*3)).toString();
                     web3Bsc.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                     {
                         console.log('Error3=>',error3);
                         console.log('txCount=>',txCount);
                         console.log('fee=>',gasPrice * estGas);
                         const txObject = {
                                             nonce     : web3Bsc.utils.toHex((txCount)),
                                             to        : ContractAddress,
                                             from      : From,
                                             value     : '0x0',
                                             gasLimit  : web3Bsc.utils.toHex(estGas),
                                             gasPrice  : web3Bsc.utils.toHex(gasPrice),
                                             data      : data,
                                             chainId   : 56
                                           }
                         const tx = new Tx(txObject)
                         tx.sign(FromPrivateKey1)
                         const serializedTx = tx.serialize()
                         const raw = '0x' + serializedTx.toString('hex')
                         web3Bsc.eth.sendSignedTransaction(raw, (error4, txHash) =>
                         {
                           console.log('Error4=> ',error4);
                           if(!error4)
                           {
                             myvar.status    = "1";
                             balanceOBJ.txid = txHash;
                             console.log(txHash);
                             myvar.message   = "Transaction Pending.";
                             myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                             resp.send(JSON.stringify(myvar));
                             console.log('json resp=> ',JSON.stringify(myvar));
                           }
                           else
                           {
 
                             var newError= error4.toString();
                             myvar.status="0";
                             myvar.message=newError.replace("Error: Returned error: ", "");;
                             resp.send(JSON.stringify(myvar));
                           }
                         })
                     })
                   })
               });
            }
            else
            {
               myvar.status="0";
               myvar.message="Amount Must Be Greater Than 0.";
               resp.send(JSON.stringify(myvar));
            }
         });
       });
     }
     else
     {
         myvar.status="0";
         myvar.message="Invalid Request.";
         resp.send(JSON.stringify(myvar));
     }
   }
 })
//========  Dogecoin Functions===========//
app.get('/doge-account-generate', function(req, resp) {
    console.log("Doge generating address...");
    var myvar = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            dogecoin.getNewAddress(function(err, address) {
				var outputOBJ = new Object();
                if (!err) {
                    outputOBJ.address = address;
                    dogecoin.walletpassphrase("Tas@@Shankar123$", 30, function() {
                        dogecoin.dumpPrivKey(address, function(err, privtekey) {
                            if (!err) {
                                outputOBJ.privateKey = privtekey;
								myvar.status="1";
								console.log(JSON.stringify(outputOBJ));
								myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
								resp.send(JSON.stringify(myvar));
                            } else {
                                myvar.status = "0";
                                myvar.message = err;
								resp.send(JSON.stringify(myvar));
                            }
                        });
                    });
                } else {
                    myvar.status = "0";
                    myvar.message = err;
					resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});

app.post('/doge-transfer', function(req, resp) {
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("doge transaction running...");
    var myvar = new Object();
    var balanceOBJ = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            const From = (req.body.from).toString();
            const To = (req.body.to).toString();
            const oldAmount =  parseFloat(req.body.amount);
            const Amount = oldAmount.toFixed(8);
			console.log("Amount=>",Amount);
            const Type = (req.body.type).toString();
            dogecoin.getBalance('*', 0, function(err, balance) {
                if (!err) {
                    if (balance >= Amount) {
                        dogecoin.walletpassphrase("Tas@@Shankar123$", 60, function() {
                            dogecoin.sendToAddress(To, Amount, function(err, txnid) {
                                if (!err) {
                                    balanceOBJ.txid = txnid;
                                    myvar.status = "1";
                                    myvar.message = "Transaction Pending.";
                                    myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
									dogecoin.walletLock();
                                    resp.send(JSON.stringify(myvar));
                                } else {
									console.log(err);
                                    myvar.status = "0";
                                    myvar.message = err;
                                    resp.send(JSON.stringify(myvar));
                                }
                            });
                        });
                    } else {
						console.log(err);
                        myvar.status = "0";
                        myvar.message = "You don't have enough balance.";
                        resp.send(JSON.stringify(myvar));
                    }
                } else {
					console.log(err);
                    myvar.status = "0";
                    myvar.message = "Something went wrong.";
                    resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }

    }
});

app.post('/doge-account-balance', function(req,resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  console.log("doge getting balance...");
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
	      dogecoin.getBalance('*', 0, function(err, res) {
          if(!err)
          {
			 console.log(res);
             myvar.status="1";
             var balanceOBJ=new Object();
             balanceOBJ.balance=res;
             myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
          }
          else
          {
             myvar.status="0";
             myvar.message=err;
          }
          console.log(JSON.stringify(balanceOBJ));
          resp.send(JSON.stringify(myvar));
        });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});

app.post('/doge-transaction-status', function(req, resp) {
    var myvar = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            var dt = dateTime.create();
            dt.format('m/d/Y H:M:S');
            console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash;
            console.log(transactionHash);
            dogecoin.getTransaction(transactionHash, function(error, TransactionStatus) {
                if (!error) {
                    if (TransactionStatus.blockhash != null) {
                        myvar.status = "1";
                        myvar.message = "Success.";
                        resp.send(JSON.stringify(myvar));
                    } else {
                        myvar.status = "3";
                        myvar.message = "Pending.";
                        resp.send(JSON.stringify(myvar));
                    }
                } else {
                    myvar.status = "3";
                    myvar.message = "Pending.";
                    resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});
//========  LTC Functions===========//
app.get('/ltc-account-generate', function(req, resp) {

    console.log("LTC generating address...");
    var myvar = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            client.getNewAddress(function(err, address) {
				var outputOBJ = new Object();
                if (!err) {
                    outputOBJ.address = address;
                    client.walletPassPhrase("Tas@@Shankar123$", 30, function() {
                        client.dumpPrivKey(address, function(err, privtekey) {
                            if (!err) {
                                outputOBJ.privateKey = privtekey;
								myvar.status="1";
								console.log(JSON.stringify(outputOBJ));
								myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
								resp.send(JSON.stringify(myvar));
                            } else {
                                myvar.status = "0";
                                myvar.message = err;
								resp.send(JSON.stringify(myvar));
                            }
                        });
                    });
                } else {
                    myvar.status = "0";
                    myvar.message = err;
					resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});

app.post('/ltc-transfer', function(req, resp) {
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("ltc transaction running...");
    var myvar = new Object();
    var balanceOBJ = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            const From = (req.body.from).toString();
            const To = (req.body.to).toString();
           // const Amount =(req.body.amount-0.0000600).toFixed(8);
            const Amount = parseFloat(req.body.amount);
			console.log(Amount);
            const Type = (req.body.type).toString();
            client.getBalance('*', 0, function(err, balance) {
                if (!err) {
                    if (balance >= Amount) {
                        client.walletPassPhrase("Tas@@Shankar123$", 60, function() {
                            client.sendToAddress(To, Amount, function(err, txnid) {
                                if (!err) {
                                    balanceOBJ.txid = txnid;
                                    myvar.status = "1";
                                    myvar.message = "Transaction Pending.";
                                    myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
									client.walletLock();
                                    resp.send(JSON.stringify(myvar));
                                } else {
									console.log(err);
                                    myvar.status = "0";
                                    myvar.message = err;
                                    resp.send(JSON.stringify(myvar));
                                }
                            });
                        });
                    } else {
						console.log(err);
                        myvar.status = "0";
                        myvar.message = "You don't have enough balance.";
                        resp.send(JSON.stringify(myvar));
                    }
                } else {
					console.log(err);
                    myvar.status = "0";
                    myvar.message = "Something went wrong.";
                    resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }

    }
});

app.post('/ltc-account-balance', function(req,resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  console.log("eth getting balance...");
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
	      client.getBalance('*', 0, function(err, res) {
          if(!err)
          {
			console.log(res);
            myvar.status="1";
            var balanceOBJ=new Object();
            balanceOBJ.balance=res;
            myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
          }
          else
          {
            myvar.status="0";
            myvar.message=err;
          }
          console.log(JSON.stringify(balanceOBJ));
          resp.send(JSON.stringify(myvar));
        });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});

app.post('/ltc-transaction-status', function(req, resp) {
    var myvar = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            var dt = dateTime.create();
            dt.format('m/d/Y H:M:S');
            console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash;
            console.log(transactionHash);
            client.getTransaction(transactionHash, function(err, TransactionStatus) {
                if (!err) {
                    if (TransactionStatus.blockhash != null) {
                        myvar.status = "1";
                        myvar.message = "Success.";
                        resp.send(JSON.stringify(myvar));
                    } else {
                        myvar.status = "3";
                        myvar.message = "Pending.";
                        resp.send(JSON.stringify(myvar));
                    }
                } else {
                    myvar.status = "3";
                    myvar.message = "Pending.";
                    resp.send(JSON.stringify(myvar));
                }
            });
			/* .catch(err => {
                myvar.status = '3';
                myvar.message = "Pending.";
                resp.send(JSON.stringify(myvar));
            }) */
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});
/**********************BTC************************/
app.get('/btc-account-generate', function(req, resp) {
    console.log("BTC generating address...");
    var myvar = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            btc.getNewAddress(function(err, address) {
				var outputOBJ = new Object();
                if (!err) {
                    outputOBJ.address = address;
                      btc.walletPassPhrase("Tas@@Shankar123$", 30, function() {
                        btc.dumpPrivKey(address, function(err, privtekey) {
                            if (!err) 
							{
                                outputOBJ.privateKey = privtekey;
								myvar.status="1";
								console.log(JSON.stringify(outputOBJ));
								myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
								resp.send(JSON.stringify(myvar));
                            } 
							else 
							{
                                myvar.status = "0";
                                myvar.message = err;
								resp.send(JSON.stringify(myvar));
                            }
                        });
                    });
                } else {
                    myvar.status = "0";
                    myvar.message = err;
					resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});

app.post('/btc-transfer', function(req, resp) {
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("btc transaction running...");
    var myvar = new Object();
    var balanceOBJ = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            const From = (req.body.from).toString();
            const To = (req.body.to).toString();
			const oldAmount =  parseFloat(req.body.amount);
            const Amount = oldAmount.toFixed(8);
			
            const Type = (req.body.type).toString();
            btc.getBalance('*', 0, function(err, balance) {
                if (!err) {
                    if (balance >= Amount) {
                        btc.walletPassPhrase("Tas@@Shankar123$", 60, function() {
                            btc.sendToAddress(To, Amount, function(err, txnid) {
                                if (!err) {
                                    balanceOBJ.txid = txnid;
                                    myvar.status = "1";
                                    myvar.message = "Transaction Pending.";
                                    myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
									btc.walletLock();
                                    resp.send(JSON.stringify(myvar));
                                } else {
									console.log("er=>",err);
                                    myvar.status = "0";
                                    myvar.message = err.toString();
                                    resp.send(JSON.stringify(myvar));
                                }
                            });
                        });
                    } else {
						console.log(err);
                        myvar.status = "0";
                        myvar.message = "You don't have enough balance.";
                        resp.send(JSON.stringify(myvar));
                    }
                } else {
					console.log(err);
                    myvar.status = "0";
                    myvar.message = "Something went wrong.";
                    resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }

    }
});

app.post('/btc-account-balance', function(req,resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  console.log("eth getting balance...");
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
  }
  else
  {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
	      btc.getBalance('*', 0, function(err, res) {
          if(!err)
          {
			console.log(res);
            myvar.status="1";
            var balanceOBJ=new Object();
            balanceOBJ.balance=res;
            myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
          }
          else
          {
            myvar.status="0";
            myvar.message=err;
          }
          console.log(JSON.stringify(balanceOBJ));
          resp.send(JSON.stringify(myvar));
        });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});

app.post('/btc-transaction-status', function(req, resp) {
    var myvar = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
        myvar.status = "0";
        myvar.message = "Invalid Request.";
        resp.send(JSON.stringify(myvar));
    } else {
        var token = JSON.stringify(req.headers['x-token']);
        if (MyRNCryptor.authentication(token)) {
            var dt = dateTime.create();
            dt.format('m/d/Y H:M:S');
            console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash;
            console.log(transactionHash);
            btc.getTransaction(transactionHash, function(error, TransactionStatus) {
                if (!error) {
                    if (TransactionStatus.blockhash != null) {
                        myvar.status = "1";
                        myvar.message = "Success.";
                        resp.send(JSON.stringify(myvar));
                    } else {
                        myvar.status = "3";
                        myvar.message = "Pending.";
                        resp.send(JSON.stringify(myvar));
                    }
                } else {
                    myvar.status = "3";
                    myvar.message = "Pending.";
                    resp.send(JSON.stringify(myvar));
                }
            });
        } else {
            myvar.status = "0";
            myvar.message = "Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});

/**********************BTG************************/
//========  TRX Functions===========//
app.get('/trx-account-generate', async function (req, resp) {
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  console.log("trx generating address...");
  var myvar = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) {

      //console.log(tronWeb.createAccount());
		// address save in base58
		// save private key and public key
      var out = await tronWeb.createAccount(); // create adderss here
      var outputOBJ = new Object();
      outputOBJ.address = out.address.base58;
      outputOBJ.privateKey = out.privateKey;
      outputOBJ.publicKey = out.publicKey;
      myvar.status = "1";
      myvar.response = MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
      resp.send(JSON.stringify(myvar));
    }
    else {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
});

app.post('/trx-transfer', function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("trx transaction running...");

  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      const From            = req.body.from
      const To              = req.body.to
      const Amount          = parseFloat(req.body.amount,1)
      const Type            = req.body.type
      const FromPrivateKey  = req.body.fromPrivateKey;
      var balanceOBJ        = new Object();
	  tronWeb.trx.getBalance(From).then(result => {
	     var balance = parseFloat(tronWeb.fromSun(result),1);
		 if(Amount <= balance)
		 {
			    tronWeb.trx.sendTransaction(To,tronWeb.toSun(Amount),FromPrivateKey).then(result => {
			    myvar.status    = "1";
                balanceOBJ.txid = result.transaction.txID;
                console.log(result.transaction.txID);
                myvar.message   = "Transaction Pending.";
                myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                resp.send(JSON.stringify(myvar));
			 });
		 }
		 else
		 {
			myvar.status="0";
            myvar.message="Insufficient Balance.";
            resp.send(JSON.stringify(myvar)); 
		 }
      });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});

app.post('/trx-account-balance', function (req, resp) {
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  console.log("trx getting balance...");
  var myvar = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) {
      tronWeb.trx.getBalance(Myaddress).then(result => {
        myvar.status = "1";
        var balanceOBJ = new Object();
        //balanceOBJ.balance = tronWeb.fromSun(result).toFixed(8);
        balanceOBJ.balance = parseFloat(tronWeb.fromSun(result)).toFixed(8);
        myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
        //return tronWeb.fromSun(result)
        resp.send(JSON.stringify(myvar));
      });
      
    }
    else {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/trx-transaction-status', async function (req, resp) {
  var myvar = new Object();

  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) {
      var dt = dateTime.create();
      dt.format('m/d/Y H:M:S');
      console.log(new Date(dt.now()));
      const transactionHash = req.body.transactionHash;
      console.log(transactionHash);
      var transactionReceiptDetails = await tronWeb.trx.getTransaction(transactionHash);
      if (transactionReceiptDetails != null) {
        if (transactionReceiptDetails.ret[0].contractRet == "SUCCESS") 
        {
            myvar.status = "1";
            myvar.message = "Success.";
            resp.send(JSON.stringify(myvar));
        }
        else 
        {
            myvar.status = "2";
            myvar.message = "Failed.";
            resp.send(JSON.stringify(myvar));
        }
      }
      else
      {
          myvar.status = "0";
          myvar.message = "No Record Found.";
          resp.send(JSON.stringify(myvar));
      }
    }
    else {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
});
//====== TRC 20 Comman Function ==========//
app.get('/trc20-account-generate', async function (req, resp) {
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) {
      console.log("trc20 (TRON) generating address...");
      var out = await tronWeb.createAccount(); // create adderss here
      var outputOBJ = new Object();
      outputOBJ.address = out.address.base58;
      outputOBJ.privateKey = out.privateKey;
      outputOBJ.publicKey = out.publicKey;
      myvar.status = "1";
      myvar.response = MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
      resp.send(JSON.stringify(myvar));
    }
    else {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
})
app.post('/trc20-account-balance', async function (req, resp) {
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar = new Object();
  var balanceOBJ = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) 
	{
      var Myaddress = req.body.address;
      var adminaddress = req.body.adminaddress;
      var contract_address = req.body.contract_address;
	   console.log("contract_address123=>",contract_address);
	  var newcontAdd = Number(contract_address);
      
	  console.log("contract_address=>",contract_address);
	  //console.log("contract_address type=>",typeof newcontAdd);
	   
	  if(contract_address!=null && typeof newcontAdd =="number" && newcontAdd > 0)
	  {
		myvar.status = "1";
		var balanceOBJ = new Object();
		var decimals = req.body.decimal;
		var respom= await tronWeb.trx.getAccount(Myaddress);
		var tokensDetail = respom.assetV2;
		
		var filteredToken = tokensDetail.filter(function (tokensDetail) { return tokensDetail.key == contract_address });
		var tokenBalance = filteredToken[0].value;
		if(decimals==0)
		{
			var newBalance = parseFloat(tokenBalance).toFixed(8);
		}
		else
		{
			var newBalance = parseFloat(tokenBalance / Math.pow(10,decimals)).toFixed(8);
		}
		var result1=0;
		
		if(respom.balance!=undefined)
		{
		  var result1=respom.balance;
		}
		balanceOBJ.balance = newBalance;
		balanceOBJ.etherbalance = parseFloat(tronWeb.fromSun(result1)).toFixed(8);
		//balanceOBJ.etherbalance = parseFloat(tronWeb.fromSun(result1));
		balanceOBJ.estimategas = 0;
		console.log(JSON.stringify(balanceOBJ));
		myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
		resp.send(JSON.stringify(myvar));
	  }
	  else
	  {
		  console.log(" getting balance... => " + req.body.nickname);
		  var nickname = ((req.body.nickname).toString()).toLowerCase();
		  console.log("Balance function =>",Myaddress);
		  
		  console.log(nickname + " getting balance...");
		  var contC = "ContractABI";
		  var addrC = "ContractAddress";
		  var newAddress = nickname + "" + addrC;
		  var ContractAddress = tokenstrc[newAddress];
		  console.log(ContractAddress);
		  let contract = await tronWeb.contract().at(ContractAddress);
		  let result = await contract.balanceOf(Myaddress).call();
		  let decimals = await contract.decimals().call();
		  let bo = result.hasOwnProperty("balance") ? result.balance._hex : result._hex;
		  if(decimals==0)
		  {
				var newBalance = parseFloat(tronWeb.toDecimal(bo)).toFixed(8);
		  }
		  else
		  {
				var newBalance = parseFloat(tronWeb.toDecimal(bo) / Math.pow(10,decimals)).toFixed(8);
		  }
		  console.log("result=>",bo);
		  tronWeb.trx.getBalance(Myaddress).then(result1 => {
			myvar.status = "1";
			var balanceOBJ = new Object();
			balanceOBJ.balance = newBalance;
			//balanceOBJ.etherbalance = parseFloat(tronWeb.fromSun(result1));
			balanceOBJ.etherbalance = parseFloat(tronWeb.fromSun(result1)).toFixed(8);
			//console.log('etherbalance=>',result1);
			balanceOBJ.estimategas = 0;
			console.log(JSON.stringify(balanceOBJ));
			myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
			resp.send(JSON.stringify(myvar));
		  });
	  }
    }
    else {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
}) 
app.post('/trc20-transfer',async function (req, resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar = new Object();
  var balanceOBJ = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) 
  {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else 
  {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) 
    {
      var nickname = ((req.body.nickname).toString()).toLowerCase();
      console.log(nickname + " transaction running...");
      const From = req.body.from;
      const To = typeof req.body.to === 'string'? req.body.to:req.body.to.toString();
	   const FromPrivateKey1 = typeof req.body.fromPrivateKey === 'string'? req.body.fromPrivateKey:req.body.fromPrivateKey.toString();
      const Amount = req.body.amount;
      const Type = req.body.type;
	   var contract_address = req.body.contractAddress;
	  var newcontAdd = Number(contract_address);
      const decimal = req.body.decimal;
	  if(contract_address!=null && typeof newcontAdd =="number"  && newcontAdd > 0)
	  {
		  try 
		  {
			 if(decimal > 0) 
			 {
				 var tfrAmount = Number.isInteger(Amount) ? Amount : Number.parseFloat(Amount).toFixed(decimal);
				 var tfrAmount = tfrAmount * Math.pow(10, decimal);
				 var tfrAmount = tfrAmount.toFixedSpecial(0);
			}
			else 
			{
			   var tfrAmount = parseInt(Amount);
			}
			   const tradeobj = await tronWeb.transactionBuilder.sendToken(
					  To,
					  tfrAmount,
					  contract_address, //tokenID
					  From,    
				).then(output => {
				 // console.log('- Output:', output, '\n');
				  return output;
				});
				//sign 
				const signedtxn = await tronWeb.trx.sign(
					  tradeobj,
					  FromPrivateKey1
				);
				//broadcast 
				const receipt = await tronWeb.trx.sendRawTransaction(
					  signedtxn
				).then(output => {
				 // console.log('- Output:', output, '\n');
				  return output;
				});
			if("result" in receipt && receipt.result==true && "txid" in receipt && receipt.txid!='')
			 {
				 
				myvar.status = "1";
				balanceOBJ.txid = receipt.txid;
				myvar.message = "Transaction Pending.";
				myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
				resp.send(JSON.stringify(myvar));
			 }
			 else{				 
				myvar.status = "0";
				myvar.message = "Transaction Failed Try Again Later."
			 }
			resp.send(JSON.stringify(myvar));				
		  }
		  catch (error) 
		  {
			  console.log("error=>",error); 
				 if("error" in error)
				 {
					 
					var newError = error.message.toString();
					console.log("newError=>",newError);
					myvar.status = "0";
					myvar.message = newError.replace("Error: Returned error: ", "");;
				 }
				 else{
					 
					var newError = error.toString();
					console.log("newError=>",newError);
					myvar.status = "0";
					myvar.message = newError.replace("Error: Returned error: ", "");;
				 }
				resp.send(JSON.stringify(myvar));
		  }
	  }
	  else{
		  const ContractAddress = typeof req.body.contractAddress === 'string'? req.body.contractAddress:req.body.contractAddress.toString();
		  try 
		  {
			 console.log("ContractAddress=>",ContractAddress);
			 console.log("decimal=>",decimal);
			 console.log("FromPrivateKey1=>",FromPrivateKey1);
			 console.log("To=>",To);
			 console.log("Amount=>",Amount);
			 const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, FromPrivateKey1);
			 let contract = await tronWeb.contract().at(ContractAddress);
			 if(decimal > 0) 
			 {
				 var tfrAmount = Number.isInteger(Amount) ? Amount : Number.parseFloat(Amount).toFixed(decimal);
				 var tfrAmount = tfrAmount * Math.pow(10, decimal);
				 var tfrAmount = tfrAmount.toFixedSpecial(0);
			}
			else 
			{
			   var tfrAmount = parseInt(Amount);
			}
			await contract.transfer(To, tfrAmount).send({ feeLimit: 1000000*100 }).then(output => 
			{ 
				console.log('output=>',output);
				myvar.status = "1";
				balanceOBJ.txid = output;
				myvar.message = "Transaction Pending.";
				myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
				resp.send(JSON.stringify(myvar));
				console.log('json resp=> ', JSON.stringify(myvar));
			});
		  } 
		  catch (error) 
		  {
			 console.log("error=>",error); 
			 
			 if("error" in error)
			 {
				 
				var newError = error.message.toString();
				console.log("newError=>",newError);
				myvar.status = "0";
				myvar.message = newError.replace("Error: Returned error: ", "");;
			 }
			 else{
				 
				var newError = error.toString();
				console.log("newError=>",newError);
				myvar.status = "0";
				myvar.message = newError.replace("Error: Returned error: ", "");;
			 }
			resp.send(JSON.stringify(myvar));
			//console.error("trigger smart contract error", error)
		  }
	  } 
    }
    else 
    {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
});

//======Old TRC 20 Comman Function ==========//
app.get('/trc20-account-generate-old', async function (req, resp) {
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) {
      console.log("trc20 (TRON) generating address...");
      var out = await tronWeb.createAccount(); // create adderss here
      var outputOBJ = new Object();
      outputOBJ.address = out.address.base58;
      outputOBJ.privateKey = out.privateKey;
      outputOBJ.publicKey = out.publicKey;
      myvar.status = "1";
      myvar.response = MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
      resp.send(JSON.stringify(myvar));
    }
    else {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
}) 
app.post('/trc20-account-balance-old', async function (req, resp) {
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar = new Object();
  var balanceOBJ = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) {
      var Myaddress = req.body.address;
      var adminaddress = req.body.adminaddress;
      var nickname = ((req.body.nickname).toString()).toLowerCase();
      console.log(Myaddress);
      console.log(nickname + " getting balance...");
      var contC = "ContractABI";
      var addrC = "ContractAddress";
      var newAddress = nickname + "" + addrC;
      var ContractAddress = tokenstrc[newAddress];
	  console.log(ContractAddress);
      let contract = await tronWeb.contract().at(ContractAddress);
      let result = await contract.balanceOf(Myaddress).call();
	  let decimals = await contract.decimals().call();
	  let bo = result.hasOwnProperty("balance") ? result.balance._hex : result._hex;
      if(decimals==0)
	  {
			var newBalance = parseFloat(tronWeb.toDecimal(bo)).toFixed(8);
	  }
	  else
	  {
			var newBalance = parseFloat(tronWeb.toDecimal(bo) / Math.pow(10,decimals)).toFixed(8);
	  }
	  console.log("result=>",bo);
      tronWeb.trx.getBalance(Myaddress).then(result1 => {
        myvar.status = "1";
        var balanceOBJ = new Object();
        balanceOBJ.balance = newBalance;
        balanceOBJ.etherbalance = parseFloat(tronWeb.fromSun(result1));
        balanceOBJ.estimategas = 0;
        console.log(JSON.stringify(balanceOBJ));
        myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
        resp.send(JSON.stringify(myvar));
      });
    }
    else {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
}) 
app.post('/trc20-transfer-old',async function (req, resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar = new Object();
  var balanceOBJ = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token'] == "")) 
  {
    myvar.status = "0";
    myvar.message = "Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else 
  {
    var token = JSON.stringify(req.headers['x-token']);
    if (MyRNCryptor.authentication(token)) 
    {
      var nickname = ((req.body.nickname).toString()).toLowerCase();
      console.log(nickname + " transaction running...");
      const From = req.body.from;
      const To = req.body.to.toString();
      const Amount = req.body.amount;
      const Type = req.body.type;
      const decimal = req.body.decimal;
      const ContractAddress = req.body.contractAddress.toString();
      const FromPrivateKey1 = req.body.fromPrivateKey.toString();
      try 
	  {
		 console.log("ContractAddress=>",ContractAddress);
		 console.log("decimal=>",decimal);
		 console.log("FromPrivateKey1=>",FromPrivateKey1);
		 console.log("To=>",To);
		 console.log("Amount=>",Amount);
         const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, FromPrivateKey1);
         let contract = await tronWeb.contract().at(ContractAddress);
         if(decimal > 0) 
		 {
             var tfrAmount = Number.isInteger(Amount) ? Amount : Number.parseFloat(Amount).toFixed(decimal);
             var tfrAmount = tfrAmount * Math.pow(10, decimal);
             var tfrAmount = tfrAmount.toFixedSpecial(0);
        }
        else 
        {
           var tfrAmount = parseInt(Amount);
        }
        await contract.transfer(To, tfrAmount).send({ feeLimit: 100000000}).then(output => 
        { 
            console.log('output=>',output);
            myvar.status = "1";
            balanceOBJ.txid = output;
            myvar.message = "Transaction Pending.";
            myvar.response = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
            resp.send(JSON.stringify(myvar));
            console.log('json resp=> ', JSON.stringify(myvar));
        });
      } 
      catch (error) 
      {
		 console.log("error=>",error); 
		 
		 if("error" in error)
		 {
			 
			var newError = error.message.toString();
			console.log("newError=>",newError);
			myvar.status = "0";
			myvar.message = newError.replace("Error: Returned error: ", "");;
		 }
		 else{
			 
			var newError = error.toString();
			console.log("newError=>",newError);
			myvar.status = "0";
			myvar.message = newError.replace("Error: Returned error: ", "");;
		 }
        resp.send(JSON.stringify(myvar));
        //console.error("trigger smart contract error", error)
      }
     
    }
    else 
    {
      myvar.status = "0";
      myvar.message = "Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
  }
});
//======= Nem Functions =========//
app.post("/xem-multpleAddressBalance",(req,resp)=>
{
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
        var dt = dateTime.create();
        dt.format('m/d/Y H:M:S');
        console.log(new Date(dt.now()));
        console.log("xem multiple address balance fetching...");
        const network         = 'http://localhost';
        const networkPort     = sdknem.model.nodes.defaultPort;
        const networkID       = sdknem.model.network.data.mainnet.id;
        var addresses         = convertArrayToString(req.body.addresses);
        var myStash           = addresses.split(',');
        var newarray          = [];
        const nemDecimals     = 1000000;
        var endpoint          = sdknem.model.objects.create("endpoint")(network,networkPort);
        var output=myStash.map(myStashKey => {
                                  return sdknem.com.requests.account.data(endpoint, myStashKey).then(result=>{
                                     newarray[myStashKey]=result.account.balance/nemDecimals;
                                     return newarray;
                                  }).catch(err=>{
                                     newarray[myStashKey]=0;
                                     return newarray
                                  });
                              });
        Promise.all(output).then(result=>
        {
          var newResult=Object.assign({}, result[0]);
          resp.send(newResult);

        });
    }
    else
    {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
    }
  }
});
app.get('/xem-account-generate',function(req,resp)
{
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      //console.log('nem yes');
      var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    nem.nisGet('/account/generate',null
    ,function(err) {
      myvar.status="0";
      myvar.message=err;
       resp.send(JSON.stringify(myvar));
    },function(res) {
      myvar.status="1";
      myvar.response=MyRNCryptor.encrypt(JSON.stringify(res)); //MyRNCryptor.encrypt(JSON.stringify(Ripapi.generateAddress()));
      resp.send(JSON.stringify(myvar));
      console.log(myvar);
    });
  }
 }
});
app.post('/xem-account-balance',function(req,resp)
{
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      if(Myaddress!="")
      {
        nem.nisGet('/account/get?address=' + Myaddress,null
        ,function(err) {
          console.log(err.code);
          myvar.status="0";
          myvar.message=err.code;
          resp.send(JSON.stringify(myvar));
        },function(res) {
          if(res.error || res.status || res.status==400)
          {
            myvar.status="0";
            myvar.message=res.message;
            resp.send(JSON.stringify(myvar));
          }
          else
          {
            myvar.status="1";
            var balanceOBJ=new Object();
            var balance=parseInt(res.account.balance);
            balanceOBJ.balance=balance/1000000;
            myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
            resp.send(JSON.stringify(myvar));
          }
        });

       }
       else
       {
         //==== address can not be blank and null ====//
         myvar.status="0";
         myvar.message="Invalid Request.";
         resp.send(JSON.stringify(myvar));
       }
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/xem-transaction-status', function(req,resp)
{

    var myvar= new Object();
    //console.log(req);
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
        var token = JSON.stringify(req.headers['x-token']);
        if(MyRNCryptor.authentication(token))
        {
            var dt = dateTime.create();
            dt.format('m/d/Y H:M:S');
            console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash;
            const network         = "http://localhost";
            const networkPort     = sdknem.model.nodes.defaultPort;
            const networkID       = sdknem.model.network.data.mainnet.id;
            var endpoint          = sdknem.model.objects.create("endpoint")(network,networkPort);
            sdknem.com.requests.transaction.byHash(endpoint, transactionHash).then(function(res) {
              console.log("\nTransaction data:");
              if(res.meta.id )
              {
                //console.log(transaction.outcome.result);
                  myvar.status=1;
                  myvar.message="Success.";
                  console.log(myvar);
                  resp.send(myvar);
              }
              else
              {
                  myvar.status=2;
                  myvar.message="2Failed.";
                  resp.send(myvar);
              }
            }).catch(error=>{
              console.log("error",error);
              myvar.status=0;
              myvar.message="Failed.";
              resp.send(myvar);
            })
        }
        else
        {
            myvar.status="0";
            myvar.message="Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});
app.post('/xem-transfer',function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("xem (nem) transaction running...");
    var myvar= new Object();
    var balanceOBJ        = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        const network         = "http://localhost";
        const networkPort     = sdknem.model.nodes.defaultPort;
        const networkID       = sdknem.model.network.data.mainnet.id;
        const From            = (req.body.from).toString();
        const To              = (req.body.to).toString();
        const Amount          = req.body.amount;
        const Type            = (req.body.type).toString();
        const FromSecretKey   = (req.body.fromPrivateKey).toString();
        var message           = "";
        const nemDecimals     = 1000000;
        var endpoint          = sdknem.model.objects.create("endpoint")(network,networkPort);
        var common            = sdknem.model.objects.create("common")("", FromSecretKey);
        var transferTransaction= sdknem.model.objects.create("transferTransaction")(To,Amount,message);
        var prepareTransaction= sdknem.model.transactions.prepare("transferTransaction")(common,transferTransaction,networkID);
        var _fee = (prepareTransaction.fee)/nemDecimals;
        sdknem.com.requests.account.data(endpoint, From).then((result)=>
        {
          //var accountBalance= result.account.balance>0?result.account.balance/nemDecimals:0;
          if(Type=='Move')
          {
            var tfrAmount1        = Amount;
            var newTransferAmount = ((tfrAmount1)-(_fee));
          }
          else if(Type=='Withdraw')
          {
            var newTransferAmount = Amount;
          }
          else
          {
            var newTransferAmount=0;
          }
         // console.log("newTransferAmount=> ",newTransferAmount);
          //console.log("fee=> ",_fee)
          var transferTransaction= sdknem.model.objects.create("transferTransaction")(To,newTransferAmount,message);
          var prepareTransaction= sdknem.model.transactions.prepare("transferTransaction")(common,transferTransaction,networkID);
          if(newTransferAmount > 0 && accountBalance >= newTransferAmount)
          {
            sdknem.model.transactions.send(common,prepareTransaction,endpoint).then((response,error)=>{
              console.log("response =>",response);console.log("error",error)
              if(response)
              {
                  if(response.type=1 && response.code==0)
                  {
                    balanceOBJ.txid = response.transactionHash.data;
                    myvar.status    = "2";
                    myvar.message   = "Transaction Pending.";
                    myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                   // myvar.response  = JSON.stringify(balanceOBJ);
                  }
                  else if(response.code==1)
                  {
                    balanceOBJ.txid = response.transactionHash.data;
                    myvar.status    = "2";
                    myvar.message   = "Transaction Pending.";
                    myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                   // myvar.response  = JSON.stringify(balanceOBJ);
                  }
                  else
                  {
                    myvar.status="0";
                    myvar.message=response.message;

                  }
                   resp.send(JSON.stringify(myvar));
              }
              else
              {
                  myvar.status="0";
                  myvar.message=error.data.message!=''?error.data.message:'Bad Request.';
                  resp.send(JSON.stringify(myvar));
              }
            });
          }
          else
          {
            myvar.status="0";
            myvar.message="You don't have enough balance.";
            resp.send(JSON.stringify(myvar));
          }
        }).catch(error=>{
          myvar.status="0";
          myvar.message=error.data.message!=''?error.data.message:'Bad Request.';
          resp.send(JSON.stringify(myvar));
        });
      }
      else
      {
            myvar.status="0";
            myvar.message="Invalid Request.";
            resp.send(JSON.stringify(myvar));
      }

    }
});
//======= Ends Nem Functions =========//
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
app.post("/xrp-multpleAddressBalance",function(req,resp)
{
  const RippleAPI4 = require('ripple-lib').RippleAPI
  const Ripapi4       = new RippleAPI4({ server: 'wss://s2.ripple.com' }) ;
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    //console.log(req);
    //var Myaddress = MyRNCryptor.decrypt(req.body.address);
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
        var dt = dateTime.create();
        dt.format('m/d/Y H:M:S');
        console.log(new Date(dt.now()));
        console.log("xrp multiple address balance fetching...");
        var addresses=convertArrayToString(req.body.addresses);
        var myStash    = addresses.split(',');
        var k=0;
        var newarray=[];
        Ripapi4.connect().then(() =>
        {
          /*for (key in myStash)
          {
            //console.log(myStash[key]);
            Ripapi4.getAccountInfo(myStash[key]).then(function(result)
            {
                //console.log("xrp =>"+result.xrpBalance);
                if(result.xrpBalance >0 )
                {
                  newarray[k] = result.xrpBalance;
                }
                //console.log("k=> "+k+" myStash length=> "+myStash.length)
                if(k==myStash.length -1)
                {

                  resp.send(JSON.stringify(newarray));
                }
                k++;
            }).catch(err=>
            {
                newarray[k]=0;
               // console.log("k=> "+k+" myStash length=> "+myStash.length)
                if(k==myStash.length -1)
                {
                  resp.send(JSON.stringify(newarray));
                }
                k++;
            });
          }*/
          var output=myStash.map(myStashKey => {
                          return Ripapi4.getAccountInfo(myStashKey).then(result=>{
                             newarray[myStashKey]=result.xrpBalance;
                             return newarray;
                          }).catch(err=>{
                             newarray[myStashKey]=0;
                             return newarray
                          });
                      });
          Promise.all(output).then(result=>{
            var newResult=Object.assign({}, result[0]);
            resp.send(newResult);
          });
        }).then(() => {
          console.log("disconnecting...");
        return Ripapi4.disconnect();
      }).catch( //console.error
        err=>{
          var Myerror=err.toString();
          console.log(err);
         }
       );
    }
    else
    {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
    }
  }
});
app.get('/xrp-account-generate', function(req,resp)
{
  console.log('yes');
  const RippleAPI = require('ripple-lib').RippleAPI
  const Ripapi       = new RippleAPI({ server: 'wss://s2.ripple.com' }) ;
  var myvar= new Object();
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      myvar.status="1";
    //  var result=JSON.stringify(Ripapi.generateAddress());
      console.log('result');
      myvar.response=MyRNCryptor.encrypt(JSON.stringify(Ripapi.generateAddress()));
      resp.send(JSON.stringify(myvar));
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/xrp-account-balance', function(req,resp)
{
  const RippleAPI1 = require('ripple-lib').RippleAPI
  const Ripapi1       = new RippleAPI1({ server: 'wss://s2.ripple.com' }) ;
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    //console.log(req);
    //var Myaddress = MyRNCryptor.decrypt(req.body.address);
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      //  console.log(Myaddress);
      var dt = dateTime.create();
      dt.format('m/d/Y H:M:S');
      console.log(new Date(dt.now()));
      run();
      async function run()
      {
        await Ripapi1.connect();
        var info = await Ripapi1.getAccountInfo(Myaddress).then(info=>{return info;}).catch(error=>{return error;});
        if(info=='[RippledError(actNotFound)]')
        {

        myvar.status="1";
        var balanceOBJ=new Object();
        balanceOBJ.balance=0;
        myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
        resp.send(JSON.stringify(myvar));
        }else{

        console.log("info: ",info);
        myvar.status="1";
        var balanceOBJ=new Object();
        balanceOBJ.balance=info.xrpBalance;
        myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
        resp.send(JSON.stringify(myvar));

        }
         await Ripapi1.disconnect();
      }

    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/xrp-transfer', function(req,resp)
{
  const RippleAPI2 = require('ripple-lib').RippleAPI
  const Ripapi2       = new RippleAPI2({ server: 'wss://s2.ripple.com' }) ;
  console.log("xrp transaction running...");
  //console.log("req",req);
  var myvar= new Object();
  var balanceOBJ        = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      var dt = dateTime.create();
      dt.format('m/d/Y H:M:S');
      console.log(new Date(dt.now()));
      const From            = (req.body.from).toString();
      const To              = (req.body.to).toString();
      const Amount          = req.body.amount;
      const Type            = (req.body.type).toString();
      const destinationTag  = req.body.destinationTag;
      const FromSecretKey   = (req.body.fromPrivateKey).toString();
      console.log("From=> "+From); console.log("To=> "+To);
      console.log("Amount=> "+Amount); console.log("Type=> "+Type);
      console.log("FromSecretKey=> "+FromSecretKey);
      Ripapi2.connect().then(()=>{
        return run();
        async function run(){
          var EstimatedFee = await Ripapi2.getFee();
              var info = await Ripapi2.getAccountInfo(From).then(result=>{return result;});
              var ss= await Ripapi2.getServerInfo().then(result=>{return result;});
              var ss_ledgerVersion = ss.validatedLedger.ledgerVersion;
              var ss_ledgerVersion4=ss.validatedLedger.ledgerVersion+4;
              var accountSequence=info.sequence
              var _fee = (EstimatedFee*1000000)+"";
			  console.log("EstimatedFee: ",EstimatedFee);
			  console.log("fee1: ",_fee);
              var accountBalance=info.xrpBalance*1000000;
              // if(parseInt(_fee) > 20)
              // {
                // _fee = 20
              // }
              console.log("fee: ",_fee);

                  if(Type=='Withdraw')
                  {
                    var tfrAmount         = ((parseFloat(Amount).toFixed(6))*1000000);
                    var newTransferAmount = tfrAmount;
                  }
                  else
                  {
                     var newTransferAmount=0;
                  }
              if(newTransferAmount > 0 && accountBalance >= newTransferAmount)
              {
                  var transaction = {
                                        "Account"             : From,
                                        "Sequence"            : accountSequence,
                                        "LastLedgerSequence"  : ss_ledgerVersion4,
                                        "Fee"                 : _fee,
                                        "Amount"              : newTransferAmount+"",
                                        "Destination"         : To,
                                        "TransactionType"     : "Payment"
                                    }
                  if(destinationTag!="" && destinationTag!=null && destinationTag!=undefined)
                  {
                    transaction.DestinationTag=destinationTag;
                  }
                  var txJSON = JSON.stringify(transaction)
                  var transactionSigned = Ripapi2.sign(txJSON,FromSecretKey);
                  console.log("transactionSigned: ",transactionSigned);
                  var data = await Ripapi2.submit(transactionSigned.signedTransaction).then(data=>{return data});
                  console.log("data: ",data);
                  if(data.resultCode=='tesSUCCESS' || data.resultCode=='terQUEUED')
                  {
                    balanceOBJ.txid = transactionSigned.id;
                    myvar.status    = "1";
                    //myvar.response  = JSON.stringify(balanceOBJ);
                    myvar.message   = "Transaction Pending.";
                    myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                    //resp.send(JSON.stringify(myvar));
                    return myvar;
                  }
                  else
                  {
                    myvar.status  = "0";
                    myvar.message   = "Oops, Something went wrong.";
                    //resp.send(JSON.stringify(myvar));
                    return myvar;
                  }
              }
              else
              {
                myvar.status="0";
                myvar.message="You don't have enough balance.";
                //resp.send(JSON.stringify(myvar));
                return myvar;
              }
        }
      }).then(info => {
        console.log(info);
         resp.send(JSON.stringify(info));
      }).then(() => {

        return setTimeout(function(){
          console.log("disconnecting...");
         return Ripapi2.disconnect()},100*1000);
          // Ripapi2.disconnect();
      }).catch(err=>{
          var Myerror=err.toString();
          console.log(Myerror);
          myvar.status  = "0";
          myvar.message   = "Can not estblish connection.";
          resp.send(JSON.stringify(myvar));
      });

    }
    else
    {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
    }

  }
});
app.post('/xrp-transaction-status', function(req,resp)
{
  const RippleAPI3 = require('ripple-lib').RippleAPI
  const Ripapi3       = new RippleAPI3({ server: 'wss://s2.ripple.com' }) ;
    var myvar= new Object();
    //console.log(req);
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
        var token = JSON.stringify(req.headers['x-token']);
        if(MyRNCryptor.authentication(token))
        {
            var dt = dateTime.create();
            dt.format('m/d/Y H:M:S');
            console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash
            console.log(transactionHash);
            Ripapi3.on('connected', function () {
            Ripapi3.getTransaction(transactionHash).then(transaction =>
            {
              //console.log(transaction);
               if(transaction !== null && typeof transaction === 'object')
                {

                    if(transaction.outcome.result=="tesSUCCESS")
                    {
                      //console.log(transaction.outcome.result);
                        myvar.status=1;
                        myvar.message="Success.";
                        console.log(myvar);
                        resp.send(JSON.stringify(myvar));
                    }
                    else
                    {
                        myvar.status=2;
                        myvar.message="Failed.";
                        resp.send(JSON.stringify(myvar));
                    }
                }
                else
                {
                    myvar.status=0;
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
                }
              //console.log(transaction);
             // resp.send(transaction);
            }).catch(error=>{
                    myvar.status=0;
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
            });
          });
          Ripapi3.connect()
          setTimeout(function(){
            Ripapi3.disconnect()
          }, 100*1000)
        }
        else
        {
            myvar.status="0";
            myvar.message="Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});
 //====== Ether Functions ==========//
app.get('/eth-account-generate', function(req,resp)
{
  var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
   console.log("eth generating address...");
    var myvar= new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        var out=accounts.create(); // create adderss here
        var outputOBJ= new Object();
        outputOBJ.address=out.address;
        outputOBJ.privateKey=out.privateKey;
        //console.log(newPrvtkey);
        var newprivkey=(out.privateKey).toString();
        var newEthSLPwd=(req.query.EthSLPwd).toString();
        sLocal(newprivkey,newEthSLPwd,type='eth');
        //console.log(out);
        myvar.status="1";
        myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
        resp.send(JSON.stringify(myvar));
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
});
app.post('/eth-account-balance', function(req,resp)
{
  var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
  console.log("eth getting balance...");
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
         web3.eth.getBalance(Myaddress, function(err, res){
          if(!err)
          {
            console.log('Myaddress=> '+Myaddress);
           // console.log(res);
            myvar.status="1";
            var balanceOBJ=new Object();
           // var balance1 =  res.toNumber();
            var balance1 =  parseInt(res);
            var balance2 = balance1/1000000000000000000;
            balanceOBJ.balance=balance2.toFixed(8);

            myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
          }
          else
          {
            myvar.status="0";
            myvar.message=err;
          }
          console.log(JSON.stringify(balanceOBJ));
          resp.send(JSON.stringify(myvar));
        });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/eth-transfer', function(req,resp)
{
  var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
  console.log("eth transaction running...");

  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      const From            = req.body.from
      const To              = req.body.to
      const Amount          = req.body.amount
      const Type            = req.body.type
      const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
      const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex')
      var balanceOBJ        = new Object();
      web3.eth.getBalance(From, function(err, res)
      {
          if(!err)
          {
            web3.eth.getGasPrice(function(error1, gasPrice)
            {
                var estGas=21000;
                console.log('gasPrice=> ',gasPrice);
                var gasPrice= gasPrice*5;//+(gasPrice/8);
                console.log('gasPrice1=> ',gasPrice);
                var fe1 = gasPrice*estGas;
                if(Type=='Move')
                {
                  
                    var tfrAmount                 = web3.utils.toWei((math.bignumber(Amount)).toString(),"ether");
                    var newTransferAmount         = math.format(tfrAmount-(fe1*2), {notation: 'fixed'});

                }
                else if(Type=='Withdraw')
                {
                    var tfrAmount             =  web3.utils.toWei((math.bignumber(Amount.noExponents()).toString()),"ether");
                    var newTransferAmount     = tfrAmount;
                }
                else
                {
                     var newTransferAmount=0;
                }
                console.log("newTransferAmount=>",newTransferAmount);
                if(newTransferAmount > 0)
                {
                    web3.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                    {
                         console.log('txCount=> ',txCount);
                         var newTransferAmount1    = newTransferAmount.toString();
                         const txObject = {
                                            nonce     : web3.utils.toHex((txCount)),
                                            to        : To,
                                            from      : From,
                                            value     : web3.utils.toHex(newTransferAmount1),
                                            gasLimit  : web3.utils.toHex(estGas),
                                            gasPrice  : web3.utils.toHex(gasPrice),
											//gasPrice  : web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
                                          }
                        const tx = new Tx(txObject)
                        tx.sign(FromPrivateKey1)
                        const serializedTx = tx.serialize()
                        const raw = '0x' + serializedTx.toString('hex')
                        web3.eth.sendSignedTransaction(raw, (error4, txHash) =>
                        {
                          if(!error4)
                          {
                            myvar.status    = "1";
                            balanceOBJ.txid = txHash;
                            console.log(txHash);
                            myvar.message   = "Transaction Pending.";
                            myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                            resp.send(JSON.stringify(myvar));
                          }
                          else
                          {
                             var newError= error4.toString();
                             console.log("newError: "+ newError);
                             myvar.status="0";
                             myvar.message=newError.replace("Error: Returned error: ", "");;
                             resp.send(JSON.stringify(myvar));
                          }
                        })
                    })
                }
                else
                {
                  myvar.status="0";
                  myvar.message="Something Wrong.";
                  resp.send(JSON.stringify(myvar));
                }
             })
          }
          else
          {
             myvar.status="0";
             myvar.message="Something Wrong.";
             resp.send(JSON.stringify(myvar));
          }
      });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});

app.post('/eth-transaction-status', function(req,resp)
{
    var myvar= new Object();

    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
        var token = JSON.stringify(req.headers['x-token']);
        if(MyRNCryptor.authentication(token))
        {
          var dt = dateTime.create();
          dt.format('m/d/Y H:M:S');
            console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash;
            console.log(transactionHash);
            web3.eth.getTransaction(transactionHash).then(function (TransactionStatus,error)
            {
                if(!error)
                {
                    if(TransactionStatus.blockHash!=null)
                    {
                        web3.eth.getTransactionReceipt(transactionHash).then(function (receipt)
                        {
                              if(receipt!=null)
                              {
                                  if(receipt.status)
                                  {
                                      myvar.status="1";
                                      myvar.message="Success.";
                                      resp.send(JSON.stringify(myvar));
                                  }
                                  else
                                  {
                                      myvar.status="2";
                                      myvar.message="Failed.";
                                      resp.send(JSON.stringify(myvar));
                                  }
                              }
                              else
                              {
                                  myvar.status="0";
                                  myvar.message="No Record Found.";
                                  resp.send(JSON.stringify(myvar));
                              }
                        });
                    }
                    else
                    {
                       myvar.status="3";
                       myvar.message="Pending.";
                       resp.send(JSON.stringify(myvar));
                    }
                }
                else
                {
                    myvar.status="3";
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
                }
            }).catch(error=>{
                    myvar.status='3';
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
            });
        }
        else
        {
            myvar.status="0";
            myvar.message="Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});
//====== ERC 20 Comman Function ==========//
app.get('/erc20-account-generate',function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    var myvar= new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        console.log("erc20 (ether) generating address...");
        var out=accounts.create(); // create adderss here
        var outputOBJ= new Object();
        outputOBJ.address=out.address;
        outputOBJ.privateKey=out.privateKey;
        //console.log(outputOBJ);
        var newprivkey=(out.privateKey).toString();
        var newEthSLPwd=(req.query.EthSLPwd).toString();
        sLocal(newprivkey,newEthSLPwd,type='eth');
        myvar.status="1";
        myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
        resp.send(JSON.stringify(myvar));
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
})
app.post('/erc20-account-balance',function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    var myvar= new Object();
    var balanceOBJ        = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        var Myaddress       = req.body.address;
        var adminaddress    = req.body.adminaddress;
        var nickname        = ((req.body.nickname).toString()).toLowerCase();
        console.log(Myaddress);
        console.log(nickname + " getting balance...");
        var contC           = "ContractABI";
        var addrC           = "ContractAddress";
        var newAbi          = nickname+""+contC;
        var newAddress      = nickname+""+addrC;
        var ContractABI     = tokens[newAbi];
        var ContractAddress = tokens[newAddress];
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
                          var estGas=(Math.round(parseInt(gasAmount)*3)).toString();
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
       
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
})
app.post('/erc20-transfer',function(req,resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar= new Object();
  var balanceOBJ        = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      const From            = req.body.from
      const To              = req.body.to
      const Amount          = req.body.amount
      const Type            = req.body.type
      const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
      const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex');
      var nickname          = ((req.body.nickname).toString()).toLowerCase();
      console.log(nickname+" transaction running...");
      var contC             = "ContractABI";
      var addrC             = "ContractAddress";
      var newAbi            = nickname+""+contC;
      var newAddress        = nickname+""+addrC;
      var ContractABI       = tokens[newAbi];
      var ContractAddress   = tokens[newAddress];
      console.log(ContractAddress);
      const contract        = new web3.eth.Contract(ContractABI,ContractAddress, { from: From });
      contract.methods.balanceOf(From).call().then(function(balance)
      {
        contract.methods.decimals().call().then(function(decimal)
        {
          if(decimal > 0)
          {
            var tfrAmount=Number.isInteger(Amount)?Amount:Number.parseFloat(Amount).toFixed(decimal);
            var tfrAmount = tfrAmount* Math.pow(10,decimal);
            var tfrAmount=tfrAmount.toFixedSpecial(0);
          }
          else
          {
            var tfrAmount=parseInt(Amount);
          }
          if(Type=='Move')
          {
            if(nickname=="atcc")
            {
              var minusValueAtcc=(0.5*Math.pow(10,decimal));
              var tfrAmount=((parseInt(tfrAmount)-parseInt(minusValueAtcc)).toFixedSpecial(0)).toString();
            }
          }
           /*if(Type=='Move')
            {
              var tfrAmount=balance;
              if(nickname=="atcc")
              {
                var minusValueAtcc=(0.5*Math.pow(10,decimal));
                var tfrAmount=((parseInt(tfrAmount)-parseInt(minusValueAtcc)).toFixedSpecial(0)).toString();
              }
            }
            else if(Type=='Withdraw')
            {
              if(decimal > 0)
              {
                var tfrAmount=Number.isInteger(Amount)?Amount:Number.parseFloat(Amount).toFixed(decimal);
                var tfrAmount = tfrAmount* Math.pow(10,decimal);
                var tfrAmount=tfrAmount.toFixedSpecial(0);
              }
              else
              {
                 var tfrAmount=Amount;
              }
            }
            */
           if(tfrAmount>0)
           {
              console.log(nickname+" tfrAmount=>",tfrAmount);
              const data            = contract.methods.transfer(To, tfrAmount).encodeABI();
              web3.eth.estimateGas({from: From,to: To,data: data},function(error,gasAmount)
              {
                  console.log('Error=> ',error);
                  console.log('txCount=> ',gasAmount);
                 web3.eth.getGasPrice(function(error1, gasPrice)
                 {
                    console.log('Error1=> ',error1);
                    console.log('txCount=> ',gasPrice);
                    var gasPrice=gasPrice;//+(gasPrice/8);
                    console.log('txCount1=> ',gasPrice);
                    var estGas=(Math.round(parseInt(gasAmount)*3)).toString();
                    web3.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                    {
                      console.log('Error3=> ',error3);
                      console.log('txCount=> ',txCount);
                      console.log('fee=> ',gasPrice * estGas);
                        const txObject = {
                                            nonce     : web3.utils.toHex((txCount)),
                                            to        : ContractAddress,
                                            from      : From,
                                            value     : '0x0',
                                            gasLimit  : web3.utils.toHex(estGas),
                                            gasPrice  : web3.utils.toHex(gasPrice),
                                            data      : data,
                                            chainId   : '0x01'
                                          }
                        const tx = new Tx(txObject)
                        tx.sign(FromPrivateKey1)
                        const serializedTx = tx.serialize()
                        const raw = '0x' + serializedTx.toString('hex')
                        web3.eth.sendSignedTransaction(raw, (error4, txHash) =>
                        {
                          console.log('Error4=> ',error4);
                          /*
                            console.log('txHash=> ',txHash);
                          */
                          if(!error4)
                          {
                            myvar.status    = "1";
                            balanceOBJ.txid = txHash;
                            console.log(txHash);
                            myvar.message   = "Transaction Pending.";
                            myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                            resp.send(JSON.stringify(myvar));
                             console.log('json resp=> ',JSON.stringify(myvar));
                          }
                          else
                          {

                            var newError= error4.toString();
                            myvar.status="0";
                            myvar.message=newError.replace("Error: Returned error: ", "");;
                            resp.send(JSON.stringify(myvar));
                          }
                        })
                    })
                  })
              });
           }
           else
           {
              myvar.status="0";
              myvar.message="Amount Must Be Greater Than 0.";
              resp.send(JSON.stringify(myvar));
           }
        });
      });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
})
app.post('/calculate-gas',function (req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    var myvar= new Object();
    var balanceOBJ        = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        var From            = (req.body.from).toString();
        var To              = (req.body.to).toString();
        var nickname       = ((req.body.nickname).toString()).toLowerCase();
        console.log("Calculating gas price of ",nickname);
        var contC            = "ContractABI";
        var addrC            = "ContractAddress";
        var newAbi          = nickname+""+contC;
        var newAddress      = nickname+""+addrC;
        var ContractABI     = tokens[newAbi];

        var ContractAddress = tokens[newAddress];
        const contract      = new web3.eth.Contract(ContractABI,ContractAddress, { from: From });
        contract.methods.balanceOf(From).call().then(function(balance)
        {
            contract.methods.decimals().call().then(function(decimal)
            {
              console.log("balance:-",balance);
              console.log("decimal:-",decimal);
                //contract.methods.transfer(To, balance).estimateGas({from: From}, function(error, gasAmount)
                const data            = contract.methods.transfer(To, balance).encodeABI();
                web3.eth.estimateGas({from: From,to: To,data: data},function(error,gasAmount)
                {
                  //console.log("error:-",error);
                  if(!error)
                  {
                    web3.eth.getGasPrice(function(error1, gasPrice)
                    {
                      //console.log("gasPrice:-", gasPrice);
                      //console.log("gasAmount:-", gasAmount);
                      var estGas=(Math.round(parseInt(gasAmount)*3)).toString();
                      //var estGas=(Math.round(parseInt(gasAmount)*1.5)).toString();
                      //var estGas=(Math.round(parseInt(gasAmount)*2.5)).toString();
                      var gasAmountXgasPrice=((parseInt(estGas)*parseInt(gasPrice)).toFixedSpecial(0));
                      //console.log("gasAmountXgasPrice:-",gasAmountXgasPrice);
                      var newEstimateGas=web3.utils.fromWei(gasAmountXgasPrice,'ether');
                      myvar.status    = "1";
                      balanceOBJ.balance = newEstimateGas;
                      console.log("estimateGas=> "+newEstimateGas);
                      myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                      resp.send(JSON.stringify(myvar));
                    });
                    }else{
                      myvar.status    = "1";
                        balanceOBJ.balance = '';
                        console.log("estimateGas=> "+'');
                        myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                        resp.send(JSON.stringify(myvar));
                    }
                });
            });
        });
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
});

app.get('/tcc-account-generate', function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("tcc generating address...");
    var myvar= new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        var out=accountsTcc.create();
        var outputOBJ= new Object();
        outputOBJ.address=out.address;
        outputOBJ.privateKey=out.privateKey;
        var newprivkey=(out.privateKey).toString();
        myvar.status="1";
        myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
        resp.send(JSON.stringify(myvar));
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
});
app.post('/tcc-account-balance', function(req,resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  console.log("tcc getting balance...");
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
         web3Tcc.eth.getBalance(Myaddress, function(err, res){
          if(!err)
          {
            console.log('Myaddress=> '+Myaddress);
            myvar.status="1";
            var balanceOBJ=new Object();
            var balance1 =  parseFloat(res);
            var balance2 = math.format(balance1/1000000000000000000, {notation: 'fixed'});
            balanceOBJ.balance=balance2;
            myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
          }
          else
          {
            myvar.status="0";
            myvar.message=err;
          }
          console.log(JSON.stringify(balanceOBJ));
          resp.send(JSON.stringify(myvar));
        });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/tcc-transfer', function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("tcc transaction running...");

  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      const From            = req.body.from
      const To              = req.body.to
      const Amount          = parseFloat(req.body.amount,1)
      console.log(Amount);
      const Type            = req.body.type
      const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
      const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex')
      var balanceOBJ        = new Object();
      web3Tcc.eth.getBalance(From, function(err, res)
      {
          if(!err)
          {
            web3Tcc.eth.getGasPrice(function(error1, gasPrice)
            {
                var estGas   = 21000;
				var gasPrice = 72000000000;
				console.log("gasPrice",gasPrice);
                var fe1 = 100000000000000000;
                if(Type=='Move')
                {

                   var tfrAmount                 = web3Tcc.utils.toWei((math.bignumber(Amount)).toString(),"ether");
                   var newTransferAmount         = math.format(tfrAmount-fe1, {notation: 'fixed'});

                }
                else if(Type=='Withdraw')
                {
                  var tfrAmount             = web3Tcc.utils.toWei((math.bignumber(Amount)).toString(),"ether");
                  var newTransferAmount     = tfrAmount;
                }
                else
                {
                   var newTransferAmount=0;
                }
				console.log("New Amount=>",newTransferAmount);
                if(newTransferAmount > 0)
                {
                    web3Tcc.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                    {
                        console.log('txCount=>',txCount);
						var newTransferAmount1 = newTransferAmount.toString();
                        const txObject = {
                                            nonce     : web3Tcc.utils.toHex((txCount)),
                                            to        : To,
                                            from      : From,
                                            value     : web3Tcc.utils.toHex(newTransferAmount1),
                                            gasLimit  : web3Tcc.utils.toHex(estGas),
                                            gasPrice  : web3Tcc.utils.toHex(gasPrice),
                                            chainId   : 78994
                                          }
                        const tx = new Tx(txObject)
                        tx.sign(FromPrivateKey1)
                        const serializedTx = tx.serialize()
                        const raw = '0x' + serializedTx.toString('hex')
                        web3Tcc.eth.sendSignedTransaction(raw, (error4, txHash) =>
                        {
                          if(!error4)
                          {
                             myvar.status    = "1";
                             balanceOBJ.txid = txHash;
                             console.log(txHash);
                             myvar.message   = "Transaction Pending.";
                             myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                             resp.send(JSON.stringify(myvar));
                          }
                          else
                          {
                             var newError= error4.toString();
							 console.log("New Error", newError); 
                             myvar.status="0";
                             myvar.message=newError.replace("Error: Returned error: ", "");;
                             resp.send(JSON.stringify(myvar));
                          }
                         });
                    })
                }
                else
                {
                  myvar.status="0";
                  myvar.message="Something Wrong.";
                  resp.send(JSON.stringify(myvar));
                }
             })
          }
          else
          {
             myvar.status="0";
             myvar.message="Something Wrong.";
             resp.send(JSON.stringify(myvar));
          }
      });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/tcc-transaction-status', function(req,resp)
{
    var myvar= new Object();

    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
        var token = JSON.stringify(req.headers['x-token']);
        if(MyRNCryptor.authentication(token))
        {
          var dt = dateTime.create();
          dt.format('m/d/Y H:M:S');
          console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash;
            console.log(transactionHash);
            web3Tcc.eth.getTransaction(transactionHash).then(function (TransactionStatus,error)
            {
                if(!error)
                {
                    if(TransactionStatus.blockHash!=null)
                    {
                        web3Tcc.eth.getTransactionReceipt(transactionHash).then(function (receipt)
                        {
                              if(receipt!=null)
                              {
                                  if(receipt.status)
                                  {
                                      myvar.status="1";
                                      myvar.message="Success.";
                                      resp.send(JSON.stringify(myvar));
                                  }
                                  else
                                  {
                                      myvar.status="2";
                                      myvar.message="Failed.";
                                      resp.send(JSON.stringify(myvar));
                                  }
                              }
                              else
                              {
                                  myvar.status="0";
                                  myvar.message="No Record Found.";
                                  resp.send(JSON.stringify(myvar));
                              }
                        });
                    }
                    else
                    {
                       myvar.status="3";
                       myvar.message="Pending.";
                       resp.send(JSON.stringify(myvar));
                    }
                }
                else
                {
                   myvar.status='3';
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
                }
            }).catch(error=>{
                    myvar.status='3';
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
            });
        }
        else
        {
            myvar.status="0";
            myvar.message="Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});

// ==== fsc Starts ====//
app.get('/fsc-account-generate', function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    console.log("fsc generating address...");
    var myvar= new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        var out=accountsFSC.create(); // create adderss here
        var outputOBJ= new Object();
        outputOBJ.address=out.address;
        outputOBJ.privateKey=out.privateKey;
        //console.log(newPrvtkey);
        var newprivkey=(out.privateKey).toString();
        var newEthSLPwd=(req.query.EthSLPwd).toString();
        sLocal(newprivkey,newEthSLPwd,type='fsc');
        //console.log(out);
        myvar.status="1";
        myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
        resp.send(JSON.stringify(myvar));
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
});
app.post('/fsc-account-balance', function(req,resp)
{
  var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
  console.log("fsc getting balance...");
  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var Myaddress = req.body.address;
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
         web3FSC.eth.getBalance(Myaddress, function(err, res){
          if(!err)
          {
            console.log('Myaddress=> '+Myaddress);
           // console.log(res);
            myvar.status="1";
            var balanceOBJ=new Object();
           // var balance1 =  res.toNumber();
            var balance1 =  parseFloat(res);
            var balance2 = math.format(balance1/1000000000000000000, {notation: 'fixed'});
            balanceOBJ.balance=balance2;

            myvar.response=MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
          }
          else
          {
            myvar.status="0";
            myvar.message=err;
          }
          console.log(JSON.stringify(balanceOBJ));
          resp.send(JSON.stringify(myvar));
        });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});
app.post('/fsc-transfer', function(req,resp)
{
  var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
  console.log("fsc transaction running...");

  var myvar= new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      const From            = req.body.from
      const To              = req.body.to
      const Amount          = parseFloat(req.body.amount,1)
      console.log(Amount);
      const Type            = req.body.type
      const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
      const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex')
      var balanceOBJ        = new Object();
      web3FSC.eth.getBalance(From, function(err, res)
      {
          if(!err)
          {
            web3FSC.eth.getGasPrice(function(error1, gasPrice)
            {
                var estGas   = 21000;
                var gasPrice = 72000000000;
                var fe1      = gasPrice*estGas;
                if(Type=='Move')
                {

                   var tfrAmount                 = web3FSC.utils.toWei((math.bignumber(Amount)).toString(),"ether");
                   var newTransferAmount         = math.format(tfrAmount-fe1, {notation: 'fixed'});

                }
                else if(Type=='Withdraw')
                {
                  var tfrAmount             = web3FSC.utils.toWei((math.bignumber(Amount)).toString(),"ether");
                  var newTransferAmount     = tfrAmount;
                }
                else
                {
                   var newTransferAmount=0;
                }
                if(newTransferAmount > 0)
                {
                    web3FSC.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                    {
                        console.log('txCount=> ',txCount);
                        var newTransferAmount1 = newTransferAmount.toString();
                        const txObject = {
                                            nonce     : web3FSC.utils.toHex((txCount)),
                                            to        : To,
                                            from      : From,
                                            value     : web3FSC.utils.toHex(newTransferAmount1),
                                            gasLimit  : web3FSC.utils.toHex(estGas),
                                            gasPrice  : web3FSC.utils.toHex(gasPrice),
                                            chainId   : 1051991
                                          }
                        const tx = new Tx(txObject)
                        tx.sign(FromPrivateKey1)
                        const serializedTx = tx.serialize()
                        const raw = '0x' + serializedTx.toString('hex')
                        web3FSC.eth.sendSignedTransaction(raw, (error4, txHash) =>
                        {
                          if(!error4)
                          {
                            myvar.status    = "1";
                            balanceOBJ.txid = txHash;
                            console.log(txHash);
                            myvar.message   = "Transaction Pending.";
                            myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                            resp.send(JSON.stringify(myvar));
                          }
                          else
                          {
                             var newError= error4.toString();
                             myvar.status="0";
                             myvar.message=newError.replace("Error: Returned error: ", "");;
                             resp.send(JSON.stringify(myvar));
                          }
                        })
                    })
                }
                else
                {
                  myvar.status="0";
                  myvar.message="Something Wrong.";
                  resp.send(JSON.stringify(myvar));
                }
             })
          }
          else
          {
             myvar.status="0";
             myvar.message="Something Wrong.";
             resp.send(JSON.stringify(myvar));
          }
      });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
});

app.post('/fsc-transaction-status', function(req,resp)
{
    var myvar= new Object();

    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
        var token = JSON.stringify(req.headers['x-token']);
        if(MyRNCryptor.authentication(token))
        {
          var dt = dateTime.create();
          dt.format('m/d/Y H:M:S');
          console.log(new Date(dt.now()));
            const transactionHash = req.body.transactionHash;
            console.log(transactionHash);
            web3FSC.eth.getTransaction(transactionHash).then(function (TransactionStatus,error)
            {
                if(!error)
                {
                    if(TransactionStatus.blockHash!=null)
                    {
                        web3FSC.eth.getTransactionReceipt(transactionHash).then(function (receipt)
                        {
                              if(receipt!=null)
                              {
                                  if(receipt.status)
                                  {
                                      myvar.status="1";
                                      myvar.message="Success.";
                                      resp.send(JSON.stringify(myvar));
                                  }
                                  else
                                  {
                                      myvar.status="2";
                                      myvar.message="Failed.";
                                      resp.send(JSON.stringify(myvar));
                                  }
                              }
                              else
                              {
                                  myvar.status="0";
                                  myvar.message="No Record Found.";
                                  resp.send(JSON.stringify(myvar));
                              }
                        });
                    }
                    else
                    {
                       myvar.status="3";
                       myvar.message="Pending.";
                       resp.send(JSON.stringify(myvar));
                    }
                }
                else
                {
                   myvar.status='3';
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
                }
            }).catch(error=>{
                    myvar.status='3';
                    myvar.message="Pending.";
                    resp.send(JSON.stringify(myvar));
            });
        }
        else
        {
            myvar.status="0";
            myvar.message="Invalid Request.";
            resp.send(JSON.stringify(myvar));
        }
    }
});
//== fsc End ====//
//====== FSC 20 Comman Function ==========//
app.get('/fsc20-account-generate',function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    var myvar= new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
         console.log("erc20 (ether) generating address...");
         var out=accountsFSC.create(); // create adderss here
         var outputOBJ= new Object();
         outputOBJ.address=out.address;
         outputOBJ.privateKey=out.privateKey;
         var newprivkey=(out.privateKey).toString();
         //var newEthSLPwd=(req.query.EthSLPwd).toString();
         //sLocal(newprivkey,newEthSLPwd,type='fsc');
         myvar.status="1";
         myvar.response=MyRNCryptor.encrypt(JSON.stringify(outputOBJ));
         resp.send(JSON.stringify(myvar));
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
})
app.post('/fsc20-account-balance',function(req,resp)
{
    var dt = dateTime.create();
    dt.format('m/d/Y H:M:S');
    console.log(new Date(dt.now()));
    var myvar= new Object();
    var balanceOBJ        = new Object();
    if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
    {
      myvar.status="0";
      myvar.message="Invalid Request.";
      resp.send(JSON.stringify(myvar));
    }
    else
    {
      var token = JSON.stringify(req.headers['x-token']);
      if(MyRNCryptor.authentication(token))
      {
        var Myaddress       = req.body.address;
        var adminaddress    = req.body.adminaddress;
        var nickname        = ((req.body.nickname).toString()).toLowerCase();
        console.log(Myaddress);
        console.log(nickname + " getting balance...");
        var contC           = "ContractABI";
        var addrC           = "ContractAddress";
        var newAbi          = nickname+""+contC;
        var newAddress      = nickname+""+addrC;
        var ContractABI     = tokensfsc[newAbi];
        var ContractAddress = tokensfsc[newAddress];
        var tokenContract =  new ethFSC.Contract(ContractABI,ContractAddress);
        tokenContract.methods.balanceOf(Myaddress).call().then(function(balance)
        {
          tokenContract.methods.decimals().call().then(function(decimal)
          {
             if( adminaddress!=null && adminaddress!=undefined && adminaddress!="")
             {
                const data            = tokenContract.methods.transfer(Myaddress, balance).encodeABI();
                web3FSC.eth.estimateGas({from: Myaddress,to: adminaddress,data: data},function(error,gasAmount)
                {
                   if(!error)
                   {
                      web3FSC.eth.getGasPrice(function(error1, gasPrice)
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
                        web3FSC.eth.getBalance(Myaddress, function(err, res)
                        {
                          if(!err)
                          {
                            var ethbalance=web3FSC.utils.fromWei(res,"ether");
                          }
                          else
                          {
                            var ethbalance="0";
                          }
                          var estGas=(Math.round(parseInt(gasAmount)*2.5)).toString();
                          var gasAmountXgasPrice=((parseInt(estGas)*parseInt(gasPrice)).toFixedSpecial(0));
                          var newEstimateGas=web3FSC.utils.fromWei(gasAmountXgasPrice,'ether');
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
                  web3FSC.eth.getBalance(Myaddress, function(err, res)
                  {
                    if(!err)
                    {
                      var ethbalance=web3FSC.utils.fromWei(res,"ether");
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
       
      }
      else
      {
          myvar.status="0";
          myvar.message="Invalid Request.";
          resp.send(JSON.stringify(myvar));
      }
    }
});

app.post('/fsc20-transfer',function(req,resp)
{
  var dt = dateTime.create();
  dt.format('m/d/Y H:M:S');
  console.log(new Date(dt.now()));
  var myvar = new Object();
  var balanceOBJ        = new Object();
  if (!req.headers['x-token'] && JSON.stringify(req.headers['x-token']==""))
  {
    myvar.status="0";
    myvar.message="Invalid Request.";
    resp.send(JSON.stringify(myvar));
  }
  else
  {
    var token = JSON.stringify(req.headers['x-token']);
    if(MyRNCryptor.authentication(token))
    {
      const From            = req.body.from
      const To              = req.body.to
      const Amount          = req.body.amount
      const Type            = req.body.type
      const FromPrivateKey  = (req.body.fromPrivateKey).substring(2);
      const FromPrivateKey1 = Buffer.from(FromPrivateKey, 'hex');
      var nickname          = ((req.body.nickname).toString()).toLowerCase();
      console.log(nickname+" transaction running...");
      var contC             = "ContractABI";
      var addrC             = "ContractAddress";
      var newAbi            = nickname+""+contC;
      var newAddress        = nickname+""+addrC;
      var ContractABI       = tokensfsc[newAbi];
      var ContractAddress   = tokensfsc[newAddress];
      console.log(ContractAddress);
      const contract = new web3FSC.eth.Contract(ContractABI,ContractAddress, { from: From });
      contract.methods.balanceOf(From).call().then(function(balance)
      {
        contract.methods.decimals().call().then(function(decimal)
        {
          if(decimal > 0)
          {
            var tfrAmount=Number.isInteger(Amount)?Amount:Number.parseFloat(Amount).toFixed(decimal);
            var tfrAmount = tfrAmount* Math.pow(10,decimal);
            var tfrAmount=tfrAmount.toFixedSpecial(0);
          }
          else
          {
            var tfrAmount=parseInt(Amount);
          }
          if(Type=='Move')
          {
            if(nickname=="atcc")
            {
              var minusValueAtcc=(0.5*Math.pow(10,decimal));
              var tfrAmount=((parseInt(tfrAmount)-parseInt(minusValueAtcc)).toFixedSpecial(0)).toString();
            }
          }
           
           if(tfrAmount>0)
           {
              console.log(nickname+" tfrAmount=>",tfrAmount);
              const data = contract.methods.transfer(To, tfrAmount).encodeABI();
              web3FSC.eth.estimateGas({from: From,to: To,data: data},function(error,gasAmount)
              {
                  console.log('Error=> ',error);
                  console.log('txCount=> ',gasAmount);
                  web3FSC.eth.getGasPrice(function(error1, gasPrice)
                  {
                    console.log('Error1=> ',error1);
                    console.log('txCount=> ',gasPrice);
                    var gasPrice=gasPrice*2;//+(gasPrice/8);
                    console.log('txCount1=> ',gasPrice);
                    var estGas=(Math.round(parseInt(gasAmount)*2.5)).toString();
                    web3FSC.eth.getTransactionCount(From, "pending", (error3, txCount) =>
                    {
                        console.log('Error3=>',error3);
                        console.log('txCount=>',txCount);
                        console.log('fee=>',gasPrice * estGas);
                        const txObject = {
                                            nonce     : web3FSC.utils.toHex((txCount)),
                                            to        : ContractAddress,
                                            from      : From,
                                            value     : '0x0',
                                            gasLimit  : web3FSC.utils.toHex(estGas),
                                            gasPrice  : web3FSC.utils.toHex(gasPrice),
                                            data      : data,
                                            chainId   : 1051991
                                          }
                        const tx = new Tx(txObject)
                        tx.sign(FromPrivateKey1)
                        const serializedTx = tx.serialize()
                        const raw = '0x' + serializedTx.toString('hex')
                        web3FSC.eth.sendSignedTransaction(raw, (error4, txHash) =>
                        {
                          console.log('Error4=> ',error4);
                          if(!error4)
                          {
                            myvar.status    = "1";
                            balanceOBJ.txid = txHash;
                            console.log(txHash);
                            myvar.message   = "Transaction Pending.";
                            myvar.response  = MyRNCryptor.encrypt(JSON.stringify(balanceOBJ));
                            resp.send(JSON.stringify(myvar));
                            console.log('json resp=> ',JSON.stringify(myvar));
                          }
                          else
                          {

                            var newError= error4.toString();
                            myvar.status="0";
                            myvar.message=newError.replace("Error: Returned error: ", "");;
                            resp.send(JSON.stringify(myvar));
                          }
                        })
                    })
                  })
              });
           }
           else
           {
              myvar.status="0";
              myvar.message="Amount Must Be Greater Than 0.";
              resp.send(JSON.stringify(myvar));
           }
        });
      });
    }
    else
    {
        myvar.status="0";
        myvar.message="Invalid Request.";
        resp.send(JSON.stringify(myvar));
    }
  }
})
app.post('/isvalidaddress',function(req,resp)
{
    var myvar     = new Object();
    var currency  = req.body.currency;

    if(currency=="nem" || currency=="xem")
    {
        var valid = sdknem.model.address.isValid(req.body.address);
    }
    else
    {
        var valid = WAValidator.validate(req.body.address, req.body.currency);
    }
    if(valid)
    {
        //console.log('Address INVALID');
        myvar.status="1";
        myvar.message="Valid Address.";
        resp.send(JSON.stringify(myvar));
    }
    else
    {
        //console.log('Address INVALID');
        myvar.status="0";
        myvar.message="Invalid Address.";
        resp.send(JSON.stringify(myvar));
    }
});
function MytoFixed(x)
{
  return (math.bignumber(x).toFixed(18));
}

function sLocal(pkey,pd,type='')
{
  if(pkey!="")
  {

    var start = Date.now();
    if(type=='eth')
    {

    //var pathWithName="C:/Users/Administrator/AppData/Roaming/Ethereum/keystore/"+start;
   // var pathWithName="C:/Users/Administrator/AppData/Local/Ethereum/keystore/"+start;
    var pathWithName="C:/Ethereum/keystore/"+start;

    var encryptedData=web3.eth.accounts.encrypt(pkey,pd);
    }
    else if(type='fsc')
    {
      var pathWithName="C:/FSC/keystore/"+start;
      var encryptedData=web3FSC.eth.accounts.encrypt(pkey,pd);
    }
    else
    {
      return false;
    }
    // writeFile function with filename, content and callback function
    fs.writeFile(pathWithName, JSON.stringify(encryptedData), function (err)
    {
      if (err)
      {
        return false;
      }
      else
      {
        return true;
      };
    });
  }
};

app.listen(8384);
