// import modules
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//===============================================================
// reference : mongoosejs.com/docs/api.html
//===============================================================

// connect database
mongoose.connect(process.env.MONGO_DB_NODEBLOG);

var db = mongoose.connection;

db.once("open", function () {
    console.log("DB connected!");
});

db.on("error", function (err) {
    console.log("DB ERROR: ", err);
});

// model setting
// reference: mongoosejs.com/docs/api.html#schematype_SchemaType-default
var postSchema = mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date
});

var Post = mongoose.model('post', postSchema);

var dataSchema = mongoose.Schema({
    name: String,
    count: Number
});

var Data = mongoose.model('data', dataSchema);

Data.findOne({name: "myData"}, function (err, data) {
    if (err)
        return console.log("Data ERROR: ", err);
    if (!data) {
        Data.create({name: "myData", count: 0}, function (err, data) {
            if (err)
                return console.log("Data ERROR: ", err);

            console.log("Counter initialized :", data);
        });
    }
});

// view setting
app.set("view engine", "ejs");
app.use(bodyParser.json());

// set middleware
app.use(express.static(path.join(__dirname, '/public')));

// set routes
// reference: mongoosejs.com/docs/api.html#model_Model.find
app.get('/posts', function (req, res) {
    Post.find({}, function (err, posts) {
        if (err)
            res.json({success: false, message: err});

        res.json({success: true, data: posts});
    });
}); // index

app.post('/posts', function (req, res) {
    Post.create(req.body.post, function (err, post) {
        if (err)
            return res.json({success: false, message: err});

        res.json({success: true, data: post});
    });
}); // create

app.get('/posts/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err)
            return res.json({success: false, message: err});

        res.json({success: true, data: post});
    });
}); // show

app.put('/posts/:id', function (req, res) {
    req.body.post.updatedAt = Date.now();

    Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, post) {
        if (err)
            return res.json({success: false, message: err});

        res.json({success: true, message: post._id + " updated"});
    });
}); // update

app.delete('/posts/:id', function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err, post) {
        if (err)
            return res.json({success: false, message: err});

        res.json({success: true, message: post._id + " deleted"});
    });
}); // destroy

app.get('/', function (req, res) {
    Data.findOne({name : "myData"}, function (err, data) {
        if (err)
            console.log("Data ERROR: ", err);

        data.count++;

        Data.save(function (err) {
            if (err)
                console.log("Data ERROR", err);

            res.render('my_first_ejs', data);
        });
    });
});

app.get('/reset', function (req, res) {
    setCounter(res, 0);
});

app.get('/set', function (req, res) {
    if (req.query.count)
        setCounter(res, req.query.count);
    else
        getCounter(res);
});

app.get('/set/:number', function (req, res) {
    if (req.params.number)
        setCounter(res, req.params.number);
    else
        getCounter(res);
});

function getCounter(res)
{
    console.log("getCounter");

    Data.findOne({name: "myData"}, function (err, data) {
        if (err)
            return console.log("Data ERROR:", err);

        res.render('my_first_ejs', data);
    });
}

function setCounter(res, number)
{
    console.log("setCounter");

    Data.findOne({name: "myData"}, function (err, data) {
        if (err)
            return console.log("Data ERROR:", err);

        data.count = number;

        data.save(function (err) {
            if (err)
                return console.log("Data ERROR:", err);

            res.render('my_first_ejs', data);
        });
    });
}

// start server
app.listen(3000, function() {
    console.log(__dirname);
    console.log('Service On!');
});