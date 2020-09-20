const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10')
    User.findById('5f62e7d04c628e208fcb8698')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.redirect('/');
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}