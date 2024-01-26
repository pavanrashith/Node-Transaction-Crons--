const TronWeb = require('tronweb') // install tronweb
const HttpProvider = TronWeb.providers.HttpProvider;
var express = require('express');
var app = express();
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "3481E79956D4BD95F358AC96D151C976392FC4E3FC132F78A847906DE588C145";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
const ethers = require('ethers') // install ethers
const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;
const ADDRESS_PREFIX = "41";
 //https://api.shasta.trongrid.io/wallet/gettransactionlistfrompending
// get transaction from above api and push in array/localStorage/list/database
//then check the transaction status
//then receive address is from our exchange  if yes 
//then insert to receive transaction table 

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
            if (err) trx_blocks();
            resolve(result);
        });
    });
};

async function insert_db(table, conditionfields, conditionValues) {
    return new Promise(async function(resolve, reject) {
        var sql = 'INSERT INTO ' + table + ' (' + conditionfields + ') VALUES ' + conditionValues;
        con.query(sql, function(err, result) {
            if (err) trx_blocks();
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
 */
 
const pool = mysql.createPool({
    connectionLimit : 500, //important
    host: "localhost",
    user: "root",
    password: "",
    database: 'test',
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

async function getTransactionReceiptall(i) {
    return new Promise(async function(resolve, reject) {
        tronWeb.trx.getTransaction(i, async function(err, TransactionReceipt) {
            if (err) trx_blocks();
            resolve(TransactionReceipt);
        });
    });
};
async function checkStatusByConfirmBlock(latestBlock) {
    var toconfirm = latestBlock - 30;
    //await update_db("transaction_history", 'status=0 AND block IS NOT NULL AND cur_type="TRX"', 'confirmation=' + latestBlock + "-block");
    var checkTrx = await select_db("transaction_history", "*", "block <= '" + toconfirm + "' AND status=0 AND block IS NOT NULL AND cur_type='TRX'", '');
    if (checkTrx.length > 0) {
        checkTrx.forEach(async function(row) {
            var txnid = row.txid;
            var transactionReceiptDetails = await getTransactionReceiptall(txnid);
            if (transactionReceiptDetails != null) {
                if(transactionReceiptDetails.ret[0].contractRet=="SUCCESS")
			    {
     //              await update_db("transaction_history", 'txhash="' + txnid + '" AND cur_type="TRX"', 'status=1');
                } 
				else 
				{
       //             await update_db("transaction_history", 'txhash="' + txnid + '" AND cur_type="TRX"', 'status=2');
                }
            }
        });
    }
}

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
    var data = "*";
    var table = "latestblock_trx"; //rename latestblock_tron
    var condition = "";
    var otherStatement = "";
    var newBlockNumber = await getBlockNumber();
    var StoredBlock = await select_db(table, data, condition, otherStatement);
    var StartingBlock = parseInt(StoredBlock[0].blockNumber) + 1;
	 console.log("Tron StartingBlock=>", StartingBlock);
     for(var i = StartingBlock; i <= newBlockNumber; i++) {
		// checkStatusByConfirmBlock(i); 
		console.log("block=>",i);
        var BlockHash = await getBlockHash(i);
		var BlockDetails = await getBlock(BlockHash);
        var FetchedTransactions = BlockDetails.transactions;
        var arrayLength = FetchedTransactions != undefined ? FetchedTransactions.length : 0;
        if(arrayLength > 0)
		{
			for(var j = 0; j < arrayLength; j++) 
			{
			   var trx = FetchedTransactions[j];
			//    console.log(trx)
			   var contC = "ContractABI";
			   if(trx.ret[0].contractRet=="SUCCESS")
			   {
				   if(!trx.raw_data.contract[0].parameter.value.contract_address && !trx.raw_data.contract[0].parameter.value.asset_name && trx.raw_data.contract[0].parameter.value.amount)
				   {
						var toaddress = await tronWeb.address.fromHex(trx.raw_data.contract[0].parameter.value.to_address);
						var checkAddress = await select_db("dbt_address", "*", "address='" + toaddress + "' AND coin_id='TRX'", ''); //currency id of tron
						if (checkAddress.length > 0) {
							console.log("Tron");
							 var checkCurrency = await select_db("dbt_cryptocoin", "*", "symbol='TRX' AND status='1'", '');
                            var crnickName=checkCurrency['0']['symbol'];
							var amount = trx.raw_data.contract[0].parameter.value.amount;
							var newBalance = parseFloat(tronWeb.fromSun(amount)).toFixed(8);
							var condition = 'userid,currency_symbol,amount,status,txhash,block,type,cur_type';
							var type='Other Exchange';
							var cur_type='TRX';
							var insertStatus=0;
							if(newBalance<checkCurrency['0']['minimum_deposit'])
							{   
								var insertStatus=2;
							}
							var value = "('" + checkAddress['0']['user_id'] + "','" + checkAddress['0']['coin_id'] + "','" + newBalance + "','" + insertStatus + "','" + trx.txID + "','" + i + "','" + type + "','" + cur_type + "')";
							await insert_db("transaction_history", condition, value);
							
							var trxbalance = await select_db("dbt_balance", "*", "currency_symbol='TRX' AND user_id='"+checkAddress['0']['user_id']+"'", '');
							if(trxbalance.length>0)
							{
							var trx_balance=trxbalance['0']['balance'];
							console.log('trxbalance=>'+typeof(trx_balance))
							var updated_balance=((trx_balance))+parseFloat((newBalance));
							console.log(updated_balance)
							await update_db("dbt_balance", 'currency_symbol="TRX" AND user_id="'+checkAddress['0']['user_id']+'"', 'balance="' + updated_balance +'"');
							}
							else
							{
								var balancecondition = 'user_id,currency_symbol,balance';
							var balancevalue = "('" + checkAddress['0']['user_id'] + "','" + checkAddress['0']['coin_id'] + "','" + newBalance + "')";
							await insert_db("dbt_balance", balancecondition, balancevalue);
	
							}
							
							var condition1 = 'user_id,currency_symbol,transaction_type,transaction_amount';
							var value1 = "('" + checkAddress['0']['user_id'] + "','" + checkAddress['0']['coin_id'] + "','TRX_DEPOSIT','" + newBalance + "')";
							await insert_db("dbt_balance_log", condition1, value1);
	
						}
				   }
				   else if(trx.raw_data.contract[0].parameter.value.contract_address)
				   {
					   var toaddress = await tronWeb.address.fromHex(trx.raw_data.contract[0].parameter.value.contract_address);
					//    console.log('toaddress=>',toaddress);
					//    console.log()
					   var checkAddress = await select_db("dbt_cryptocoin", "*", "contract_address='" + toaddress + "' AND status='1' AND deposit_status='1'", '');
					    //    var checkAddress1 = await select_db("multiblockchain_currency", "*", "contract_address='" + toaddress + "' and currency_type='trc20'", '');
					    //
					    // console.log('checkAddress1=>',checkAddress1);
					  var checkAddress1=checkAddress;
					   if (checkAddress.length > 0 || checkAddress1.length >0) 
					   {
						    if(checkAddress1.length >0)
							{
								//console.log("coin_id=>",checkAddress1['0']['nickname'].toLowerCase());
								//var newAbi =  contC+ "" + checkAddress1['0']['nickname'].toLowerCase();
								var currencyID=checkAddress1['0']['symbol'];
								var currencyDecimal=checkAddress1['0']['decimal'];
								var minimum_deposit = checkAddress1['0']['minimum_deposit'];
								var multiBlockchain=1;
								var mc_type='trc20';
							}
							else
							{
								//console.log("coin_id=>",checkAddress['0']['nickname'].toLowerCase());
								//var newAbi =  contC+ "" + checkAddress['0']['nickname'].toLowerCase();
								var currencyID=checkAddress['0']['symbol'];
								var currencyDecimal=checkAddress['0']['decimal'];
								var minimum_deposit = checkAddress['0']['minimum_deposit'];
								var multiBlockchain=0;
								var mc_type='';
							}
							//console.log('value 1=>',trx.raw_data.contract[0].parameter.value);
						    var value = trx.raw_data.contract[0].parameter.value.data;
							//console.log('value=>',value);
							var value = '0x'+value;
							try {
								var result = await decodeParams(['address','uint256'],value, true);
								var address = await tronWeb.address.fromHex(result[0]);
								var checkAddressToken = await select_db("dbt_address", "*", "address='" + address + "' AND coin_id='" + currencyID + "'", '');
								if(checkAddressToken.length > 0) 
								{
									console.log("Token");
									if(currencyDecimal==0)
									{
										var newBalance = parseFloat(tronWeb.toDecimal(result[1]._hex)).toFixed(8);
									}
									else
									{
										var token_de = currencyDecimal 
										var newBalance = parseFloat(tronWeb.toDecimal(result[1]._hex) / Math.pow(10, token_de)).toFixed(8);
									}
									console.log(newBalance);
									
									if(newBalance<minimum_deposit)
									{
										var insertStatus=2;
									}
														
									
									var condition = 'userid,currency_symbol,amount,status,txhash,block,type,cur_type,multiblockchain,mc_type';
									var type='Other Exchange';
									var cur_type='TRX';
									var value = "('" + checkAddressToken['0']['user_id'] + "','" + checkAddressToken['0']['coin_id'] + "','" + newBalance + "','" + insertStatus + "','" + trx.txID + "','" + i + "','" + type + "','" + cur_type + "','" + multiBlockchain + "','" + mc_type + "')";
									await insert_db("transaction_history", condition, value);


							var trxbalance = await select_db("dbt_balance", "*", "currency_symbol='"+checkAddressToken['0']['coin_id']+"' AND user_id='"+checkAddressToken['0']['user_id']+"'", '');
							if(trxbalance.length>0)
							{
							var trx_balance=trxbalance['0']['balance'];
							console.log('trxbalance=>'+typeof(trx_balance))
							var updated_balance=((trx_balance))+parseFloat((newBalance));
							console.log(updated_balance)
							await update_db("dbt_balance", 'currency_symbol="'+checkAddressToken['0']['coin_id']+'" AND user_id="'+checkAddressToken['0']['user_id']+'"', 'balance="' + updated_balance +'"');
							}
							else
							{
								var balancecondition = 'user_id,currency_symbol,balance';
							var balancevalue = "('" + checkAddress['0']['user_id'] + "','" + checkAddress['0']['coin_id'] + "','" + newBalance + "')";
							await insert_db("dbt_balance", balancecondition, balancevalue);
	
							}
							
							var condition1 = 'user_id,currency_symbol,transaction_type,transaction_amount';
							var value1 = "('" + checkAddressToken['0']['user_id'] + "','" + checkAddressToken['0']['coin_id'] + "','"+checkAddressToken['0']['coin_id']+"_DEPOSIT','" + newBalance + "')";
							await insert_db("dbt_balance_log", condition1, value1);
	
								}
							} catch (e) {
								//console.error(e);
							} finally {
								//console.log('We do cleanup here');
							}
							
							
						}
					}
					else if(trx.raw_data.contract[0].parameter.value.asset_name)
					{
					  
					   var toaddress = await tronWeb.toAscii(trx.raw_data.contract[0].parameter.value.asset_name);
					   var checkAddress = await select_db("dbt_cryptocoin", "*", "contract_address='" + toaddress + "' AND status='1'", '');
					//    var checkAddress1 = await select_db("multiblockchain_currency", "*", "contract_address='" + toaddress + "' and currency_type='trc20'", '');
					var checkAddress1=checkAddress;   
					if (checkAddress.length > 0 || checkAddress1.length >0)  
					   {
						    if(checkAddress1.length >0)
							{
								//console.log("coin_id=>",checkAddress1['0']['nickname'].toLowerCase());
								var newAbi =  contC+ "" + checkAddress1['0']['symbol'].toLowerCase();
								var currencyID=checkAddress1['0']['symbol'];
								var currencyDecimal=checkAddress1['0']['decimal'];
								var minimum_deposit = checkAddress1['0']['minimum_deposit'];
								var multiBlockchain=1;
								var mc_type='trc20';
							}
							else
							{
								//console.log("coin_id=>",checkAddress['0']['nickname'].toLowerCase());
								var newAbi =  contC+ "" + checkAddress['0']['symbol'].toLowerCase();
								var currencyID=checkAddress['0']['symbol'];
								var currencyDecimal=checkAddress['0']['decimal'];
								var multiBlockchain=0;
								var minimum_deposit = checkAddress['0']['minimum_deposit'];
								var mc_type='';
							}
							var address = await tronWeb.address.fromHex(trx.raw_data.contract[0].parameter.value.to_address);
							var amount  = trx.raw_data.contract[0].parameter.value.amount;
							var checkAddressToken = await select_db("dbt_address", "*", "address='" + address + "' AND coin_id='" + currencyID + "'", '');
							if(checkAddressToken.length > 0) 
							{
								console.log("Token");
								if(currencyDecimal==0)
								{
									var newBalance = parseFloat(tronWeb.toDecimal(amount)).toFixed(8);
								}
								else
								{
									var token_de = currencyDecimal 
									var newBalance = parseFloat(tronWeb.toDecimal(amount) / Math.pow(10, token_de)).toFixed(8);
								}
								var insertStatus=0;
								 if(newBalance<checkAddress['0']['minimum_deposit'])
								{
									var insertStatus=2;
								} 
								console.log(newBalance);
								var condition = 'userid,currency_symbol,amount,status,txhash,block,type,cur_type,multiblockchain,mc_type';
								var type='Other Exchange';
								var cur_type='TRX';
								var value = "('" + checkAddressToken['0']['user_id'] + "','" + checkAddressToken['0']['coin_id'] + "','" + newBalance + "','" + insertStatus + "','" + trx.txID + "','" + i + "','" + type + "','" + cur_type + "','" + multiBlockchain + "','" + mc_type + "')";
								await insert_db("transaction_history", condition, value);
							}
						}
					}
			   }
			}
         }
         await update_db("latestblock_trx", 'id=1', 'blockNumber=' + i);
    }
	setTimeout(function(){
		trx_blocks();
	}, 10*1000);
}
/*
setTimeout(function(){
    process.exit();
}, 7198*1000);
*/
//36349073
//trx_blocks_singleBlock(38807843);
//trx_blocks_singleBlock(48042783);
//trx_blocks_singleBlock(47989686); 
//trx_blocks_singleBlock(48215113);
trx_blocks_singleBlock(48851900);
//47163498

async function trx_blocks_singleBlock(StartingBlock){
    
	 console.log("StartingBlock=>", StartingBlock);
		var i =StartingBlock;
	
		var contC = "ContractABI";
		// checkStatusByConfirmBlock(i); 
		console.log("block=>",i);
        var BlockHash = await getBlockHash(i);
		var BlockDetails = await getBlock(BlockHash);
        var FetchedTransactions = BlockDetails.transactions;
        var arrayLength = FetchedTransactions != undefined ? FetchedTransactions.length : 0;
        if(arrayLength > 0)
		{
			for(var j = 0; j < arrayLength; j++) 
			{
			   var trx = FetchedTransactions[j];
			   if(trx.ret[0].contractRet=="SUCCESS")
			   {
				   if(!trx.raw_data.contract[0].parameter.value.contract_address && !trx.raw_data.contract[0].parameter.value.asset_name && trx.raw_data.contract[0].parameter.value.amount)
				   {
						var toaddress = await tronWeb.address.fromHex(trx.raw_data.contract[0].parameter.value.to_address);
						var checkAddress = await select_db("dbt_address", "*", "address='" + toaddress + "' AND coin_id='TRX'", ''); //currency id of tron
						if (checkAddress.length > 0) {
							console.log("Tron");
							 var checkCurrency = await select_db("dbt_cryptocoin", "*", "symbol='TRX' AND status='1'", '');
                            var crnickName=checkCurrency['0']['nickname'];
							var amount = trx.raw_data.contract[0].parameter.value.amount;
							var newBalance = parseFloat(tronWeb.fromSun(amount)).toFixed(8);
							var condition = 'userid,currency_symbol,amount,status,txhash,block,type,cur_type';
							var type='Other Exchange';
							var insertStatus=0;
							/* if(newBalance<minimum_deposit)
							{
								var insertStatus=2;
							} */
							if(newBalance<checkCurrency['0']['minimum_deposit'])
							{
								var insertStatus=2;
							}
							var cur_type='TRX';
							var value = "('" + checkAddress['0']['user_id'] + "','" + checkAddressToken['0']['coin_id'] + "','" + newBalance + "','" + insertStatus + "','" + trx.txID + "','" + i + "','" + type + "','" + cur_type + "')";
							await insert_db("transaction_history", condition, value);
						}
				   }
				   else if(trx.raw_data.contract[0].parameter.value.contract_address)
				   {
					   
					   var toaddress = await tronWeb.address.fromHex(trx.raw_data.contract[0].parameter.value.contract_address);

					   var checkAddress = await select_db("dbt_cryptocoin", "*", "contract_address='" + toaddress + "' AND status='1' AND deposit_status='1'", '');
					//    var checkAddress1 = await select_db("multiblockchain_currency", "*", "contract_address='" + toaddress + "' and currency_type='trc20'", '');
					var checkAddress1=checkAddress;   
					if (checkAddress.length > 0 || checkAddress1.length >0)  
					   {
						    if(checkAddress1.length >0)
							{
								//console.log("coin_id=>",checkAddress1['0']['nickname'].toLowerCase());
								var newAbi =  contC+ "" + checkAddress1['0']['symbol'].toLowerCase();
								var currencyID=checkAddress1['0']['symbol'];
								var currencyDecimal=checkAddress1['0']['decimal'];
								var multiBlockchain=1;
								var minimum_deposit = checkAddress1['0']['minimum_deposit'];
								var mc_type='trc20';
							}
							else
							{
								//console.log("coin_id=>",checkAddress['0']['nickname'].toLowerCase());
								var newAbi =  contC+ "" + checkAddress['0']['symbol'].toLowerCase();
								var currencyID=checkAddress['0']['symbol'];
								var currencyDecimal=checkAddress['0']['decimal'];
								var multiBlockchain=0;
								var minimum_deposit = checkAddress['0']['minimum_deposit'];
								var mc_type='';
							}
						    var value = trx.raw_data.contract[0].parameter.value.data;
							var value = '0x'+value;
							try {
								var result = await decodeParams(['address','uint256'],value, true);
								var address = await tronWeb.address.fromHex(result[0]);
								var checkAddressToken = await select_db("dbt_address", "*", "address='" + address + "' AND coin_id='" + currencyID + "'", '');
								if(checkAddressToken.length > 0) 
								{
									console.log("Token");
									if(currencyDecimal==0)
									{
										var newBalance = parseFloat(tronWeb.toDecimal(result[1]._hex)).toFixed(8);
									}
									else
									{
										var token_de = currencyDecimal 
										var newBalance = parseFloat(tronWeb.toDecimal(result[1]._hex) / Math.pow(10, token_de)).toFixed(8);
									}
									console.log(newBalance);
									var insertStatus=0;
									if(newBalance<minimum_deposit)
									{
										var insertStatus=2;
									}
									var condition = 'userid,currency_symbol,amount,status,txhash,block,type,cur_type,multiblockchain,mc_type';
									var type='Other Exchange';
									var cur_type='TRX';
									var value = "('" + checkAddressToken['0']['user_id'] + "','" + checkAddressToken['0']['coin_id'] + "','" + newBalance + "','" + insertStatus + "','" + trx.txID + "','" + i + "','" + type + "','" + cur_type + "','" + multiBlockchain + "','" + mc_type + "')";
									await insert_db("transaction_history", condition, value);
								}
							} catch (e) {
								//console.error(e);
							} finally {
								//console.log('We do cleanup here');
							}
						}
					}
					else if(trx.raw_data.contract[0].parameter.value.asset_name)
					{
					  
					   var toaddress = await tronWeb.toAscii(trx.raw_data.contract[0].parameter.value.asset_name);
					   var checkAddress = await select_db("dbt_cryptocoin", "*", "contract_address='" + toaddress + "' AND status='1'", '');
					//    var checkAddress1 = await select_db("multiblockchain_currency", "*", "contract_address='" + toaddress + "' and currency_type='trc20'", '');
					var checkAddress1=checkAddress;  
					if (checkAddress.length > 0 || checkAddress1.length >0)  
					   {
						    if(checkAddress1.length >0)
							{
								//console.log("coin_id=>",checkAddress1['0']['nickname'].toLowerCase());
								var newAbi =  contC+ "" + checkAddress1['0']['nickname'].toLowerCase();
								var currencyID=checkAddress1['0']['currency'];
								var currencyDecimal=checkAddress1['0']['decimal'];
								var minimum_deposit = checkAddress1['0']['minimum_deposit'];
								var multiBlockchain=1;
								var mc_type='trc20';
							}
							else
							{
								//console.log("coin_id=>",checkAddress['0']['nickname'].toLowerCase());
								var newAbi =  contC+ "" + checkAddress['0']['nickname'].toLowerCase();
								var currencyID=checkAddress['0']['id'];
								var currencyDecimal=checkAddress['0']['decimal'];
								var minimum_deposit = checkAddress['0']['minimum_deposit'];
								var multiBlockchain=0;
								var mc_type='';
							}
							var address = await tronWeb.address.fromHex(trx.raw_data.contract[0].parameter.value.to_address);
							var amount  = trx.raw_data.contract[0].parameter.value.amount;
							var checkAddressToken = await select_db("dbt_address", "*", "address='" + address + "' AND coin_id='" + currencyID + "'", '');
							if(checkAddressToken.length > 0) 
							{
								console.log("Token");
								if(currencyDecimal==0)
								{
									var newBalance = parseFloat(tronWeb.toDecimal(amount)).toFixed(8);
								}
								else
								{
									var token_de = currencyDecimal 
									var newBalance = parseFloat(tronWeb.toDecimal(amount) / Math.pow(10, token_de)).toFixed(8);
								}
								var insertStatus=0;
								if(newBalance<checkAddress['0']['minimum_deposit'])
								{
									var insertStatus=2;
								} 
								console.log(newBalance);
								var condition = 'userid,currency_symbol,amount,status,txhash,block,type,cur_type,multiblockchain,mc_type';
								var type='Other Exchange';
								var cur_type='TRX';
								var value = "('" + checkAddressToken['0']['user_id'] + "','" + checkAddressToken['0']['coin_id'] + "','" + newBalance + "','" + insertStatus + "','" + trx.txID + "','" + i + "','" + type + "','" + cur_type + "','" + multiBlockchain + "','" + mc_type + "' )";
								await insert_db("transaction_history", condition, value);
							}
						}
					}
			   }
			}
         }
         
}

app.listen(8560);
