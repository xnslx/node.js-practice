const Product = require('../models/product');

const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        // console.log(products)
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
        // console.log(product)
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        })
    })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        // console.log(products)
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        })
    });
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            // console.log(products)
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                    // console.log('cartProductData', cartProductData)
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty })
                }
            }
            // console.log('cartProducts', cartProducts)
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            })
        })
    })
}

exports.postCart = (req, res, next) => {
    // console.log(req.body)
    const prodId = req.body.productId;
    // console.log(prodId)
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price)
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // console.log(prodId)
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        console.log(product)
        res.redirect('/cart');
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