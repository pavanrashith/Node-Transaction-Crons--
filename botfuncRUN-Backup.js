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

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const web3wss = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8592'));
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "fiveexchange",
    password: "Micro@123#@",
    database: 'fiveexchange',
    port: '3306'
});

async function select_db(table, data = '*', condition = "", stJoin = "", otherStatement = "") {
    return new Promise(async function(resolve, reject) {
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
async function runbot(count = 0) {
    var selectData = "next_trade_time as Min_next_trade_time,bidinterval";
    var Condition = "tradingbot.status=0";
    var otherStatement = "ORDER BY next_trade_time ASC LIMIT 0,2";
    var checkBotTable = await select_db("tradingbot", selectData, Condition, '', otherStatement);
   /*  var minTime = 10 * 60;
    var maxTime = 50 * 60; */
	var minTime			= 4*60;
	var maxTime			= 30*60;
    var bidinterval = randFun(minTime, maxTime, "num", '');
    count++;
    if (checkBotTable.length > 0) {
        var next_trade_time = checkBotTable[0]['Min_next_trade_time'];
        var delay_bidinterval = checkBotTable.length > 1 && checkBotTable[1]['Min_next_trade_time'] != "" ? (dateTime.create(checkBotTable[1]['Min_next_trade_time']).getTime() - dateTime.create(checkBotTable[0]['Min_next_trade_time']).getTime()) / 1000 : bidinterval;
        var checkSign = Math.sign(delay_bidinterval);
        console.log("count " + count + " \n");
        BotTrading(next_trade_time);
        setTimeout(function() {
            runbot(count);
        }, 1000 * delay_bidinterval);
    } else {
        console.log("count else part  " + count + " \n");
        setTimeout(function() {
            runbot(count);
        }, 1000 * 60 * 10);
    }
}
async function BotTrading(next_trade_time) {

    var next_trade_time = dateTime.create(next_trade_time);
    var selectData = "IFNULL(sum(TS.amount),0) as tradedAmount,TS.id as TradeSellID," +
        "IFNULL(tradingbot.amount,0) as totalTradingAmount," +
        "IFNULL((tradingbot.amount-IFNULL(sum(TS.amount),0)),0) as remainingTradingAmount," +
        "tradingbot.tamount as nextTradingAmount," +
        "tradingbot.tprice as nextTradePrice," +
        "tradingbot.upto_percent as upto_percent," +
        "tradingbot.market as tradeMarket," +
        "tradingbot.currency as tradeCurrency," +
        "tradingbot.id as botid," +
        "tradingbot.starts as starts," +
        "tradingbot.expire as expire," +
        "tradingbot.last_trade_time as last_trade_time," +
        "tradingbot.next_trade_time as next_trade_time," +
        "tradingbot.bidinterval as nextTradeInterval";
    var JOIN = "LEFT JOIN trade_sell as TS ON TS.botid=tradingbot.id";
    var Condition = "tradingbot.status=0 AND tradingbot.next_trade_time<='" + next_trade_time.format('Y-m-d H:M:S') + "'";
    var otherStatement = "GROUP BY tradingbot.id";
    var checkBotTable = await select_db("tradingbot", selectData, Condition, JOIN, otherStatement);
    if (checkBotTable != undefined && checkBotTable.length > 0) {
        checkBotTable.forEach(async function(row) {
            var duration = 24;
            var upto_percent = row.upto_percent;
            var amount = row.totalTradingAmount;
            var market = row.tradeMarket;
            var currency = row.tradeCurrency;
            var percent = Math.abs(randFun(upto_percent, 0, 'float', 2));
            /* var minTime = 10 * 60;
            var maxTime = 50 * 60; */
			var minTime = 4 * 60;
            var maxTime = 30 * 60;
            var bidinterval = randFun(minTime, maxTime, "num", '');
            console.log("bidinterval=>", bidinterval);
            console.log("amount=>", amount);
            console.log("botid=>", row.botid);
            var perSectamount = amount / (duration * 60 * 60);
            console.log("perSectamount=>", perSectamount);
            var tamount = ((perSectamount * bidinterval)).toFixed(8);
            var tprice = await select_db("trade_sell", "price as Price", 'status=0 AND currency=' + currency + " AND market=" + market, '', "ORDER BY price ASC LIMIT 0,1");
            var selectMinTAmount = await select_db("filter_fiat", "min_trading_amount as MinTradeAmount", "id=" + market, '', "");
            if (selectMinTAmount.length > 0) {
                var newTamount = selectMinTAmount[0]['MinTradeAmount'];
                var newTotAmount = tamount * row.nextTradePrice;
                if (newTotAmount < selectMinTAmount[0]['MinTradeAmount']) {
                    var tamount = selectMinTAmount[0]['MinTradeAmount'] / row.nextTradePrice;
                }
            }
            if (tprice.length > 0) {
                tprice = parseFloat(tprice[0]['Price']);
            } else {
                var tprice = await select_db("trade_sell", "price as Price", 'status=0 AND currency=' + currency + " AND market=" + market, '', "ORDER BY id DESC LIMIT 0,1");
                if (tprice.length > 0) {
                    tprice = parseFloat(tprice[0]['Price']);
                } else {
                    var tprice = await select_db("trade_sell", "price as Price", '', '', "ORDER BY price ASC LIMIT 0,1");
                    if (tprice.length > 0) {
                        tprice = parseFloat(tprice[0]['Price']);
                    }
                }
            }

            console.log('tp=>', tprice);
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
            console.log("currentTime =>", currentTime)
            console.log("tprice =>", tprice);
            console.log("tamount =>", tamount);
            var options = {
                method: 'GET',
                url: 'https://xoloex.io/ajaxresponse/bottradingsellnode?market=' + market + '&currency=' + currency + '&amount=' + row.nextTradingAmount + '&price=' + tprice + '&botid=' + row.botid,
                headers: {

                },
            };
            request(options, function(error, response, body) {
		//console.log(body);
                if (!error && response.statusCode == 200) {

                    var resp = JSON.parse(body);

                    if (resp.status == 1) {
                        var msgobj = {
                            crn: resp.currency,
                            mkt: resp.market,
                            uid: resp.userid,
                            otype: 'torder',
                            price: resp.price,
                            ty: resp.type,
                            btbt: 'bt',
                            formStr: {
                                amount: resp.amount,
                                price: resp.price,
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

                    } else {
                        console.log(resp.data);
                    }
                }
            });
            var options2 = {
                method: 'GET',
                url: 'https://xoloex.io/ajaxresponse/bottradingbuynode?market=' + market + '&currency=' + currency + '&amount=' + row.nextTradingAmount + '&price=' + tprice + '&botid=' + row.botid,
                headers: {

                },
            };
            request(options2, function(error, response, body) {
                if (!error && response.statusCode == 200) {

                    var resp = JSON.parse(body);
                    if (resp.status == 1) {
                        var msgobj = {
                            crn: resp.currency,
                            mkt: resp.market,
                            uid: resp.userid,
                            otype: 'torder',
                            price: resp.price,
                            ty: resp.type,
                            btbt: 'bt',
                            formStr: {
                                amount: resp.amount,
                                price: resp.price,
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

                    } else {
                        console.log(resp.data);
                    }
                }
            });

            await update_db("tradingbot", 'id=' + row.botid, 'percent=' + percent + ",tamount=" + tamount + ",tprice=" + tprice + ",bidinterval=" + bidinterval + ",last_trade_time='" + currentTime.format('Y-m-d H:M:S') + "',next_trade_time='" + nextTime.format('Y-m-d H:M:S') + "'");

        })
    }
}
connect();

function connect(msg = '', msg1 = '') {
    var ws = new WebSocket('ws://64.227.171.65:3000');
    ws.onopen = function(event) {
		console.log('opem');
        if (msg != '') {
            exmsg = {
                "ctype": 'ex',
                "msg": msg
            }
            ws.send(JSON.stringify(exmsg));
            ws.close();
        }
        if (msg1 != '') {
            mktmsg = {
                "ctype": 'mkt',
                "msg": msg1
            }
            ws.send(JSON.stringify(mktmsg));

            ws.close();
        }
    };
    ws.onmessage = function(event) {

    };

    ws.onclose = function(event) {
        //connect();
    };
    ws.onerror = function(event) {
        //ws.close();
        console.log(event);
    };
}
app.listen(8578);