// server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var methodOverride = require('method-override');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();
var passport = require('passport');
var passport - local = require('passport-local');
var cookie - parser = require('cookie-parser');
var express - session = require('express-session');


//DB Connection
var db = "mongodb://cclawson:Nu130441882@ds061954.mlab.com:61954/dbproject3d"

// set our port
var port = process.env.PORT || 8080;

//Test Data
var seedData = [
    {
        Title: 'Model 1',
        arthur: 'Cody Clawson',
        tags: [],
        url: '/Models/Model1.json'
    },
    {
        Title: 'Model 2',
        arthur: 'Walter W.',
        tags: [],
        url: '/Models/Model2.json'
    },
    {
        Title: 'Rubiks Cube',
        arthur: 'Bob The Artist',
        tags: [],
        url: '/Models/Model3.json'
    },
    {
        Title: 'Cool Model',
        arthur: 'Joe Cool',
        tags: [],
        url: '/Models/Model2.json'
    },
    {
        Title: 'Blank Model',
        arthur: 'Tim Test',
        tags: [],
        url: '/Models/Model2.json'
    }
];

//Data Test for mongo connection
//MongoClient.connect(db, function (err, db) {
//    if (err) throw err;
//    var models = db.collection('models');
//    models.insert(seedData, function (err, result) {
//        if (err) throw err;
//
//        models.find({
//            arthur: "Cody Clawson"
//        }).toArray(function (err, docs) {
//
//            if (err) throw err;
//
//            docs.forEach(function (doc) {
//                console.log(
//                    doc['Title'] + ' is by ' + doc['arthur'] + ' and is located at ' + doc['url'] + '.'
//                );
//            });
//            db.close(function (err) {
//                if (err) throw err;
//            });
//        });
//    });
//
//});

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/Models", express.static(__dirname + '/Models'));

router.use(function (req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

// routes ==================================================

app.get('/Model/Details/:modelId', function (req, res) {
    res.cookie('modelNumber', req.params.modelId, {
        expires: new Date(Date.now() + 3600000 * 24 * 15),
        maxAge: 3600000 * 24 * 15
    });

    res.sendFile(path.join(__dirname + '/public/Pages/ModelDetails.html'));
});

app.get('/Login', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/Pages/Login.html'));
});

// api ==================================================

router.route('/model_list').get(function (req, res) {
    var model_list;
    MongoClient.connect(db, function (err, db) {
        if (err) throw err;
        var models = db.collection('models');
        models.find().toArray(function (err, docs) {
            if (err) throw err;
            model_list = docs;
            db.close(function (err) {
                if (err) throw err;
            });
            res.json(model_list);
        });
    });
});

router.route('/:model_Id').get(function (req, res) {
    MongoClient.connect(db, function (err, db) {
        if (err) throw err;
        var models = db.collection('models');
        models.findOne({
            _id: ObjectId(req.params.model_Id)
        }).then(function (model) {
            res.send(model);
        })
    });
});

router.route('/url/:model_Id').get(function (req, res) {
    MongoClient.connect(db, function (err, db) {
        if (err) throw err;
        var models = db.collection('models');
        models.findOne({
            _id: ObjectId(req.params.model_Id)
        }).then(function (model) {
            res.send(model.url);
        })
    });
});

router.route('/:model_Id').put(function (req, res) {
    var tag = req.query.tag;
    MongoClient.connect(db, function (err, db) {
        if (err) throw err;
        var models = db.collection('models');
        models.update({
            _id: ObjectId(req.params.model_Id)
        }, {
            $push: {
                tags: tag
            }
        }).then(
            models.findOne({
                _id: ObjectId(req.params.model_Id)
            }).then(function (model) {
                res.send(model);
            })
        )
    });
})

//Passport Setup




//Tell app to use api routes
app.use('/api', router);

// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user                     
console.log('Server Started on port ' + port);

// expose app           
exports = module.exports = app;