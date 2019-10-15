var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    data: Array
})

//create model of schema

var userModel =  mongoose.model('carUser', userSchema);

module.exports = userModel;
