var express = require('express');
var path = require('path');
var app = express();

//
// reference : mongoosejs.com/docs/api.html
//
var mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_DB_NODEBLOG);
mongoose.connect("mongodb://root:admin@ds061676.mlab.com:61676/nodeblog");

var db = mongoose.connection;

db.once("open", function () {
    console.log("DB connected!");
});

db.on("error", function (err) {
    console.log("DB ERROR: ", err);
});

var dataSchema = mongoose.Schema({
    name: String,
    count: Number
});

var Data = mongoose.model('datas', dataSchema);

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

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '/public')));

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

app.listen(3000, function() {
    console.log(__dirname);
    console.log('Service On!');
});