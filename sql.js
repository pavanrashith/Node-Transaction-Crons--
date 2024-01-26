var mysql = require('mysql');
module.exports.con = mysql.createConnection({
  host: "localhost",
  user: "BTRLDbU",
  password: "0sCg1g!9$5!",
  database        : 'BTRLDb'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
/*
async function select_db(table, array) {
    return new Promise(async function(resolve, reject) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, async function(err, db) {
            var dbo = db.db("tccblocks");
            dbo.collection(table).find(array).toArray(async function(err, result) {
                if (err) reject(err);
                resolve(result);
				
				db.close();
            });
            
        });
    });
};
async function comman_select_db(table, aggre=null)
{
    return new Promise(async function(resolve, reject) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, async function(err, db) {
            var dbo = db.db("tccblocks").collection(table);
            if(aggre!=null)
            {
                dbo=dbo.aggregate(aggre)
            }
            dbo.toArray(async function(err, result) {
                if (err) reject(err);
                resolve(result);
				
				db.close();
            });
        });
    });
};


async function insert_db(table, array) {
    return new Promise(async function(resolve, reject) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, async function(err, db) {
            var dbo = db.db("tccblocks");
            dbo.collection(table).insertOne(array, async function(err, res) {
                if (err) reject(err);
                resolve(res);
				db.close();
            });
        });
    });
};

async function update_db(table, condition, array) {
    return new Promise(async function(resolve, reject) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, async function(err, db) {
            var dbo = db.db("tccblocks");
            dbo.collection(table).updateOne(condition, {$set: array}, async function(err, res) {
                if (err) reject(err);
                resolve(res);
				db.close();
            });
        });
    });
};

async function delete_db(table, condition) {
    return new Promise(async function(resolve, reject) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, async function(err, db) {
            var dbo = db.db("tccblocks"); 
            dbo.collection(table).deleteMany(condition, function(err, res) {
                if (err) reject(err);
                resolve(res);
				db.close();
            });
            
        });
    });
};

module.exports = {
    select_db,
    insert_db,
    update_db,
    delete_db,
    comman_select_db,
}
*/