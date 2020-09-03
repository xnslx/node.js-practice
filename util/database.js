const mongodb = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://Xian:xian123456@cluster0.a2ngi.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected');
            callback(client)
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = mongoConnect;

// const uri = "mongodb+srv://Xian:xian123456@cluster0.a2ngi.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });