var express = require('express');
var app = express();
var request = require('request');
var mysql = require('mysql');
var litecoin = require('node-litecoin');
var client = new litecoin.Client({
    host: 'localhost',
    port: 19332,
    user: 'litecoin@gaffer',
    pass: 'Tas@@Shankar123$'
});
/*
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Micro@123#@",
    database: 'fiveexchange',
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
            if (err) console.log(err);
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
           if (err) console.log(err);
            resolve(result);
        });
    });
};
*/
const pool = mysql.createPool({
    connectionLimit : 100, //important
    host: "localhost",
    user: "root",
    password: "Micro@123#@",
    database: 'fiveexchange',
    port: '3306',
    debug    :  false
});

async function select_db(table, data = '*', condition = "", stJoin = "", otherStatement = "") {
    return new Promise(async function(resolve, reject) {
		pool.getConnection((err, con) => {
			var sql = 'SELECT ' + data + ' FROM ' + table;
			if (stJoin != "") {
				sql += ' ' + stJoin;
			}
			if (condition != "") {
				sql += ' WHERE ' + condition;
			}
			if (otherStatement != "") {
				sql += ' ' + otherStatement;
			}
			
			con.query(sql, function(err, result) {
				if (err) console.log(err);
				
				
				resolve(result);
				 con.release();
			});
        });
    });
};

async function insert_db(table, conditionfields, conditionValues) {
    return new Promise(async function(resolve, reject) {
		pool.getConnection((err, con) => {
			var sql = 'INSERT INTO ' + table + ' (' + conditionfields + ') VALUES ' + conditionValues;
			
			con.query(sql, function(err, result) {
				if (err) console.log(err);
				
				resolve(result);
				con.release();
			});
        });
    });
};

async function update_db(table, condition, updatedata) {
    return new Promise(async function(resolve, reject) {
		pool.getConnection((err, con) => {
			var sql = 'UPDATE ' + table + ' SET ' + updatedata + ' WHERE ' + condition;
			
			con.query(sql, function(err, result) {
				if (err) console.log(err);
				
				resolve(result);
				con.release();
			});
        });
    });
};
function getBlockNumber() {
    return new Promise(function(resolve, reject) {
    	client.getBlockCount(function(err, block) {
    	  if (err) console.log(err);
    		resolve(block);
    	})
    });
};

async function getBlockHash(i) {
    return new Promise(function(resolve, reject) {
    	client.getBlockHash(i, async function(err, blockhash) {
    	   if (err) console.log(err);
    		resolve(blockhash);
    	})
    });
};

async function getBlock(blockhash) {
    return new Promise(async function(resolve, reject) {
    	client.getBlock(blockhash, async function(err, blockdetails) {
		  if (err) console.log(err);	
    	   resolve(blockdetails);
    	});
    });
};

async function getTransactionReceipt(txn) {
    return new Promise(async function(resolve, reject) {
        client.getTransaction(txn, async function(err, txndetails){
        	 if (err) resolve(null);
        	  resolve(txndetails);
		 });
    });
};

async function checkStatusByConfirmBlock(latestBlock) {
    var toconfirm = latestBlock - 2;
    await update_db("trade_receive", 'status=0 AND block IS NOT NULL AND cur_type="LTC"', 'confirmation=' + latestBlock + "-block");
    var checkTrx = await select_db("trade_receive", "*", "block <= '" + toconfirm + "' AND status=0 AND block IS NOT NULL AND cur_type='LTC'", '');
    if (checkTrx.length > 0) 
	{
        checkTrx.forEach(async function(row)
		{
            var txnid = row.txid;
            await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="LTC"', 'status=1');
        });
    }
}

ltc_blocks();
async function ltc_blocks() 
{
    var data = "*";
    var table = "latestblock_ltc";
    var condition = "";
    var otherStatement = "";
    var newBlockNumber = await getBlockNumber();
	var newBlockNumber = newBlockNumber-4;
    var StoredBlock = await select_db(table, data, condition, otherStatement);
    var StartingBlock = parseInt(StoredBlock[0].blockNumber) + 1;
	 console.log("StartingBlock=>", StartingBlock);
     for (var i = StartingBlock; i <= newBlockNumber; i++) 
	 {
        
        checkStatusByConfirmBlock(i);
        var hash = await getBlockHash(i);
        var BlockDetails = await getBlock(hash);
		if (BlockDetails.tx && BlockDetails.tx.length > 0) {
			var FetchedTransactions = BlockDetails.tx;
			var arrayLength = FetchedTransactions.length;
            for (var j = 0; j < arrayLength; j++) {
                var trx = await getTransactionReceipt(FetchedTransactions[j]);
				if(trx!=null)
				{ 
			       console.log(trx);
                   if(trx.details[0]['address']){
                           var toaddress = trx.details[0]['address']
			               var checkTrx = await select_db("trade_receive", "*", "txid='" + trx.txid + "' AND block IS NOT NULL", '');
			                if (checkTrx.length==0){
			                        var checkAddress = await select_db("address", "*", "address='" + toaddress + "' AND currency='104'",'');
			                        if (checkAddress.length > 0) {
										console.log("Txn Incoming");
										 var checkCurrency = await select_db("currency", "*", "id='" + 104 + "' AND status='1'", '');
										var crnickName=checkCurrency['0']['nickname'];
			                            var newBalance = trx.amount;
			                            var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
			                            var type='Other Exchange';
			                            var cur_type='LTC';
										var insertStatus=0;
										/* if(newBalance<minimum_deposit)
										{
											var insertStatus=2;
										} */
										if(newBalance<checkCurrency['0']['minimum_deposit'])
										{
											var insertStatus=2;
										}
			                            var value = "('" + checkAddress['0']['userid'] + "','" + checkAddress['0']['currency'] + "','" + newBalance + "','" + insertStatus + "','" + trx.txid + "','" + i + "','" + type + "','" + cur_type + "')";
			                            await insert_db("trade_receive", condition, value);
			                        }
			                  }
					 }
		     	}
            }
        }
		await update_db("latestblock_ltc", 'id=1', 'blockNumber=' + i);
    }
	setTimeout(function(){
		ltc_blocks();
	}, 5*60*1000);
}
app.listen(8575);
