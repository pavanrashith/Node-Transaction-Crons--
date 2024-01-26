(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;

    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();
var express = require('express');
var app = express();
var Web3 = require('web3');
var request = require('request');
var curl = require('curlrequest');
var InputDataDecoder = require('ethereum-input-data-decoder');
var dateTime = require('node-datetime');
var WebSocket = require('ws');

var web3 = new Web3(new Web3.providers.HttpProvider('http://64.227.171.65:3000'));
const web3wss = new Web3(new Web3.providers.WebsocketProvider('http://64.227.171.65:3000'));
 var mysql = require('mysql');

/*  */

/* const pool = mysql.createPool({
    connectionLimit : 300, //important
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
 */
 var con = mysql.createConnection({
    host: "localhost",
    user: "fiveexchange",
    password: "Micro@123#@",
    database: 'fiveexchange',
    port: '3306'
}); 
 async function select_db(table, data = '*', condition = "", stJoin="", otherStatement = "") {
    return new Promise(async function(resolve, reject) {
        var sql = 'SELECT ' + data + ' FROM ' + table;
        if(stJoin!="")
        {
          sql += ' '+stJoin;
        }
        if (condition != "") {
            sql += ' WHERE ' + condition;
        }
        if (otherStatement != "") {
            sql += ' ' + otherStatement;
        }
		//console.log(sql);
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
            if (err) eth_blocks();
            resolve(result);
        });
    });
};

async function update_db(table, condition, updatedata) {
    return new Promise(async function(resolve, reject) {
        var sql = 'UPDATE ' + table + ' SET ' + updatedata + ' WHERE ' + condition;
		//console.log(sql);
          con.query(sql, function(err, result) {
            if (err) eth_blocks();
            resolve(result);
        });  
    });
};

function mytoFixed(num, fixed) {
    if (typeof num != "string") {
        num = num.toString();
    }
    num = (num.indexOf('.') < 0) ? num + '.' + '00000000' : num + '' + '00000000';
    num = num.slice(0, (num.indexOf(".")) + fixed + 1);
    return num;
}
Number.prototype.noExponents = function() {
    var data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];
    var z = '',
        sign = this < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;
    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}
Number.prototype.toFixedSpecial = function(n) {
    var str = this.toFixed(n);
    if (str.indexOf('e+') < 0)
        return str;
    return str.replace('.', '').split('e+').reduce(function(p, b) {
        return p + Array(b - p.length + 2).join(0);
    });
};

