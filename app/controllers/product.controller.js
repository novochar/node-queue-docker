const Product = require('../models/product.model');
const rsmq = require('../queue')

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.product_create = function (req, res) {
    let product = new Product(
        {
            name: req.body.name,
            price: req.body.price
        }
    );

    product.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Product Created successfully')
    })

    rsmq.sendMessage({
        qname: 'webhook-queue',
        message: `"controller": "{"product" : "create"}, "id": "${product.id}"`,
    }, (err, resp) => {
        if (resp) console.log('Message sent. ID:', resp);
        else console.log(err)
    });
};

exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return next(err);
        res.send(product);
    })

    rsmq.sendMessage({
        qname: 'webhook-queue',
        message: `"controller": "{"product" : "details"}, "id": "${req.params.id}"`,
    }, (err, resp) => {
        if (resp) console.log('Message sent. ID:', resp);
        else console.log(err)
    });
};

exports.product_index = function (req, res){
    const result = Product.find().lean().exec(function (err, products) {
        return res.end(JSON.stringify(products));
    })

    rsmq.sendMessage({
        qname: 'webhook-queue',
        message: `"controller": "{"product" : "index"}`,
    }, (err, resp) => {
        if (resp) console.log('Message sent. ID:', resp);
        else console.log(err)
    });
};

exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) return next(err);
        res.send('Product udpated.');
    });

    rsmq.sendMessage({
        qname: 'webhook-queue',
        message: `"controller": "{"product" : "update"}, "id": "${req.params.id}"`,
    }, (err, resp) => {
        if (resp) console.log('Message sent. ID:', resp);
        else console.log(err)
    });
};

exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })

    rsmq.sendMessage({
        qname: 'webhook-queue',
            message: `{"controller": { "product" : "delete"}, "id": ${req.params.id}`,
    }, (err, resp) => {
        if (resp) console.log('Message sent. ID:', resp);
        else console.log(err)
    });
};

