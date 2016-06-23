// server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var MongoClient = require('mongodb').MongoClient;
// configuration ===========================================

// config files
var db = "mongodb://cclawson:Nu130441882@ds061954.mlab.com:61954/dbproject3d"

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 
var seedData = [
    {
        decade: '1970s',
        artist: 'Debby Boone',
        song: 'You Light Up My Life',
        weeksAtOne: 10
  },
    {
        decade: '1980s',
        artist: 'Olivia Newton-John',
        song: 'Physical',
        weeksAtOne: 10
  },
    {
        decade: '1990s',
        artist: 'Mariah Carey',
        song: 'One Sweet Day',
        weeksAtOne: 16
  }
];

//Data Test for mongo connection
MongoClient.connect(db, function (err, db) {
    if (err) throw err;
    var songs = db.collection('songs');
    songs.insert(seedData, function (err, result) {
        if (err) throw err;
        songs.update({
                song: 'One Sweet Day'
            }, {
                $set: {
                    artist: 'Mariah Carey ft. Boyz II Men'
                }
            },
            function (err, result) {

                if (err) throw err;

                /*
                 * Finally we run a query which returns all the hits that spend 10 or
                 * more weeks at number 1.
                 */

                songs.find({
                    weeksAtOne: {
                        $gte: 10
                    }
                }).sort({
                    decade: 1
                }).toArray(function (err, docs) {

                    if (err) throw err;

                    docs.forEach(function (doc) {
                        console.log(
                            'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
                            ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
                        );
                    });

                    // Since this is an example, we'll clean up after ourselves.
                    songs.drop(function (err) {
                        if (err) throw err;

                        // Only close the connection when your app is terminating.
                        db.close(function (err) {
                            if (err) throw err;
                        });
                    });
                });
            }
        );
    });

});

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

// routes ==================================================
//require('./app/routes')(app); // configure our routes
// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;