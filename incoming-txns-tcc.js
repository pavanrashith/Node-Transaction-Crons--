var express = require('express');
var app = express();
var Web3 = require('web3');
var request = require('request');
var InputDataDecoder = require('ethereum-input-data-decoder');
//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8505'));
//const web3wss = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8506'));
var web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.tccblocks.info'));
var mysql = require('mysql');  
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
            if (err) eth_blocks();
            resolve(result);
        });
    });
};

async function insert_db(table, conditionfields, conditionValues) {
    return new Promise(async function(resolve, reject) {
        var sql = 'INSERT INTO ' + table + ' (' + conditionfields + ') VALUES ' + conditionValues;
        con.query(sql, function(err, result) {
            if (err) eth_blocks();
            resolve(result);
        });
    });
};

async function update_db(table, condition, updatedata) {
    return new Promise(async function(resolve, reject) {
        var sql = 'UPDATE ' + table + ' SET ' + updatedata + ' WHERE ' + condition;
        con.query(sql, function(err, result) {
            if (err) eth_blocks();
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
        web3.eth.getBlockNumber(async function(err, BlockNumber) {
            if (err) eth_blocks();
            resolve(BlockNumber);
        });
    });
};

async function getBlock(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getBlock(i, async function(err, getBlockDetails) {
            if (err) eth_blocks();
            resolve(getBlockDetails);
        });
    });
};

async function getTransactionReceipt(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getTransaction(i, async function(err, TransactionReceipt) {
            if (err) eth_blocks();
            resolve(TransactionReceipt);
        });
    });
};

async function getTransactionReceiptall(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getTransactionReceipt(i, async function(err, TransactionReceipt) {
            if (err) eth_blocks();
            resolve(TransactionReceipt);
        });
    });
};

async function decimails(abi, address) {
    return new Promise(async function(resolve, reject) {
        var tokenContract = new web3.eth.Contract(abi, address);
        tokenContract.methods.decimals().call().then(async function(decimal) {
            resolve(decimal);
        });
    });
};

async function checkStatusByConfirmBlock(latestBlock) {
    var toconfirm = latestBlock - 9;
    await update_db("trade_receive", 'status=0 AND block IS NOT NULL AND cur_type="TCC"', 'confirmation=' + latestBlock + "-block");
    var checkTrx = await select_db("trade_receive", "*", "block <= '" + toconfirm + "' AND status=0 AND block IS NOT NULL AND cur_type='TCC'", '');
    if (checkTrx.length > 0) {
        checkTrx.forEach(async function(row) {
            var txnid = row.txid;
            var transactionReceiptDetails = await getTransactionReceiptall(txnid);
            if (transactionReceiptDetails != null) {
                if (transactionReceiptDetails.status) {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="TCC"', 'status=1');
                } else {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="TCC"', 'status=2');
                }
            }
        });
    }
}

eth_blocks();
async function eth_blocks() {
     var data = "*";
     var table = "latestblock_tcc";
     var condition = "";
     var otherStatement = "";
     var newBlockNumber = await getBlockNumber();
     var StoredBlock = await select_db(table, data, condition, otherStatement);
     var StartingBlock = parseInt(StoredBlock[0].blockNumber) + 1;
	 console.log("StartingBlock=>", StartingBlock);
     for (var i = StartingBlock; i <= newBlockNumber; i++) {
        console.log("Block=>", i);
        checkStatusByConfirmBlock(i);
        var BlockDetails = await getBlock(i);
        var FetchedTransactions = BlockDetails.transactions;
        var arrayLength = FetchedTransactions.length;
        if (arrayLength > 0)
		    {
            for (var j = 0; j < arrayLength; j++) {
                var trx = await getTransactionReceipt(FetchedTransactions[j]);
				if(trx!=null)
				{
                var toaddress = trx.to;
                var checkTrx = await select_db("trade_receive", "*", "txid='" + trx.hash + "' AND block IS NOT NULL", '');
                if (checkTrx.length==0){
                    if (trx.input == "0x") {
                        var checkAddress = await select_db("address", "*", "address='" + toaddress + "' AND currency='91'", '');
                        if (checkAddress.length > 0) {
                            console.log("Ether");
							 var checkCurrency = await select_db("currency", "*", "id='" + 91 + "' AND status='1'", '');
                            var newBalance = parseFloat(trx.value / Math.pow(10, 18)).toFixed(8);
                            var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
                            var type='Other Exchange';
                            var cur_type='TCC';
							var insertStatus=0;
							/* if(newBalance<minimum_deposit)
							{
								var insertStatus=2;
							} */
							if(newBalance<checkCurrency['0']['minimum_deposit'])
							{
								var insertStatus=2;
							}
                            var value = "('" + checkAddress['0']['userid'] + "','" + checkAddress['0']['currency'] + "','" + newBalance + "','" + insertStatus + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
                            await insert_db("trade_receive", condition, value);
                        }
                    } 
                  }
		     	}
            }
        }
		await update_db("latestblock_tcc", 'id=1', 'blockNumber=' + i);
    }
	setTimeout(function(){
		eth_blocks();
	}, 1000*1000);
}
app.listen(8777);
