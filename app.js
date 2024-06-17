// backend main app.js of easyOrder App 
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dataPaths = require('./config/data');
const index = require('./routes/index');
const admincp = require('./routes/admincp');
const mongoose = require('./config/mongoose');

const app = express();
const port = 3000;
 

app.use(session({
    secret: 'EO_435_juYtd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.locals.shoppingCart = [];

app.use(express.static(dataPaths.frontend));

app.set('view engine', 'ejs');
app.set('views', dataPaths.views);

app.use('/', index);
app.use('/vieworder', index);
app.use('/admincp', admincp);
 
app.use((req, res) => {
    res.status(404).render('./frontend/404');
});

app.listen(port, () => {
    console.log(`Started easyOrder App successfully using shared network, Port: ${port}`);
});
