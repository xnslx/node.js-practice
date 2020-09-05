// const fs = require('fs');

// const path = require('path');

// const Cart = require('./cart')

// const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

// const getProductsFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//         // console.log('fileContent', fileContent.toString())
//         if (err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     })
// }

// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     save() {
//         getProductsFromFile(products => {
//             if (this.id) {
//                 const existingProductIndex = products.findIndex(prod => prod.id === this.id)
//                 const updatedProducts = [...products]
//                 updatedProducts[existingProductIndex] = this;
//                 fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//                     console.log(err)
//                 })
//             } else {
//                 this.id = Math.random().toString();
//                 products.push(this);
//                 fs.writeFile(p, JSON.stringify(products), err => {
//                     console.log(err)
//                 })
//             }
//         })
//     }

//     static fetchAll(cb) {
//         getProductsFromFile(cb)
//     }

//     static findById(id, cb) {
//         getProductsFromFile(products => {
//             const product = products.find(p => p.id === id);
//             cb(product)
//         });
//     }

//     static deleteProductById(id) {
//         getProductsFromFile(products => {
//             const product = products.find(prod => prod.id === id)
//                 // console.log(products)
//             const updatedProducts = products.filter(prod => prod.id !== id)
//             fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//                 if (!err) {
//                     Cart.deleteProduct(id, product.price)
//                 }
//             })
//         })
//     }
// }
const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = new mongodb.ObjectId(id)
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this })
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products)
                return products
            })
            .catch(err => {
                console.log(err)
            })

    }

    static findById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .find({ _id: new mongodb.ObjectID(prodId) })
            .next()
            .then(product => {
                console.log(product)
                return product;
            })
            .catch(err => {
                console.log(err)
            })
    }
}

module.exports = Product;