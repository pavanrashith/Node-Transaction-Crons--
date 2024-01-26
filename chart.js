const TronWeb       		= require('tronweb') // install tronweb
const HttpProvider  		= TronWeb.providers.HttpProvider;
var express         		= require('express');
var app 					= express();
const fullNode 				= new HttpProvider("https://api.trongrid.io");
const solidityNode 			= new HttpProvider("https://api.trongrid.io");
const eventServer 			= new HttpProvider("https://api.trongrid.io");
const privateKey 			= "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
const tronWeb 				= new TronWeb(fullNode,solidityNode,eventServer,privateKey);
const fetch                 = require('node-fetch');
const ethers 				= require('ethers') // install ethers
const AbiCoder 				= ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX  = /^(41)/;
const ADDRESS_PREFIX 		= "41";

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Micro@123#@",
    database: 'chart',
    port: '3306'
});

async function select_db(table, data = '*', condition = "", otherStatement = "") {
    return new Promise(async function(resolve, reject) {
        var sql = 'SELECT ' + data + ' FROM ' + table;
        if (condition != "") {
            sql += ' WHERE ' + condition;
        }
        if (otherStatement != "") {
            sql += ' ' + otherStatement;
        }
        con.query(sql, function(err, result) {
            if (err) trx_blocks();
            resolve(result);
        });
    });
};

async function insert_db(table, conditionfields, conditionValues) {
    return new Promise(async function(resolve, reject) {
        var sql = 'INSERT INTO ' + table + ' (' + conditionfields + ') VALUES ' + conditionValues;
        con.query(sql, function(err, result) {
            if (err) console.log(err);
            resolve(result);
        });
    });
};
 
async function update_db(table, condition, updatedata) {
    return new Promise(async function(resolve, reject) {
        var sql = 'UPDATE ' + table + ' SET ' + updatedata + ' WHERE ' + condition;
        con.query(sql, function(err, result) {
            if (err) trx_blocks();
            resolve(result);
        });
    });
};

function getBlockNumber() {
    return new Promise( async function(resolve, reject) {
     tronWeb.trx.getCurrentBlock(async function(err, result) {
            if (err) trx_blocks();
			resolve(result.block_header.raw_data.number);
        });
    });
};

function getBlockHash(i) {
    return new Promise(function(resolve, reject) {
        tronWeb.trx.getBlockByNumber(i, async function(err, result) {
            if (err) trx_blocks();
            resolve(result.blockID);
        });
    });
};

async function getBlock(i) {
    return new Promise(async function(resolve, reject) {
        tronWeb.trx.getBlockByHash(i, async function(err, getBlockDetails) {
            if (err) trx_blocks();
            resolve(getBlockDetails);
        });
    });
};

async function decodeParams(types, output, ignoreMethodHash) 
{
    if (!output || typeof output === 'boolean') {
        ignoreMethodHash = output;
        output = types;
    }
    if (ignoreMethodHash && output.replace(/^0x/, '').length % 64 === 8)
        output = '0x' + output.replace(/^0x/, '').substring(8);

    const abiCoder = new AbiCoder();
    if (output.replace(/^0x/, '').length % 64)
        throw new Error('The encoded string is not valid. Its length must be a multiple of 64.');
    return abiCoder.decode(types, output).reduce((obj, arg, index) => {
        if (types[index] == 'address')
            arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
        obj.push(arg);
        return obj;
    }, []);
}

trx_blocks();
async function trx_blocks(){
    var data 		   = "*";
    var table 		   = "latestblock";
    var condition 	   = "";
    var otherStatement = "";
    var newBlockNumber = await getBlockNumber();
    var StoredBlock    = await select_db(table, data, condition, otherStatement);
    var StartingBlock  = parseInt(StoredBlock[0].blockNumber) + 1;
    for(var i = StartingBlock; i <= newBlockNumber; i++) {
		console.log("block=>",i);
        var BlockHash 			= await getBlockHash(i);
		var BlockDetails 		= await getBlock(BlockHash);
        var FetchedTransactions = BlockDetails.transactions;
        var arrayLength 		= FetchedTransactions != undefined ? FetchedTransactions.length : 0;
        if(arrayLength > 0)
		{
			for(var j = 0; j < arrayLength; j++) 
			{
			   var trx = FetchedTransactions[j];
			   if(trx.ret[0].contractRet=="SUCCESS")
			   {
				   if(trx.raw_data.contract[0].parameter.value.contract_address)
				   {
					   var toaddress = await tronWeb.address.fromHex(trx.raw_data.contract[0].parameter.value.contract_address);
					   if (toaddress=="TLX771cbbQTWKdKpkg6QvX51P5oNFBA11x") 
					   {
						  try 
						  {
							 console.log(trx.txID); 
							 const response = await fetch('https://api.trongrid.io/v1/transactions/'+trx.txID+'/events')
							 const json     = await response.json();
							 const inner    = json.data.length;
							 for(var k = 0; k < inner; k++) 
							 {
								var ref = '0x'; 
								if(json.data[k].event_name=="RefBonus")
								{
									var referrer  = await tronWeb.address.fromHex(json.data[k].result.referrer);
									var amount    = parseFloat(tronWeb.fromSun(json.data[k].result.amount)).toFixed(8);
									var referral  = await tronWeb.address.fromHex(json.data[k].result.referral);
									var level     = json.data[k].result.level;
									var txid      = json.data[k].transaction_id;
									var blkn      = json.data[k].block_number;	
									var blkt      = json.data[k].block_timestamp;
									var condition = 'referrer,referral,level,amount,txid,blkn,blkt';
									var value     = "('" + referrer + "','" + referral + "','" + level + "','" + amount + "','" + txid + "','" + blkn + "','" + blkt + "')";
									var checkAl = await select_db("reward", "*", "txid='" + txid + "' AND level='" + level + "'", '');
									if(checkAl.length==0) 
									{
										 await insert_db("reward", condition, value);
									}
								} 
								else if(json.data[k].event_name=="NewDeposit")
								{
									 console.log("Yes");
									 var user   = await tronWeb.address.fromHex(json.data[k].result.user);
									 var amount = parseFloat(tronWeb.fromSun(json.data[k].result.amount)).toFixed(8); 
									 var txid   = json.data[k].transaction_id;
									 var blkn   = json.data[k].block_number;	
									 var blkt   = json.data[k].block_timestamp;
									 var condition = 'user,amount,txid,blkn,blkt';
									 var value   = "('" + user + "','" + amount + "','" + txid + "','" + blkn + "','" + blkt + "')";
									 var checkAl = await select_db("deposit", "*", "txid='" + txid + "'", '');
									 if(checkAl.length==0) 
									 {
										 await insert_db("deposit", condition, value);
									 }
								}
							 }
						  } 
						  catch (error) 
						  {
							  console.log(error.response.body);
						  }
					   }
				   }
			   }
			}
         }
         await update_db("latestblock", 'id=1', 'blockNumber=' + i);
    }
	setTimeout(function(){
		trx_blocks();
	}, 10*1000);
}
app.listen(5560);
