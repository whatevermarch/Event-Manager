var app = require('express')();
var port = process.env.PORT || 7777;
var users = require('./users');
var mongojs = require('./db');
var db = mongojs.connect;
var ObjectId = mongojs.ObjectId;
var path = require("path");
var bodyParser = require('body-parser');
var json2csv = require('json2csv');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    db.events.find(function(err, docs) {
        if (err) throw err;
        res.render('list', { evList: docs });
    });
});

app.get('/new_event', function (req, res) {
    res.render('new_event', {});
});

app.get('/:id/register', function (req, res) {
    var id = req.params.id;
    res.render('register', { evID: id });
});

app.get('/:id/csv', function (req, res) {
    var evid = ObjectId(req.params.id);
    db.participants.find({ eventID: evid }, function(err, docs) {
        if (err) throw err;
        
        var fields = ['name'];
        var fieldNames = ['Participant Name'];
        var data = json2csv({ data: docs, fields: fields, fieldNames: fieldNames });

        res.attachment('CSV_Data.csv');
        res.status(200).send(data);
    });
});

app.get('/:id/delete', function (req, res) {
    var evid = ObjectId(req.params.id);
    db.events.remove({ _id: evid });
    db.participants.remove({ eventID: evid });
    res.redirect('/');
});

app.post('/event_created', function (req, res) {
    var json = req.body;
    db.events.insert(json);
    res.redirect('/');
});

app.post('/:id/regis_completed', function (req, res){
    var evid = ObjectId(req.params.id);
    var json = req.body;
    db.participants.insert({name: json.name, eventID: evid});
    res.redirect('/');
});

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});