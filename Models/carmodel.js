var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carSchema = new mongoose.Schema({
    carNumber : String,
    model : String,
    seatCapacity : Number,
    rentPerDay : Number,
    currentAvailable : String,
    dateOfIssue : Date,
    dateOfReturn : Date
});

var carModel = mongoose.model('car', carSchema);

module.exports = carModel;
