
const mongoose = require('mongoose');
const dev_db_url = 'mongodb://mongo:27017';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//const jobs = require('./jobs')
const express = require('express');
const bodyParser = require('body-parser');

const product = require('./routes/product.route');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);

const port = 8080;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});