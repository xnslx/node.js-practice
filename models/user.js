const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
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
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save()
}

// userSchema.methods.removeFromCart = function(prodId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//         return item.productId.toString() !== prodId.toString();
//     })
//     console.log('updatedCartItems', updatedCartItems)
//     this.cart.items = updatedCartItems;
//     return this.save()
// }

userSchema.methods.removeFromCart = function(prodId) {
    console.log('prodId', prodId)
    const needToBeDeletedProductIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === prodId.toString()
    });
    console.log('needToBeDeletedProductIndex', needToBeDeletedProductIndex)
    this.cart.items.splice(needToBeDeletedProductIndex, 1)
    console.log('this.cart.items', this.cart.items)
    return this.save(this.cart.items)
}


userSchema.methods.clearCart = function() {
    this.cart = { items: [] }
    return this.save()
}

module.exports = mongoose.model('User', userSchema)










// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb;
// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // {items:[]}
//         this._id = id;
//     }
//     save() {
//         const db = getDb();
//         return db
//             .collection('users')
//             .insertOne(this)
//         console.log('this', this)
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         })
//         return db
//             .collection('products')
//             .find({ _id: { $in: productsIds } })
//             .torArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString()
//                         }).quantity
//                     }
//                 })
//             })
//     }

//     addToCart(product) {
//         const newlyAddedProductIndex = this.cart.items.findIndex(prod => {
//             return prod.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (newlyAddedProductIndex >= 0) {
//             newQuantity = this.cart.items[newlyAddedProductIndex].quantity + 1;
//             updatedCartItems[newlyAddedProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             })
//         }
//         const updatedCart = {
//             items: updatedCartItems
//         }

//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection('users')
//             .findOne({ _id: new ObjectId(userId) })
//             .then(user => {
//                 console.log(user)
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }
// }

// module.exports = User;