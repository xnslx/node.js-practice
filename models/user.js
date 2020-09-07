const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
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
        const newlyAddedProductIndex = this.cart.items.findIndex(prod => {
            return prod.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (newlyAddedProductIndex >= 0) {
            newQuantity = this.cart.items[newlyAddedProductIndex].quantity + 1;
            updatedCartItems[newlyAddedProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            })
        }
        const updatedCart = {
            items: updatedCartItems
        }
        const db = getDb();
        return db
            .collection('users')
            .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
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