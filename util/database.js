const mongodb = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://Xian:xian123456@cluster0.a2ngi.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected');
            _db = client.db()
            callback()
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
};

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// const uri = "mongodb+srv://Xian:xian123456@cluster0.a2ngi.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });