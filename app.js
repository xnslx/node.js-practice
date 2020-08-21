const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use('/404', errorController.get404)

app.listen(3000)