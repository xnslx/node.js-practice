const products = [];

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    // console.log(req.body)
    products.push({ title: req.body.title })
    res.redirect('/')
}

exports.getProducts = (req, res, next) => {
    res.render('shop', {
        prods: products,
        pageTitle: 'Shops',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    })
}