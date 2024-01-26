var express = require('express');
var app = express();
var request = require('request');
var blockchain = require('blockchain.info')
var Socket = require('blockchain.info/Socket')
var blockexplorer = require('blockchain.info/blockexplorer')
var MyWallet = require('blockchain.info/MyWallet')
var mySocket = new Socket()
const apiCode = 'c76d80ac-202f-44ad-8b67-ac2f2670577c';
const btcSatRate   = 100000000;
var mysql = require('mysql');
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Micro@123#@",
    database: 'fiveexchange',
    port: '3306',
    debug    :  false
});
async function select_db(table, data = '*', condition = "", otherStatement = "") {
    return new Promise(async function(resolve, reject) {
		pool.getConnection((err, con) => {
			var sql = 'SELECT ' + data + ' FROM ' + table;
			if (condition != "") {
				sql += ' WHERE ' + condition;
			}
			if (otherStatement != "") {
				sql += ' ' + otherStatement;
			} 
			sql= mysql.format(sql);
			con.query(sql, function(err, result) {
				if (err) reject(err);
				
				resolve(result);
				con.release();
			});
        });
    });
};

async function insert_db(table, conditionfields, conditionValues) {
    return new Promise(async function(resolve, reject) {
		pool.getConnection((err, con) => {
			var sql = mysql.format('INSERT INTO ' + table + ' (' + conditionfields + ') VALUES '+conditionValues);
			
			con.query(sql, function(err, result) {
				if (err) reject(err);
				
				resolve(result);
				con.release();
			});
        });
    });
};

