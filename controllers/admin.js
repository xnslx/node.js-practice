const fileHelper = require('../util/file');

const { validationResult } = require('express-validator')

const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    // console.log(req.body)
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    // const product = new Product(null, title, imageUrl, description, price)
    // product.save()
    // res.redirect('/')
    // const product = new Product(title, price, description, imageUrl, null, req.user._id);
    const imageUrl = image.path;
    const product = new Product({ title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user })
    product
        .save()
        .then(result => {
            console.log('create product')
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    // console.log(req.query)
    const editMode = req.query.edit;
    // console.log('editMode', editMode)
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            console.log(err)
        })
        // Product.findById(prodId, product => {
        //     if (!product) {
        //         return res.redirect('/')
        //     }
        //     res.render('admin/edit-product', {
        //         pageTitle: 'Edit Product',
        //         path: '/admin/edit-product',
        //         editing: editMode,
        //         product: product
        //     })
        // })
}

// exports.postEditProduct = (req, res, next) => {
//     console.log('req.body', req.body)
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedDesc = req.body.description;
//     const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice);
//     updatedProduct.save();
//     res.redirect('/admin/products')
// }

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    // const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, new ObjectId(prodId));
    // product
    //     .save()
    //     .then(result => {
    //         console.log('updated product!')
    //         res.redirect('/admin/products')
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user_id.toString()) {
                res.redirect('/')
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            if (image) {
                fileHelper.deleteFile(product.imageUrl)
                product.imageUrl = image.path
            }
            return product.save().then(result => {
                console.log('updated product!')
                res.redirect('/admin/products')
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     console.log(prodId)
//     Product.deleteProductById(prodId)
//     res.redirect('/admin/products')
// }
exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .populate('userId')
        .then(products => {
            console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     // Product.deleteById(prodId)
//     Product.findById(prodId).then(product => {
//             if (!product) {
//                 return next(new Error('product not found!'))
//             }
//             fileHelper.deleteFile(product.imageUrl)
//             return Product.deleteOne({ _id: prodId, userId: req.user._id })
//         }).then(() => {
//             console.log('destroyed product')
//             res.redirect('/admin/products')
//         })
//         .catch(err => {
//             console.log(err)
//         })
// }

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
            if (!product) {
                return next(new Error('product not found!'))
            }
            fileHelper.deleteFile(product.imageUrl)
            return Product.deleteOne({ _id: prodId, userId: req.user._id })
        }).then(() => {
            console.log('destroyed product')
            res.status(200).json({ message: 'Success!' })
        })
        .catch(err => {
            res.status(500).json({ message: 'Deleting product failed!' })
        })
}

// exports.getProducts = (req, res, next) => {
//     Product.fetchAll(products => {
//         // console.log(products)
//         res.render('admin/products', {
//             prods: products,
//             pageTitle: 'Admin Products',
//             path: '/admin/products'
//         })
//     });
// }