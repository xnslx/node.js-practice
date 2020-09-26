const bcrypt = require('bcryptjs');

const User = require('../models/user');



exports.getLogin = (req, res, next) => {
    console.log('req.session', req.session)
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
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email)
    // console.log(password)
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/')
                        })
                    }
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login')
                })
        })
        .catch(err => {
            console.log(err)
            res.redirect('/login')
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
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return newUser.save();
                })
                .then(result => {
                    res.redirect('/login')
                });
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