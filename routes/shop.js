const express = require('express');

const path = require('path')

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router()

router.get('/', (req, res, next) => {
    // console.log(adminData.products)
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    const products = adminData.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'Shops',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    })
})

module.exports = router;