async function update_db(table, condition, updatedata) {
    return new Promise(async function(resolve, reject) {
		pool.getConnection((err, con) => {
			var sql = mysql.format('UPDATE ' + table + ' SET ' + updatedata + ' WHERE ' + condition);
			
			con.query(sql, function(err, result) {
				if (err) reject(err);
				
				resolve(result);
				con.release();
			});
        });
    });
};
blockDetail();
async function blockDetail()
{
    var data            = "*";
    var table           = "latestBlock_btc";
    var condition       = "";
    var otherStatement  = "";
    var newBlock        = await blockexplorer.getLatestBlock({apiCode:apiCode});
    var newBlockNumber  = newBlock.height;
    var StoredBlock     = await select_db(table, data, condition, otherStatement);
    var StartingBlock   = parseInt(StoredBlock[0].blockNumber)+1;
    for(var i=StartingBlock; i <= newBlockNumber; i++)
    {
	   console.log("Block=>",i);  
	   checkStatusByConfirmBlockBTC();
       var BlockDetailsAll = await blockexplorer.getBlockHeight(i, {apiCode:apiCode});
       if(BlockDetailsAll && BlockDetailsAll.blocks && BlockDetailsAll.blocks.length > 0) 
        {
            BlockDetailsAll.blocks.forEach(async function(BlockDetails)
            {
                var transacations = BlockDetails.tx;
                if(transacations)
                {
                    transacations.forEach(async function(trRaw)
                    {
						
					    if(trRaw.hash=="14d60571ac2db14b4e6255e7c79060c335893f76cd36d204fa962be9b90efbc8")
						{
							console.log(trRaw.out);
						}
                        var checkTrx = await select_db("trade_receive", "*", "txid='"+trRaw.hash+ "'", '');
                        if(checkTrx.length >  0)
                        {
                            var inputTransactions=trRaw.out;
                            if(inputTransactions.length > 0)
                            {
                                inputTransactions.forEach(async function(inTrRaw)
                                {
                                    if(inTrRaw.addr)
                                    {
                                        var CheckSelectData= await select_db("address", '*', "address='"+inTrRaw.addr+"' AND currency='1'", "");
                                        if(CheckSelectData.length > 0)
                                        {
                                             var block=i;
                                             update_db("trade_receive", 'txid="' + txnid + '"', 'block="'+i+'"');
                                        }
                                    }
                                })
                            }
                        }
                        else
                        {
                            var inputTransactions=trRaw.out;
                            if(inputTransactions.length > 0)
                            {
                                inputTransactions.forEach(async function(inTrRaw)
                                {
                                    if(inTrRaw.addr)
                                    {
                                        var CheckSelectData= await select_db("address", '*', "address='"+inTrRaw.addr+"' AND currency='1'", "");
                                        if(CheckSelectData.length > 0)
                                        {
                                            var userid=CheckSelectData[0].userid;
                                            var amount=parseInt(inTrRaw.value)/btcSatRate;
                                            var currency=CheckSelectData[0].currency;
                                            var status=0;
                                            var txid=trRaw.hash
                                            var block=i;
                                            var type='Other Exchange';
                                            var cur_type='BTC';
                                            var condition = 'userid,amount,currency,status,txid,block,type,cur_type';
                                            var value = "('" + userid + "','" + amount + "','" + currency + "','" + status + "','"+ txid + "','" + block + "','" + type + "','" + cur_type + "')";
											insert_db("trade_receive",condition,value);
                                        }
                                    }
                                })
                            }
                        }
                    })
                 }
                 update_db("latestBlock_btc", 'id=1', 'blockNumber=' + i);
            }); 
        }
    }
}
async function txnsDetail(txn)
{
    var hash = JSON.parse(txn.utf8Data).x.hash;
    var checkTrx = await select_db("trade_receive", "*", "txid='"+hash+ "'",'');
    if(checkTrx.length==0) {
        var inputTransactions=JSON.parse(txn.utf8Data).x.out;
        if(inputTransactions.length > 0)
        {
            if(inputTransactions.addr)
            {
                var CheckSelectData= await select_db("address", '*', "address='"+inputTransactions.addr+"' AND currency='1'", "");
                if(CheckSelectData.length > 0)
                {
                    var userid=CheckSelectData[0].userid;
                     var amount=parseInt(inTrRaw.value)/btcSatRate;
                     var currency=1;
                     var status=0;
                     var txid=trRaw.hash
                     var type='Other Exchange';
                     var cur_type='BTC';
                     var condition = 'userid,amount,currency,status,txid,type,cur_type';
                     var value = "('" + userid + "','" + amount + "','" + currency + "','" + status + "','"+ txid + "','" + type + "','" + cur_type + "')";
                     await insert_db("trade_receive",condition,value);
                }
            }
        }
    }
}
async function checkStatusByConfirmBlockBTC() {
    var newBlock        = await blockexplorer.getLatestBlock({apiCode:apiCode});
    var newBlockNumber  = newBlock.height;
    //console.log(newBlockNumber)
    var toconfirm = newBlockNumber - 4;
    await update_db("trade_receive", 'status=0 AND block IS NOT NULL AND cur_type="BTC"', 'confirmation=' + newBlockNumber + '-block');
    var checkTrx = await select_db("trade_receive", "*", "block <= '" + toconfirm + "' AND status=0 AND block IS NOT NULL AND cur_type='BTC'", '');
    if (checkTrx.length > 0) 
    {
        checkTrx.forEach(async function(row) 
        {
            var txnid = row.txid;
            update_db("trade_receive", 'txid="' + txnid + '"', 'status=1');
        });
    }
}

var wsUri = "wss://ws.blockchain.info/inv";
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
client.on('connect', function(connection) {
    connection.send(JSON.stringify({"op":"blocks_sub"}));
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('Connection Closed');
		//connnection.connect();
		client.connect(wsUri);
    });
    connection.on('message', function(message){
        if(JSON.parse(message.utf8Data).op=="utx")
        {
             txnsDetail(message);
        }
        else 
        {
            blockDetail();
            checkStatusByConfirmBlockBTC();
        }  
    });
}); 
client.connect(wsUri);
app.listen(8577);