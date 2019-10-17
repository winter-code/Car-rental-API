var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carSchema = new mongoose.Schema({
    carNumber : String,
    carModel : String,
    noOfSeats : Number,
    rentPerDay : Number,
    currentAvailable : String,
    dateOfIssue : Date,
    dateOfReturn : Date
});

var carModel = mongoose.model('car', carSchema);

module.exports = carModel;
