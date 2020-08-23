const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        console.log(products)
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        })
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        console.log(product)
    })
    res.redirect('/')
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        console.log(products)
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shops',
            path: '/'
        })
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/shop/cart',
        pageTitle: 'Your Cart'
    })
}

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