function randFun(to, from, type, decimal = '') {
    if (type == 'float') {
        var randNum = ((Math.random() * (from - to)) + to).toFixed(decimal);
    } else {
        var randNum = Math.floor(Math.random() * (from - to)) + to; //rand($to,$from);
    }
    if (randNum == 0) {
        randNum = randFun(to, from);
    }
    return randNum;
}
runbot(count = 0);
async function runbot(count=0)
{
    var selectData        ="next_trade_time as Min_next_trade_time,bidinterval";
    var Condition         = "tradingbot.status=0";
    var otherStatement    = "ORDER BY next_trade_time ASC LIMIT 0,2";
    var checkBotTable     = await select_db("tradingbot",selectData,Condition,'',otherStatement);
	var minTime			= 10*60;
	var maxTime			= 50*60;
    var bidinterval		= randFun(minTime,maxTime,"num",'');
    count++;
    if(checkBotTable.length > 0) 
    {
		console.log(checkBotTable);
        var next_trade_time			= checkBotTable[0]['Min_next_trade_time'];
		console.log("bid Diff=>",((dateTime.create(checkBotTable[1]['Min_next_trade_time']).getTime()-dateTime.create(checkBotTable[0]['Min_next_trade_time']).getTime())/1000)*1000);
        var delay_bidinterval		= checkBotTable.length>1 && checkBotTable[1]['Min_next_trade_time']!=""?(dateTime.create(checkBotTable[1]['Min_next_trade_time']).getTime()-dateTime.create(checkBotTable[0]['Min_next_trade_time']).getTime())/1000:bidinterval;
		var checkSign				= Math.sign(delay_bidinterval);
		console.log( "count "+count+" \n");
		BotTrading(next_trade_time);
		console.log( "Next Time "+delay_bidinterval+" \n");
		setTimeout(function(){ runbot(count); }, 5*60*1000);
    }
    else
    {
        console.log( "count else part  "+count+" \n");
         setTimeout(function(){ runbot(count); }, 1000*60*10);
    }
}
async function  BotTrading(next_trade_time)
{

  //var next_trade_time = dateTime.create(next_trade_time);
  var next_trade_time = dateTime.create(new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Kolkata'})));
	console.log(next_trade_time.format('Y-m-d H:M:S'));
//var next_trade_time=(  new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Kolkata'})));
  console.log("next_trade_time=>",next_trade_time.format('Y-m-d H:M:S'));
  var selectData      ="IFNULL(sum(TS.amount),0) as tradedAmount,TS.id as TradeSellID,"+
                       "IFNULL(tradingbot.amount,0) as totalTradingAmount,"+
                       "IFNULL((tradingbot.amount-IFNULL(sum(TS.amount),0)),0) as remainingTradingAmount,"+
                       "tradingbot.tamount as nextTradingAmount,"+
                       "tradingbot.tprice as nextTradePrice,"+
                       "tradingbot.upto_percent as upto_percent,"+
                       "tradingbot.market as tradeMarket,"+
                       "tradingbot.currency as tradeCurrency,"+
                       "tradingbot.id as botid,"+
                       "tradingbot.starts as starts,"+
                       "tradingbot.expire as expire,"+
                       "tradingbot.last_trade_time as last_trade_time,"+
                       "tradingbot.next_trade_time as next_trade_time,"+
                       "tradingbot.bidinterval as nextTradeInterval";
  var JOIN           = "LEFT JOIN trade_sell as TS ON TS.botid=tradingbot.id";
  var Condition      = "tradingbot.status=0 AND tradingbot.next_trade_time <='"+next_trade_time.format('Y-m-d H:M:S')+"'";
  var otherStatement = "GROUP BY tradingbot.id";
  var checkBotTable=await select_db("tradingbot",selectData,Condition,JOIN,otherStatement);
console.log(checkBotTable);
  if (checkBotTable.length > 0) {
      checkBotTable.forEach(async function(row) {
          var duration		 = 24;
          var upto_percent	 = row.upto_percent;
          var amount         = row.totalTradingAmount;
          var market         = row.tradeMarket;
          var currency       = row.tradeCurrency;
          var percent		 = Math.abs(randFun(upto_percent,0,'float',2));
		  var minTime			= 10*60;
		  var maxTime			= 50*60;
          var bidinterval		= randFun(minTime,maxTime,"num",'');
		  console.log("bidinterval=>",bidinterval);
		  console.log("amount=>",amount);
		  console.log("botid=>",row.botid);
          var perSectamount		= amount/(duration*60*60);
		  console.log("perSectamount=>",perSectamount);
          var tamount				= ((perSectamount*bidinterval)).toFixed(8);
          var tprice       	= await select_db("trade_sell","price as Price",'status=0 AND currency='+currency+" AND market="+market,'',"ORDER BY price ASC LIMIT 0,1");
		  console.log('newss',tprice);
		  if(tprice.length > 0)
		  {
			  tprice           	= parseFloat(tprice[0]['Price']);
			  mainFunc(market, currency, percent, tprice, tamount, bidinterval, row);
			  
			 
		}
    })
  }
}
 function mainFunc(market, currency, percent, tprice, tamount, bidinterval, row)
{
	try
{
	  tprice = ((parseFloat(tprice) - parseFloat(tprice * (percent / 100)))).toFixed(8);
	  console.log("market=>", market);
	  console.log("currency=>", currency);
	  var currentTime = dateTime.create();
	  var currentTime2 = dateTime.create();
	  currentTime.format('Y-m-d H:M:S');
	  var lastTradeTime = row.last_trade_time != '' ? row.last_trade_time : row.starts;
	  var nextTime = dateTime.create((currentTime2.getTime() + (1000 * bidinterval)));
	  nextTime.format('Y-m-d H:M:S');
	  console.log("next_trade_time =>", row.next_trade_time)
	  console.log("currentTime =>", currentTime._now)
	  console.log("tprice =>", tprice);
	  console.log("tamount =>", tamount);
	  var options = {
		method: 'GET',
		url: 'https://xoloex.io/ajaxresponse/bottradingsellnode?market='+market+'&currency='+currency+'&amount='+row.nextTradingAmount+'&price='+tprice+'&botid='+row.botid,
	  };
	  request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) 
		{
			try
			{
				  var resp = JSON.parse(body);
				  if (resp.status == 1) {
					var msgobj = {
					  crn: resp.currency, mkt: resp.market, uid: resp.userid, otype: 'torder', price: resp.price, ty: resp.type, btbt: 'bt',
					  formStr: {
						amount: resp.amount, price: resp.price,
					  },
					  dytb: {
						MarketHistory: resp.tbcont.MarketHistory,
						MarketHistoryTableTrData: resp.tbcont.MarketHistoryTableTrData,
						BuyOrderDetail: resp.tbcont.BuyOrderDetail,
						SellOrderDetail: resp.tbcont.SellOrderDetail,
						ExchangeCurrencyNav: resp.tkrd
					  },
					  dytb2: {
						OpenOrder: resp.tbcont.OpenOrder,
						OPOCID: resp.OPOCID,
						myOrderHistory: resp.tbcont.myOrderHistory,
						MyOrderHistoryTableTrData: resp.tbcont.MyOrderHistoryTableTrData
					  }
					};
					
					var message = JSON.stringify(msgobj);
					connect(message);
				  }
				  else {
				  }
		    } catch (e) {
				//console.error(e);
			} finally {
				//console.log('We do cleanup here');
			}
		}
	  });
	  var options2 = {
		method: 'GET',
		   url: 'https://xoloex.io/ajaxresponse/bottradingbuynode?market='+market+'&currency='+currency+'&amount='+row.nextTradingAmount+'&price='+tprice+'&botid='+row.botid,
	  };  
	  console.log('https://xoloex.io/ajaxresponse/bottradingbuynode?market='+market+'&currency='+currency+'&amount='+row.nextTradingAmount+'&price='+tprice+'&botid='+row.botid);
	  request(options2, function (error, response, body) {
		if (!error && response.statusCode == 200) 
		{
			try
			{
			  var resp = JSON.parse(body);
			  if (resp.status == 1) {
				var msgobj = {
				  crn: resp.currency, mkt: resp.market, uid: resp.userid, otype: 'torder', price: resp.price, ty: resp.type, btbt: 'bt',
				  formStr: {
					amount: resp.amount, price: resp.price,
				  },
				  dytb: {
					MarketHistory: resp.tbcont.MarketHistory,
					MarketHistoryTableTrData: resp.tbcont.MarketHistoryTableTrData,
					BuyOrderDetail: resp.tbcont.BuyOrderDetail,
					SellOrderDetail: resp.tbcont.SellOrderDetail,
					ExchangeCurrencyNav: resp.tkrd
				  },
				  dytb2: {
					OpenOrder: resp.tbcont.OpenOrder,
					OPOCID: resp.OPOCID,
					myOrderHistory: resp.tbcont.myOrderHistory,
					MyOrderHistoryTableTrData: resp.tbcont.MyOrderHistoryTableTrData
				  }
				};
				var message = JSON.stringify(msgobj);
				connect(message);
			  }
			  else {
			  }
			} catch (e) {
				//console.error(e);
			} finally {
				//console.log('We do cleanup here');
			}  
		}
	  });
	   var options3 = {
		   method: 'GET',
		   url: 'https://xoloex.io/cronjobs/ethTxnStatusUpdate',
		};  
		  request(options3, function (error, response, body) {
			if (!error && response.statusCode == 200) 
			{
				//console.log("body=>",body);
			}
		  })
	 
	  var upd = update_db("tradingbot", 'id=' + row.botid, 'percent=' + percent + ",tamount=" + tamount + ",tprice=" + tprice + ",bidinterval=" + bidinterval + ",last_trade_time='" + currentTime.format('Y-m-d H:M:S') + "',next_trade_time='" + nextTime.format('Y-m-d H:M:S') + "'");
	   upd.then(upd=>{
		 console.log(row.botid," completed")
	   })
	} catch (e) {
		//console.error(e);
	} finally {
		//console.log('We do cleanup here');
	}
}
async function runbot_old(count = 0) 
{
  var selectData = "next_trade_time as Min_next_trade_time,bidinterval,id as botID";
  var Condition = "tradingbot.status=0 AND tradingbot.next_trade_time < NOW()";
  // var otherStatement    = "ORDER BY next_trade_time ASC LIMIT 0,2";
  var otherStatement = "ORDER BY next_trade_time ASC";
  var checkBotTable =  select_db("tradingbot", selectData, Condition, '', otherStatement);
  checkBotTable.then(checkBotTable=>{
  var minTime = 4 * 60;
  var maxTime = 30 * 60;
  var bidinterval = randFun(minTime, maxTime, "num", '');
  count++;
  var loopMinTime = 2 * 60;
  var loopMaxTime = 6 * 60;
  var loopbidinterval = randFun(loopMinTime, loopMaxTime, "num", '');
  var recordCount = checkBotTable.length;
  var loopCount = 0;
  if (recordCount > 0) 
  {
    checkBotTable.forEach(async function (row) 
    {
      if (loopCount == recordCount) 
      {
        setTimeout(function () {  runbot(count); }, 1000 * loopbidinterval);
      }
      else 
      {
        console.log("count " + count + " \n");
        BotTrading(row.botID);
      }
      loopCount++;
    });
    if (loopCount == recordCount) 
    {
      setTimeout( function () {  runbot(count); }, 1000 * loopbidinterval);
    }
  }
  else 
  {
    console.log("count else part  " + count + " \n");
    setTimeout(function () { runbot(count); }, 1000 * 60 * 10);
  }
  })
} 
/*
async function  BotTradingOld(botID)
{
  //var next_trade_time = dateTime.create(next_trade_time);
  var selectData      ="IFNULL(sum(TS.amount),0) as tradedAmount,TS.id as TradeSellID,"+
                       "IFNULL(tradingbot.amount,0) as totalTradingAmount,"+
                       "IFNULL((tradingbot.amount-IFNULL(sum(TS.amount),0)),0) as remainingTradingAmount,"+
                       "tradingbot.tamount as nextTradingAmount,"+
                       "tradingbot.tprice as nextTradePrice,"+
                       "tradingbot.upto_percent as upto_percent,"+
                       "tradingbot.market as tradeMarket,"+
                       "tradingbot.currency as tradeCurrency,"+
                       "tradingbot.id as botid,"+
                       "tradingbot.starts as starts,"+
                       "tradingbot.expire as expire,"+
                       "tradingbot.last_trade_time as last_trade_time,"+
                       "tradingbot.next_trade_time as next_trade_time,"+
                       "tradingbot.bidinterval as nextTradeInterval";
  var JOIN           = "LEFT JOIN trade_sell as TS ON TS.botid=tradingbot.id";
 // var Condition      = "tradingbot.status=0 AND tradingbot.next_trade_time<='"+next_trade_time.format('Y-m-d H:M:S')+"'";
  var Condition = "tradingbot.status=0 AND tradingbot.id='" + botID+"'";
  var otherStatement = "GROUP BY tradingbot.id";
  var checkBotTable= select_db("tradingbot",selectData,Condition,JOIN,otherStatement);
  checkBotTable.then(checkBotTable=>{
    if (checkBotTable!=undefined && checkBotTable.length > 0) 
    {
        checkBotTable.forEach(async function(row) {
        var duration			 = 24;
        var upto_percent	 = row.upto_percent;
        var amount         = row.totalTradingAmount;
        var market         = row.tradeMarket;
        var currency       = row.tradeCurrency;
        var percent			   = Math.abs(randFun(upto_percent,0,'float',2));
        var minTime = 4 * 60;
        var maxTime = 30 * 60;
        var bidinterval		= randFun(minTime,maxTime,"num",'');
        var perSectamount		= amount/(duration*60*60);
        var tamount				= ((perSectamount*bidinterval)).toFixed(8);
        var selectMinTAmount = select_db("filter_fiat", "min_trading_amount as MinTradeAmount", "id=" + market, '', "");
        selectMinTAmount.then(selectMinTAmount=>{
        if (selectMinTAmount.length>0)
        {
          var newTamount = selectMinTAmount[0]['MinTradeAmount'];
          var newTotAmount = tamount * row.nextTradePrice;
          if (newTotAmount < selectMinTAmount[0]['MinTradeAmount']) 
          {
            var tamount = selectMinTAmount[0]['MinTradeAmount'] / row.nextTradePrice;
          }
          else
          {
            var tamount = ((perSectamount * bidinterval)).toFixed(8);
          }
        }
        else
        {
          var tamount = ((perSectamount * bidinterval)).toFixed(8);
        }
        var tprice       	=  select_db("trade_sell","price as Price",'status=0 AND currency='+currency+" AND market="+market,'',"ORDER BY price ASC LIMIT 0,1");
          tprice.then(tprice=>{
            if (tprice.length > 0) {
              tprice = parseFloat(tprice[0]['Price']);
              mainFunc(market, currency, percent, tprice, tamount, bidinterval, row);
            }
            else 
            {
              var tprice1 =  select_db("trade_sell", "price as Price", 'status=0 AND currency=' + currency + " AND market=" + market, '', "ORDER BY id DESC LIMIT 0,1");
              tprice1.then(tprice => {
                if (tprice.length > 0) {
                  tprice = parseFloat(tprice[0]['Price']);
                  mainFunc(market, currency, percent, tprice, tamount, bidinterval, row);
                }
                else {
                  var tprice2 =  select_db("trade_sell", "price as Price", '', '', "ORDER BY price ASC LIMIT 0,1");
                  tprice2.then(tprice => {
                      if (tprice.length > 0) {
                        tprice = parseFloat(tprice[0]['Price']);
                        mainFunc(market, currency, percent, tprice, tamount, bidinterval, row);
                      }
                    })
                }
              });
            }
          })
        
          })
			 
			 
		
    })
  }
  })
}
 */
connect();
function connect(msg='',msg1='')
{
    try{
		  //var ws = new WebSocket('wss://64.227.171.65:443/');
		var ws = new WebSocket('ws://64.227.171.65:3000/');
          ws.onopen = function(event)
          {
			  console.log('open');
            if(msg !='')
            {
                exmsg={"ctype":'ex',"msg":msg}
				setTimeout(() => {try { if (ws.readyState != WebSocket.CLOSED) { ws.send(JSON.stringify(exmsg)); } } catch (e) {  connect(); }});
                ws.close();
            }
            if(msg1 !='')
            {
                mktmsg={"ctype":'mkt',"msg":msg1}
				setTimeout(() => {try { if (ws.readyState != WebSocket.CLOSED) { ws.send(JSON.stringify(mktmsg)); } } catch (e) { connect(); }}); 
                ws.close();
            }
          };
          ws.onmessage = function(event)
          {
          };
          ws.onclose = function(event) {
             //connect();
          };
          ws.onerror = function(event) {
            //ws.close();
            console.log("event=>",event);
          };
  } catch (e) {  connect(); }
}app.listen(3000);