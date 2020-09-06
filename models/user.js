const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart; // {items:[]}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this)
    }

    addToCart(product) {
        const updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: 1 }] };
        const db = getDb();
        return db
            .collection('users')
            .updatedOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })

    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .find({ _id: new ObjectId(userId) })
            .next()
            .then(user => {
                console.log(user)
                return user;
            })
            .catch(err => {
                console.log(err)
            })
    }
}

module.exports = User;