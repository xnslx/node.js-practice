const Product = require('../models/product');

// const Cart = require('../models/cart');
// const User = require('../models/user');
// const { ObjectId } = require('mongodb');

// exports.getProducts = (req, res, next) => {
//     Product.fetchAll(products => {
//         // console.log(products)
//         res.render('shop/product-list', {
//             prods: products,
//             pageTitle: 'All Products',
//             path: '/products'
//         })
//     });
// }

exports.getProducts = (req, res, next) => {
    // Product.fetchAll()
    Product.find()
        .then(products => {
            console.log(products)
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.getProduct = (req, res, next) => {
//     const prodId = req.params.productId;
//     Product.findById(prodId, product => {
//         // console.log(product)
//         res.render('shop/product-detail', {
//             product: product,
//             pageTitle: product.title,
//             path: '/products'
//         })
//     })
// }

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}

// exports.getIndex = (req, res, next) => {
//     Product.fetchAll(products => {
//         // console.log(products)
//         res.render('shop/index', {
//             prods: products,
//             pageTitle: 'Shop',
//             path: '/'
//         })
//     });
// }

exports.getIndex = (req, res, next) => {
    // Product.fetchAll()
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.getCart = (req, res, next) => {
//     Cart.getCart(cart => {
//         Product.fetchAll(products => {
//             // console.log(products)
//             const cartProducts = [];
//             for (product of products) {
//                 const cartProductData = cart.products.find(prod => prod.id === product.id)
//                     // console.log('cartProductData', cartProductData)
//                 if (cartProductData) {
//                     cartProducts.push({ productData: product, qty: cartProductData.qty })
//                 }
//             }
//             // console.log('cartProducts', cartProducts)
//             res.render('shop/cart', {
//                 path: '/cart',
//                 pageTitle: 'Your Cart',
//                 products: cartProducts
//             })
//         })
//     })
// }

// exports.getCart = (req, res, next) => {
//     req.user
//         .getCart()
//         .then(products => {
//             res.render('shop/cart', {
//                 path: '/cart',
//                 pageTitle: 'Your Cart',
//                 products: products
//             })
//         })
//     console.log('getCart', getCart())
//         .catch(err => console.log(err))
// }

exports.getCart = (req, res, next) => {
    // console.log('req.user', req.user)
    // const userId = req.user._id;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            // console.log('products', products)
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.postCart = (req, res, next) => {
//     // console.log(req.body)
//     const prodId = req.body.productId;
//     // console.log(prodId)
//     Product.findById(prodId, product => {
//         Cart.addProduct(prodId, product.price)
//     });
//     res.redirect('/cart');
// };

exports.postCart = (req, res, next) => {
    // console.log('req', req)
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            // console.log('shop.js', product)
            // console.log('req.user', req.user)
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.postCartDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     // console.log(prodId)
//     Product.findById(prodId, product => {
//         Cart.deleteProduct(prodId, product.price);
//         res.redirect('/cart');
//     })
// }

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log('prodId', prodId)
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.postCartDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     console.log('prodId', prodId)
//     User
//         .findByIdAndRemove(prodId)
//         .then(result => {
//             res.redirect('/cart')
//         })
//         .catch(err => {
//             console.log(err)
//         })
// }



exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    })
}

exports.getCheckOut = (req, res, next) => {
    res.render('./shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}