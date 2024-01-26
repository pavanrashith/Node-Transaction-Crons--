var express = require('express');
var app = express();
var Web3 = require('web3');
var request = require('request');
var InputDataDecoder = require('ethereum-input-data-decoder');
var tokens = require('./tokensfsc');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8585'));
const web3wss = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8586'));
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
        web3.eth.getBlockNumber(async function(err, BlockNumber) {
            if (err) console.log(err);
            resolve(BlockNumber);
        });
    });
};

async function getBlock(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getBlock(i, async function(err, getBlockDetails) {
            if (err) console.log(err);
            resolve(getBlockDetails);
        });
    });
};

async function getTransactionReceipt(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getTransaction(i, async function(err, TransactionReceipt) {
            if (err) console.log(err);
            resolve(TransactionReceipt);
        });
    });
};

async function getTransactionReceiptall(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getTransactionReceipt(i, async function(err, TransactionReceipt) {
            if (err) console.log(err);
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

async function balance(abi, address, baddress) {
    return new Promise(async function(resolve, reject) {
        var tokenContract = new web3.eth.Contract(abi, address);
        tokenContract.methods.balanceOf(baddress).call().then(async function(balance) {
			if(balance && !isNaN(balance) && balance > 0)
			{
				resolve(balance);
			}
			else
			{
			    resolve(0);
			}
        });
    });
};

async function checkStatusByConfirmBlock(latestBlock) {
    var toconfirm = latestBlock - 10;
    await update_db("trade_receive", 'status=0 AND block IS NOT NULL AND cur_type="FSC"', 'confirmation=' + latestBlock + "-block");
    var checkTrx = await select_db("trade_receive", "*", "block <= '" + toconfirm + "' AND status=0 AND block IS NOT NULL AND cur_type='FSC'", '');
    if (checkTrx.length > 0) {
        checkTrx.forEach(async function(row) {
            var txnid = row.txid;
            var transactionReceiptDetails = await getTransactionReceiptall(txnid);
            if (transactionReceiptDetails != null) {
                if (transactionReceiptDetails.status) {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="FSC"', 'status=1');
                } else {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="FSC"', 'status=2');
                }
            }
        });
    }
}

/*
const subscription = web3wss.eth.subscribe('newBlockHeaders', function(error, result) {
if (error)
   console.log(error);
})
.on("data", async function(blockHeader) {
    eth_blocks();
});
*/

eth_blocks();
async function eth_blocks() {
    var data = "*";
    var table = "latestblock_fsc";
    var condition = "";
    var otherStatement = "";
    var newBlockNumber = await getBlockNumber();
	console.log("NewBlockNumber=>", newBlockNumber);
    var StoredBlock = await select_db(table, data, condition, otherStatement);
    var StartingBlock = parseInt(StoredBlock[0].blockNumber);
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
                        var checkAddress = await select_db("address", "*", "address='" + toaddress + "' AND currency='5'", '');
                        if (checkAddress.length > 0) {
                            console.log("Ether");
							 var checkCurrency = await select_db("currency", "*", "id='" + 5 + "' AND status='1'", '');
                            var crnickName=checkCurrency['0']['nickname'];
                            var newBalance = parseFloat(trx.value / Math.pow(10, 18)).toFixed(8);
                            var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
                            var type='Other Exchange';
                            var cur_type='FSC';
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
                    } else {
                        var checkAddress = await select_db("currency", "*", "contract_address='" + toaddress + "' AND status='1' AND deposit_status='1'", '');
                        if (checkAddress.length > 0) {
                            var contC = "ContractABI";
                            var newAbi = checkAddress['0']['nickname'].toLowerCase() + "" + contC;
							//console.log("contract_address=>",checkAddress['0']['contract_address']);
							//console.log("newAbi=>",newAbi);
							try {
								var ContractABI = tokens[newAbi];
								console.log("ContractABI=>",ContractABI);
								var decoder = new InputDataDecoder(ContractABI);
								var result = decoder.decodeData(trx.input);
								if (result.inputs[0]) {
									if (result.method == "transfer") {
										var address = '0x' + result.inputs[0];
										var value = result.inputs[1].toString();
										var checkAddressToken = await select_db("address", "*", "address='" + address + "' AND currency='" + checkAddress['0']['id'] + "'", '');
										if (checkAddressToken.length > 0) {
											console.log("Token");
											var token_de = await decimails(ContractABI, toaddress);
											if (token_de != 0) 
											{
												var newBalance = parseFloat(value / Math.pow(10, token_de)).toFixed(8);
											} 
											else 
											{
												var newBalance = value;
											}
											var insertStatus=0;
											/* if(newBalance<minimum_deposit)
											{
												var insertStatus=2;
											} */
											if(newBalance<checkAddress['0']['minimum_deposit'])
											{
												var insertStatus=2;
											}
											var not_move = await select_db("trade_receive", "IFNULL(SUM(amount),0) as Total", "userid='" + checkAddressToken['0']['userid'] + "' AND txid IS NOT NULL AND moved_status='0' AND currency='" + checkAddress['0']['id'] + "'", '');
											var old = parseFloat(not_move['0']['Total']).toFixed(8);
											var newb = parseFloat(old+newBalance).toFixed(8);
											var live_balance = await balance(ContractABI, toaddress, address);
											if (token_de != 0) 
											{
												var newLiveBalance = parseFloat(live_balance / Math.pow(10, token_de)).toFixed(8);
											} 
											else 
											{
												var newLiveBalance = live_balance;
											}
											console.log("LiveBalance=>",newLiveBalance);
											console.log("newb=>",newb);
											if(parseFloat(newLiveBalance) >= parseFloat(newb))
											{
												var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
												var type='Other Exchange';
												var cur_type='FSC';
												var value = "('" + checkAddressToken['0']['userid'] + "','" + checkAddressToken['0']['currency'] + "','" + newBalance + "','" + insertStatus + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
												await insert_db("trade_receive", condition, value);
											}
											else
											{
											   console.log("System Error");
											}
										}
									}
								}
							} catch (e) {
								//console.error(e);
							} finally {
								//console.log('We do cleanup here');
							}
                        }
                    }
                  }
		     	}
            }
         }
		await update_db("latestblock_fsc", 'id=1', 'blockNumber=' + i);
    }
	setTimeout(function(){
		eth_blocks();
	}, 20*1000);
}
app.listen(8574);
