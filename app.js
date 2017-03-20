var express = require('express');
var path = require('path');
var app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '/public')));

var data = { count: 0 };

app.get('/', function (req, res) {
    data.count++;
    res.render('my_first_ejs', data);
});

app.get('/reset', function (req, res) {
    data.count = 0;
    res.render('my_first_ejs', data);
});

app.get('/set', function (req, res) {
    if (req.query.count)
        data.count = req.query.count;
    res.render('my_first_ejs', data);
});

app.get('/set/:number', function (req, res) {
    data.count = req.params.number;
    res.render('my_first_ejs', data);
});

app.listen(3000, function() {
    console.log(__dirname);
    console.log('Service On!');
});