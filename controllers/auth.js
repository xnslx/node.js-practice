const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10')
    User.findById('5f62e7d04c628e208fcb8698')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err) => {
                console.log(err)
                res.redirect('/')
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup')
            }
            const newUser = new User({
                email: email,
                password: password,
                cart: { items: [] }
            })
            return newUser.save();
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}