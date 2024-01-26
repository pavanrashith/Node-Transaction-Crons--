var express = require('express');
var app = express();
var Web3 = require('web3');
var request = require('request');
var InputDataDecoder = require('ethereum-input-data-decoder');
var tokensbep   = require('./tokensbep20');  // +++++ //
var tokens = require('./tokensbep20');
var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.defibit.io'));

var mysql = require('mysql');
/* var con = mysql.createConnection({
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
            if (err) console.log("getBlockNumber err=>",err);
            resolve(BlockNumber);
        });
    });
};

async function getBlock(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getBlock(i, async function(err, getBlockDetails) {
            if (err){ 
				console.log("getBlock err=>",err);
				resolve('');
			}else{
				//console.log('getBlockDetails=>',getBlockDetails);
				resolve(getBlockDetails);
			}
        });
    });
};

async function getTransactionReceipt(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getTransaction(i, async function(err, TransactionReceipt) {
            if (err){console.log("getTransactionReceipt=>");
			resolve('');
			}
			else{
            resolve(TransactionReceipt);
			}
        });
    });
};

async function getTransactionReceiptall(i) {
    return new Promise(async function(resolve, reject) {
        web3.eth.getTransactionReceipt(i, async function(err, TransactionReceipt) {
            if (err) console.log("getTransactionReceiptall=>",err);
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
    var toconfirm = latestBlock - 30;
    await update_db("trade_receive", 'status=0 AND block IS NOT NULL AND cur_type="BNB"', 'confirmation=' + latestBlock + "-block");
    var checkTrx = await select_db("trade_receive", "*", "block <= '" + toconfirm + "' AND status=0 AND block IS NOT NULL AND cur_type='BNB'", '');
    if (checkTrx.length > 0) {
        checkTrx.forEach(async function(row) {
            var txnid = row.txid;
            var transactionReceiptDetails = await getTransactionReceiptall(txnid);
            if (transactionReceiptDetails != null) {
                if (transactionReceiptDetails.status) {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="BNB"', 'status=1');
                } else {
                    await update_db("trade_receive", 'txid="' + txnid + '" AND cur_type="BNB"', 'status=2');
                }
            }
        });
    }
}

eth_blocks();
async function eth_blocks() {
    var data = "*";
    var table = "latestblock_bnb";
    var condition = "";
    var otherStatement = "";
    var newBlockNumber = await getBlockNumber();
	console.log(newBlockNumber);
    var StoredBlock = await select_db(table, data, condition, otherStatement);
    var StartingBlock = parseInt(StoredBlock[0].blockNumber) + 1;
	 console.log("BNB StartingBlock=>", StartingBlock);
     for (var i = StartingBlock; i <= newBlockNumber; i++) {
        console.log("Block=>", i);
        checkStatusByConfirmBlock(i);
        var BlockDetails = await getBlock(i);
		if(BlockDetails != undefined && BlockDetails != null )
		{
			var FetchedTransactions = BlockDetails.transactions;
			var arrayLength = FetchedTransactions.length;
			//console.log(arrayLength);
			if (arrayLength > 0)
				{
				for (var j = 0; j < arrayLength; j++) {
					//console.log(FetchedTransactions[j]);
					var trx = await getTransactionReceipt(FetchedTransactions[j]);
					if(trx!=null && trx!='')
					{
					//console.log("trx=>",trx.hash);
					var toaddress = trx.to;
					//console.log("toaddress=>",toaddress);
					var checkTrx = await select_db("trade_receive", "*", "txid='" + trx.hash + "' AND block IS NOT NULL", '');
					if (checkTrx.length==0){
						//console.log('trx.input=>',trx.input);
						if (trx.input == "0x") {
							var checkAddress = await select_db("address", "*", "address='" + toaddress + "' AND currency='112'", '');
							//console.log("bnb checkAddress.length=>",checkAddress.length);
							if (checkAddress.length > 0) {
								console.log("Binance");
								var newBalance = parseFloat(trx.value / Math.pow(10, 18)).toFixed(8);
								var checkCurrency = await select_db("currency", "*", "id='" + 112 + "' AND status='1'", '');
								//console.log("crnickName==>",checkCurrency);
								var insertStatus=0;
								var crnickName=checkCurrency['0']['nickname'];
								
								if(newBalance<checkCurrency['0']['minimum_deposit'])
								{
									var insertStatus=2;
								}
								var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
								var type='Other Exchange';
								var cur_type='BNB';
								var value = "('" + checkAddress['0']['userid'] + "','" + checkAddress['0']['currency'] + "','" + newBalance + "','" + insertStatus + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
								await insert_db("trade_receive", condition, value);
							}
						} else {
							var checkAddress = await select_db("currency", "*", "contract_address='" + toaddress + "' AND status='1' and currency_type='bep20' AND deposit_status='1'", '');
							var checkAddress1 = await select_db("multiblockchain_currency", "*", "contract_address='" + toaddress + "' and currency_type='bep20'", '');
							console.log("bep20 checkAddress.length=>",checkAddress.length);
							if (checkAddress.length > 0 || checkAddress1.length > 0)
							{
								
								var contC = "ContractABI";
								if(checkAddress1.length >0)
								{
									var cur1 = await select_db("currency", "*", "id='" + checkAddress1['0']['currency'] + "'", '');
									console.log("currency=>",cur1['0']['nickname'].toLowerCase());
									var newAbi =  contC+ "" + cur1['0']['nickname'].toLowerCase();
									var currencyID=checkAddress1['0']['currency'];
									var minimum_deposit = checkAddress1['0']['minimum_deposit'];
									var multiBlockchain=1;
									var mc_type='bep20';
									var crnickName=cur1['0']['nickname'];
								}
								else
								{
									console.log("currency0=>",checkAddress['0']['nickname'].toLowerCase());
									var newAbi =  contC+ "" + checkAddress['0']['nickname'].toLowerCase();
									var currencyID=checkAddress['0']['id'];
									var minimum_deposit = checkAddress['0']['minimum_deposit'];
									var multiBlockchain=0;
									var mc_type='';
									var crnickName=checkAddress['0']['nickname'];
								}
								var ContractABI = tokens[newAbi];
								console.log("ContractABI=>",newAbi);
								var decoder = new InputDataDecoder(ContractABI);
								var result = decoder.decodeData(trx.input);
								console.log('result=>', result);
								if (result.inputs[0]) {
									if (result.method == "transfer") {
										var address = '0x' + result.inputs[0];
										var value = result.inputs[1].toString();
										console.log('value'+value);
										var checkAddressToken = await select_db("address", "*", "address='" + address + "' AND currency='" + currencyID + "'", '');
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
											var not_move = await select_db("trade_receive", "IFNULL(SUM(amount),0) as Total", "userid='" + checkAddressToken['0']['userid'] + "' AND txid IS NOT NULL AND moved_status='0' AND currency='" + currencyID + "'", '');
											var old = parseFloat(not_move['0']['Total']).toFixed(8);
											var newb = parseFloat(old+newBalance).toFixed(8);
											var live_balance = await balance(ContractABI, toaddress, address);
											
											if (token_de != 0) 
											{
												var newLiveBalance = parseFloat(live_balance / Math.pow(10, token_de)).toFixed(8);
												console.log('newLiveBalance'+newLiveBalance);
											} 
											else 
											{
												var newLiveBalance = live_balance;
											}
											var insertStatus=0;
											if(newBalance<minimum_deposit)
											{
												var insertStatus=2;
											}
											console.log("newBalance=>",newBalance); //var mc_type='bep20';
											if(parseFloat(newLiveBalance) >= parseFloat(newb))
											{
												var condition = 'userid,currency,amount,status,txid,block,type,cur_type,multiblockchain,mc_type';
												var type='Other Exchange';
												var cur_type='BNB';
												var value = "('" + checkAddressToken['0']['userid'] + "','" + checkAddressToken['0']['currency'] + "','" + newBalance + "','" + insertStatus + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "','" + multiBlockchain + "','" + mc_type + "')";
												await insert_db("trade_receive", condition, value);
											}
											else
											{
											   console.log("System Error");
											}
										}
									}
								}
							}
						}
					  }
					}
				}
			}
			await update_db("latestblock_bnb", 'id=1', 'blockNumber=' + i);
		 }
    }
	setTimeout(function(){
		eth_blocks();
	}, 1000); //20*1000
}
setTimeout(function(){
    process.exit();
}, 7198*1000);
//eth_blocks_singleBlock(13548466)
eth_blocks_singleBlock(49851630)
async function eth_blocks_singleBlock(StartingBlock) {
		var i =StartingBlock;
        console.log("Block=>", i);
        checkStatusByConfirmBlock(i);
        var BlockDetails = await getBlock(i);
		//console.log('BlockDetails.length=>', BlockDetails);
		if(BlockDetails != undefined && BlockDetails != null )
		{
			var FetchedTransactions = BlockDetails.transactions;
			var arrayLength = FetchedTransactions.length;
			//console.log(arrayLength);
			if (arrayLength > 0)
				{
				for (var j = 0; j < arrayLength; j++) {
					//console.log(FetchedTransactions[j]);
					var trx = await getTransactionReceipt(FetchedTransactions[j]);
					//console.log("trx=>",trx);
					if(trx!=null)
					{
						
					
					var toaddress = trx.to;
					//var checkTrx = await select_db("trade_receive", "*", "txid='" + trx.hash + "' AND block IS NOT NULL", '');
					//console.log(BlockDetails);
					  
					//if (checkTrx.length==0){
						//console.log('trx.input=>',trx.input);
						if (trx.input == "0x") {
							var checkAddress = await select_db("address", "*", "address='" + toaddress + "' AND currency='112'", '');
							//console.log("bnb checkAddress.length=>",checkAddress.length);
							if (checkAddress.length > 0) {
								console.log("Binance");
								var newBalance = parseFloat(trx.value / Math.pow(10, 18)).toFixed(8);
								var checkCurrency = await select_db("currency", "*", "id='" + 112 + "' AND status='1'", '');
								var insertStatus=0;
								var crnickName=checkCurrency['0']['nickname'];
								if(newBalance<checkCurrency['0']['minimum_deposit'])
								{
									var insertStatus=2;
								}
								var condition = 'userid,currency,amount,status,txid,block,type,cur_type';
								var type='Other Exchange';
								var cur_type='BNB';
								var value = "('" + checkAddress['0']['userid'] + "','" + checkAddress['0']['currency'] + "','" + newBalance + "','" + insertStatus + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "')";
								await insert_db("trade_receive", condition, value);
							}
						} else {
							var checkAddress = await select_db("currency", "*", "contract_address='" + toaddress + "' AND status='1' AND deposit_status='1'", '');
							var checkAddress1 = await select_db("multiblockchain_currency", "*", "contract_address='" + toaddress + "' and currency_type='bep20'", '');
							//	console.log("bep20 checkAddress.length=>",checkAddress.length);
							if (checkAddress.length > 0 || checkAddress1.length >0) 
							{
								var contC = "ContractABI";
								if(checkAddress1.length >0)
								{
									var cur1 = await select_db("currency", "*", "id='" + checkAddress1['0']['currency'] + "'", '');
									console.log("currency=>",cur1['0']['nickname'].toLowerCase());
									var newAbi =  contC+ "" + cur1['0']['nickname'].toLowerCase();
									var currencyID=checkAddress1['0']['currency'];
									var multiBlockchain=1;
									var minimum_deposit = checkAddress1['0']['minimum_deposit'];
									var crnickName=cur1['0']['nickname'];
									var mc_type='bep20';
								}
								else
								{
									console.log("currency=>",checkAddress['0']['nickname'].toLowerCase());
									var newAbi =  contC+ "" + checkAddress['0']['nickname'].toLowerCase();
									var currencyID=checkAddress['0']['id'];
									var minimum_deposit = checkAddress['0']['minimum_deposit'];
									var multiBlockchain=0;
									var crnickName=checkAddress['0']['nickname'];
									var mc_type='';
								}
								//var newAbi =  contC+ "" + checkAddress['0']['nickname'].toLowerCase();
								var ContractABI = tokens[newAbi];
								var decoder = new InputDataDecoder(ContractABI);
								var result = decoder.decodeData(trx.input);
								if(trx.hash=="0x24236bba5c24a70ec32fe6363892d3bc8d32f06f0ed0807866a5f496faa32466"){
											console.log("checkTrx=>",result);
										}
								if (result.inputs[0]) {
									
									if (result.method == "transfer") {
										var address = '0x' + result.inputs[0];
										var value = result.inputs[1].toString();
										var checkAddressToken = await select_db("address", "*", "address='" + address + "' AND currency='" + currencyID + "'", '');
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
											if(newBalance<minimum_deposit)
											{
												var insertStatus=2;
											}
											
											var not_move = await select_db("trade_receive", "IFNULL(SUM(amount),0) as Total", "userid='" + checkAddressToken['0']['userid'] + "' AND txid IS NOT NULL AND moved_status='0' AND currency='" + currencyID + "'", '');
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
												var condition = 'userid,currency,amount,status,txid,block,type,cur_type,multiblockchain,mc_type';
												var type='Other Exchange';
												var cur_type='BNB';
												
												var value = "('" + checkAddressToken['0']['userid'] + "','" + checkAddressToken['0']['currency'] + "','" + newBalance + "','" + insertStatus + "','" + trx.hash + "','" + trx.blockNumber + "','" + type + "','" + cur_type + "','" + multiBlockchain + "','" + mc_type + "')";
												await insert_db("trade_receive", condition, value);
											}
											else
											{
											   console.log("System Error");
											}
										}
									}
								}
							}
						}
					  //}
					}
				}
			}
			
		 }
    
	
}
app.listen(8979);
