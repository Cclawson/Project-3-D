// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('passport');
var passport_local = require('passport-local');
var cookie_parser = require('cookie-parser');
var express_session = require('express-session');
var flash = require('connect-flash');
var configDB = require('./Config/data.js');
require('./Config/passport')(passport);


// Config App =================================================
app.use(cookie_parser());
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express_session({
    secret: 'projectthreed'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/style", express.static(__dirname + '/public/Style'));
app.use("/fonts", express.static(__dirname + '/public/fonts'));
app.use("/Models", express.static(__dirname + '/Models'));

//Passport Setup =====================================================

passport.use(new passport_local(
    function (username, password, done) {
        User.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
})

//Database Config ========================================================================

mongoose.connect(configDB.url);

//var conn = mongoose.connection;
//conn.collection("models").insert(configDB.seedData, onInsert);
//
//
//function onInsert(err, docs) {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log(docs);
//    }
//}


// set our port ================================================================================
var port = Number(process.env.PORT || 3000);

router.use(function (req, res, next) {
    next(); 
});

// routes ==================================================
require('./route.js')(app, passport, router);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/Pages/index.html'));
})

// startup our app at http://localhost:8080 ==============================================================
app.listen(process.env.PORT || 8080, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// expose app     =========================================================================       
exports = module.exports = app;