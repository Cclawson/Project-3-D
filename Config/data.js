module.exports = {
    //"mongodb://cclawson:Nu130441882@ds061954.mlab.com:61954/dbproject3d"

    'url': "mongodb://cclawson:acdclive1@aws-us-east-1-portal.9.dblayer.com:11080/users",

    'seedData': [
        {
            Title: 'Model 1',
            arthur: 'Cody Clawson',
            tags: [],
            url: '/Models/Model1.json',
            image: '/images/models/model.png',
            price: "1.00"
    },
        {
            Title: 'Model 2',
            arthur: 'Walter W.',
            tags: [],
            url: '/Models/Model2.json',
            image: '/images/models/model.png',
            price: "2.00"
    },
        {
            Title: 'Rubiks Cube',
            arthur: 'Bob The Artist',
            tags: [],
            url: '/Models/Model3.json',
            image: '/images/models/model.png',
            price: "3.00"
    },
        {
            Title: 'Cool Model',
            arthur: 'Joe Cool',
            tags: [],
            url: '/Models/Model2.json',
            image: '/images/models/model.png',
            price: "1.50"
    },
        {
            Title: 'Blank Model',
            arthur: 'Tim Test',
            tags: [],
            url: '/Models/Model2.json',
            image: '/images/models/model.png',
            price: "4.00"
    }
],
};


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