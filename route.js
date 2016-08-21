module.exports = function (app, passport, router) {
    var path = require("path");
    var Model = require('./Objects/model');
    var User = require('./Objects/user');
    var ObjectId = require('mongodb').ObjectID;
    var ipn = require('paypal-ipn');
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })

    //Model Details ================================================
    app.get('/Model/Details/:modelId', function (req, res) {
        res.cookie('modelNumber', req.params.modelId, {
            expires: new Date(Date.now() + 3600000 * 24 * 15),
            maxAge: 3600000 * 24 * 15
        });

        res.sendFile(path.join(__dirname + '/public/Pages/ModelDetails.html'));
    });

    //Search Page ===================================================
    app.get("/Search", function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/search.html'));
    })

    //Login =========================================================
    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/Login.html'));
    });


    //Signup =========================================================

    app.get('/register', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/Register.html'));
    })

    //Profile ========================================================
    app.get("/profile", isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/Profile.html'));
        req.session.userId = Math.random(0, 100000);
    })

    //My Models ======================================================
    app.get("/profile/mymodels", isLoggedIn, function (req, res) {
        if (!req.session.dwnld && req.session.userId) {
            req.session.dwnld = req.session.userId;
        }
        res.sendFile(path.join(__dirname + '/public/Pages/myModels.html'));
    });

    //Paypal Link ====================================================
    app.get("/promotion", isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/promotion.html'));
    })

    app.get("/thanks", function (req, res) {
        console.log(req);
        res.sendFile(path.join(__dirname + '/public/Pages/thanks.html'));
    })


    //Favorites =======================================================================

    app.put("/addfavorites", urlencodedParser, function (req, res) {
        var urlstring = req.param("url");
        var name = req.param("name");

        User.findByIdAndUpdate(req.user._id, {
                $push: {
                    "favorites": {
                        Name: name,
                        urlString: urlstring
                    }
                }
            }, {
                safe: true,
                upsert: true,
                new: true
            },
            function (err, user) {
                console.log(err)
                console.log(user);
            }
        )
        res.status(200).end();
    })

    app.put("/removefavorite", urlencodedParser, function (req, res) {
        var urlstring = req.param("url");

        User.findByIdAndUpdate(req.user._id, {
                $pull: {
                    "favorites": {
                        urlString: urlstring
                    }
                }
            },
            function (err, user) {
                console.log(err)
                console.log(user);
            }
        )
        res.status(200).end();


    })

    app.put("/purchasemodel", urlencodedParser, function (req, res) {
        var id = req.param("id");
        var name = req.param("name");

        User.findByIdAndUpdate(req.user._id, {
                $push: {
                    "models": {
                        Name: name,
                        _id: id
                    }
                }
            }, {
                safe: true,
                upsert: true,
                new: true
            },
            function (err, user) {
                console.log(err)
                console.log(user);
            }
        )
        res.status(200).end();
    });


    //Reigistration and Login Posts ====================================================
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/register', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // API ==================================================

    router.route('/model_list').get(function (req, res) {
        var model_list = [];

        Model.find({}, (function (err, docs) {
            if (docs != undefined) {
                docs.forEach(function (user) {
                    model_list.push(user);
                })
                res.json(model_list);
            }
        }));
    });

    router.route('/model/:model_Id').get(function (req, res) {

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
            res.send(model.url);
        })
    });

    router.route('/download/:model_Id').get(function (req, res) {

        if (req.session.dwnld) {
            Model.findOne({
                '_id': ObjectId(req.params.model_Id)
            }, function (err, model) {
                res.download(__dirname + model.url, model.Title + ".json");
            })
        } else {
            res.redirect("/");
        }
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

    router.route('/user').get(function (req, res) {
        if (isLoggedIn) {
            var user = req.user;
            res.send(user);
        }
    })

    //is LoggedIn Linking//
    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/Pages/Connect-Local.html'));
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/connect/local',
        failureFlash: true
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));



    // local -----------------------------------
    app.get('/unlink/local', function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function (req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    app.use('/api', router);
};


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}