var express = require('express');
var app = express();
var Web3 = require('web3');
var request = require('request');
var InputDataDecoder = require('ethereum-input-data-decoder');
var tokens = require('./tokenserc20');
//var eth      = new Eth(new Web3.providers.HttpProvider('https://late-flashy-sponge.discover.quiknode.pro/32b94b3ede17ce2abd1a6ae8aecfd84972660c2e/'));
//var accounts = new Accounts(new Web3.providers.HttpProvider('https://late-flashy-sponge.discover.quiknode.pro/32b94b3ede17ce2abd1a6ae8aecfd84972660c2e/'));
var web3     = new Web3(new Web3.providers.HttpProvider('https://withered-sleek-energy.discover.quiknode.pro/60514da3ff39a826fb84dd7e0c67d1e009832b5c/'));
const web3wss = new Web3(new Web3.providers.WebsocketProvider('wss://withered-sleek-energy.discover.quiknode.pro/60514da3ff39a826fb84dd7e0c67d1e009832b5c/'));
//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

//const web3wss = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8546'));

//var web3 = new Web3(new Web3.providers.HttpProvider('https://main-rpc.linkpool.io'));
//const web3wss = new Web3(new Web3.providers.WebsocketProvider('wss://main-rpc.linkpool.io/ws'));
//var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/69304f098eab48f2a50f2ae90213e4d2'));
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
    user: "fiveexchange",
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
    var toconfirm = latestBlock - 100;
    await update_db("trade_receive", 'status=0 AND block IS NOT NULL AND cur_type="ETH"', 'confirmation=' + latestBlock + "-block");
    var checkTrx = await select_db("trade_receive", "*", "block <= '" + toconfirm + "' AND status=0 AND block IS NOT NULL AND cur_type='ETH'", '');
    if (checkTrx.length > 0) {
        checkTrx.forEach(async function(row) {
            var txnid = row.txid;
            var transactionReceiptDetails = await getTransactionReceiptall(txnid);
            if (transactionReceiptDetails != null) {
                if (transactionReceiptDetails.status) {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="ETH"', 'status=1');
                } else {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="ETH"', 'status=2');
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
    eth_blocks(blockHeader.number);
});
*/
const subscription = web3wss.eth.subscribe('pendingTransactions', function(error, result) {
if (error) console.log(error);
});
const watchTransctions=function(){
	subscription.on('data',async (txhash)=>{
		
		
		setTimeout(async () => {
        try {
          const trx = await getTransactionReceipt(txhash);
          if (trx !== null && trx.to !== null) {
			console.log("trx=>",trx);
			 const checkTrx = await select_db("trade_receive", "*", "txid='" + trx.hash + "' AND block IS NOT NULL", '');
             if (checkTrx.length==0){
				const toaddress = trx.to;
				if (trx.input == "0x") {
					const checkAddress = await select_db("address", "*", "address='" + toaddress + "' AND currency='2'", '');
					if (checkAddress.length > 0) {
						//if (this.accounts === trx.from.toLowerCase()) {
						  // dumps the data onto the CLI
						  // console.log({
							// address: txn.from,
							// value: ethers.utils.formatEther(txn.value),
							// timestamp: new Date(),
							// txnHash: txn.hash,
						  // });
							var newBalance = parseFloat(trx.value / Math.pow(10, 18)).toFixed(8);
							var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
							var type='Other Exchange';
							var cur_type='ETH';
							var value = "('" + checkAddress['0']['userid'] + "','" + checkAddress['0']['currency'] + "','" + newBalance + "','" + 0 + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
							await insert_db("trade_receive", condition, value);
						//}
					}
				}
				else
				{
					var checkAddress = await select_db("currency", "*", "contract_address='" + toaddress + "' AND status='1' AND deposit_status='1'", '');
					if (checkAddress.length > 0) {
						try 
						{
							var contC = "ContractABI";
							var newAbi = checkAddress['0']['nickname'].toLowerCase() + "" + contC;
							var ContractABI = tokens[newAbi];
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
										if(parseFloat(newLiveBalance) >= parseFloat(newb))
										{
											var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
											var type='Other Exchange';
											var cur_type='ETH';
											var value = "('" + checkAddressToken['0']['userid'] + "','" + checkAddressToken['0']['currency'] + "','" + newBalance + "','" + 0 + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
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
        } catch (err) {
          console.error(err);
        }
      }, 10000);
	})
}
watchTransctions();
/*eth_blocks();
 async function eth_blocks() {
    var data = "*";
    var table = "latestBlock";
    var condition = "";
    var otherStatement = "";
    var newBlockNumber = await getBlockNumber();
	console.log(newBlockNumber);
    var StoredBlock = await select_db(table, data, condition, otherStatement);
	
    var StartingBlock = parseInt(StoredBlock[0].blockNumber) + 1;
	 console.log("StartingBlock=>", StartingBlock);
     for (var i = StartingBlock; i <= newBlockNumber; i++) {
        console.log("Block=>", i);
        checkStatusByConfirmBlock(i);
        var BlockDetails = await getBlock(i);
        var FetchedTransactions = BlockDetails.transactions;
        var arrayLength = FetchedTransactions.length;
		//console.log(arrayLength);
        if (arrayLength > 0)
		    {
            for (var j = 0; j < arrayLength; j++) {
				console.log(FetchedTransactions[j]);
                var trx = await getTransactionReceipt(FetchedTransactions[j]);
				if(trx!=null)
				{
                var toaddress = trx.to;
                var checkTrx = await select_db("trade_receive", "*", "txid='" + trx.hash + "' AND block IS NOT NULL", '');
                if (checkTrx.length==0){
                    if (trx.input == "0x") {
                        var checkAddress = await select_db("address", "*", "address='" + toaddress + "' AND currency='2'", '');
                        if (checkAddress.length > 0) {
                            console.log("Ether");
                            var newBalance = parseFloat(trx.value / Math.pow(10, 18)).toFixed(8);
                            var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
                            var type='Other Exchange';
                            var cur_type='ETH';
                            var value = "('" + checkAddress['0']['userid'] + "','" + checkAddress['0']['currency'] + "','" + newBalance + "','" + 0 + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
                            await insert_db("trade_receive", condition, value);
                        }
                    } else {
                        var checkAddress = await select_db("currency", "*", "contract_address='" + toaddress + "' AND status='1' AND deposit_status='1'", '');
                        if (checkAddress.length > 0) {
							try 
							{
								var contC = "ContractABI";
								var newAbi = checkAddress['0']['nickname'].toLowerCase() + "" + contC;
								var ContractABI = tokens[newAbi];
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
											if(parseFloat(newLiveBalance) >= parseFloat(newb))
											{
												var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
												var type='Other Exchange';
												var cur_type='ETH';
												var value = "('" + checkAddressToken['0']['userid'] + "','" + checkAddressToken['0']['currency'] + "','" + newBalance + "','" + 0 + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
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
		await update_db("latestBlock", 'id=1', 'blockNumber=' + i);
    }
	setTimeout(function(){
		eth_blocks();
	}, 20*1000);
} */
app.listen(8570);
