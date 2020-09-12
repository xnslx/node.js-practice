const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    // console.log(req.body)
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // const product = new Product(null, title, imageUrl, description, price)
    // product.save()
    // res.redirect('/')
    // const product = new Product(title, price, description, imageUrl, null, req.user._id);
    const product = new Product({ title: title, price: price, description: description, imageUrl: imageUrl })
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
                product: product
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
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, new ObjectId(prodId));
    product
        .save()
        .then(result => {
            console.log('updated product!')
            res.redirect('/admin/products')
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

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
        .then(() => {
            console.log('destroyed product')
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
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

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
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