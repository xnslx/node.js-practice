const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')
const flash = require('connect-flash');

const errorController = require('./controllers/error')

const User = require('./models/user');

const MONGODB_URL = 'mongodb+srv://Xian:xian123456@cluster0.a2ngi.mongodb.net/shop'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
})

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    // console.log('app.js', req.session.user)
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        })
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    console.log('res.locals.csrfToken', res.locals.csrfToken)
    console.log('res.locals.isAuthenticated', res.locals.isAuthenticated)
    next();
})


app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose
    .connect(MONGODB_URL)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });