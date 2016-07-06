module.exports = function (app, passport, router) {
    var path = require("path");
    var Model = require('./Objects/model');
    var ObjectId = require('mongodb').ObjectID;
    //Model Details


    app.get('/Model/Details/:modelId', function (req, res) {
        res.cookie('modelNumber', req.params.modelId, {
            expires: new Date(Date.now() + 3600000 * 24 * 15),
            maxAge: 3600000 * 24 * 15
        });

        res.sendFile(path.join(__dirname + '/public/Pages/ModelDetails.html'));
    });


    //Login
    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/Login.html'));
    });


    //Signup

    app.get('/register', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/Register.html'));
    })

    app.get("/profile", isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/Profile.html'));
    })


    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // api ==================================================

    router.route('/model_list').get(function (req, res) {
        var model_list = [];

        Model.find({}, (function (err, docs) {
            docs.forEach(function (user) {
                model_list.push(user);
            })
            res.json(model_list);
        }));
    });

    router.route('/:model_Id').get(function (req, res) {

        Model.findOne({
            '_id': ObjectId(req.params.model_Id)
        }, function (err, model) {
            res.send(model);
        })
    });

    router.route('/url/:model_Id').get(function (req, res) {

        Model.findOne({
            '_id': ObjectId(req.params.model_Id)
        }, function (err, model) {
            console.log(model);
            res.send(model.url);
        })
    });

    router.route('/:model_Id').put(function (req, res) {
        var tag = req.query.tag;

        Model.update({
            '_id': ObjectId(req.params.model_Id)
        }, {
            $push: {
                tags: tag
            }
        }, function () {
            Model.findOne({
                '_id': ObjectId(req.params.model_Id)
            }, function (err, model) {
                res.send(model);
            })
        })

    });

    app.use('/api', router);
};


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}