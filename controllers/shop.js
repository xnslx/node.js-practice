const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;
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
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments().then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
    const page = +req.query.page || 1;
    let totalItems;
    Product.find().countDocuments().then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
    console.log('req.session.isLoggedIn', req.session.isLoggedIn)
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
    // console.log('prodId', prodId)
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

exports.postOrders = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc } }
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            })
            console.log('products', products)
            return order.save()
        })
        .then(result => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            // console.log('orders', orders)
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            })
        })
        .catch(err => console.log(err))
}

// exports.getCheckOut = (req, res, next) => {
//     res.render('./shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout',
//         isAuthenticated: req.session.isLoggedIn
//     })
// }

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    // console.log('orderId', orderId)
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found!'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName)

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=" ' + invoiceName + '"')
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice = totalPrice + prod.quantity * prod.product.price;
                pdfDoc.fontSize(14).text(prod.product.title + '-' + prod.quantity + 'X' + '$' + prod.product.price)
            })

            pdfDoc.text('-----')

            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice)

            pdfDoc.end()


            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         console.log(err)
            //         return next()
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'inline; filename=" ' + invoiceName + '"')
            //     res.send(data)
            // })
            // const file = fs.createReadStream(invoicePath)
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename=" ' + invoiceName + '"');
            // file.pipe(res)
        })
        .catch(err => {
            console.log(err)
        })
        // const invoiceName = 'invoice-' + orderId + '.pdf';
        // const invoicePath = path.join('data', 'invoices', invoiceName)
        // const pdfDoc = new PDFDocument();
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename=" ' + invoiceName + '"')
        // pdfDoc.pipe(fs.createReadStream(invoicePath));
        // pdfDoc.pipe(res);
        // pdfDoc.font(26).text('Invoice')
        // pdfDoc.end()
}