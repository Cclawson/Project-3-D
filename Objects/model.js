var mongoose = require('mongoose');

var modelSchema = mongoose.Schema({
    Title: String,
    arthur: String,
    tags: [],
    url: String
});

module.exports = mongoose.model('Model', modelSchema);