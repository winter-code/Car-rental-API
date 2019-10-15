
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();


router.use(bodyParser.json());

var carModel = require('../Models/carmodel.js');
var userModel = require('../Models/usermodel.js');

exports.cars_add = (req,res)=>{
    console.log(req.body);
    console.log('HI! Thank you for adding a car!');
    var car = new carModel({
        carNumber: req.body.carNumber,
        model: req.body.model,
        seatCapacity:req.body.seatCapacity,
        rentPerDay:req.body.rentPerDay,
        currentAvailable: req.body.currentAvailable
    });
    car.save(function(err){
        if(err) 
            throw err;
        console.log('Car added!');
    })
    res.json({
        "status":"ok",
        "result":"car saved"
    });
}

exports.cars_delete = (req,res)=>{
    carModel.deleteOne({carNumber : req.body.carNumber},function(){
        console.log("Deleted a car with number", req.body.carNumber);
    }).exec();
    res.json({
        "status":"ok",
        "result":"car deleted"
    });
}

exports.cars_update = (req,res)=>{
    carModel.updateOne({carNumber : req.body.carNumber},{currentAvailable : req.body.currentAvailable,
                                                         dateOfIssue : req.body.dateOfIssue,
                                                         dateOfReturn : req.body.dateOfReturn
                                                        }).exec(()=>console.log("Updated a car!"))
       res.json({
           "status" : "ok",
           "result" : "Updated details of car ; can be used to update any specific detail of car"
       })                                                 
}

exports.cars_view =async function(req,res){
  
    
    var obj = await new Promise(function(resolve,reject){
        var temp = carModel.find({});
        resolve(temp);
    })

    //filter to find cars with capacity entered in body

    if(req.body.seatCapacity){
        obj = obj.filter(function(val){
            if(req.body.seatCapacity == val.seatCapacity){
                return val;
            }
        })
    }

    //filter to find cars with car Number

    if(req.body.carNumber){
        obj = obj.filter(function(val){
            if(req.body.carNumber == val.carNumber){
                return val;
            }
        })
    }

    //filter to find cars of specific model

    if(req.body.model){
        obj = obj.filter(function(val){
            if(req.body.model == val.model){
                return val;
            }
        })
    }

    if(req.body.rentPerDay){
        obj = obj.filter((val)=>{
                if(req.body.rentPerDay <= val.rentPerDay){
                return val;
                }
        })
    }


    // filter to check availability between dates
    if(req.body.date){ 
        obj = obj.filter(function(val){
            if(val.dateOfIssue){
                var date1 = new Date(req.body.date.dateOfIssue);
                var date2 = new Date(val.dateOfIssue);
                var date3 = new Date(req.body.date.dateOfReturn);
                var date4 = new Date(val.dateOfReturn);
            if((date1 > date4) || (date3 < date2)){
                return val;
            }}
            else 
            return val;
        })
    }    
    //console.log(obj);

    data = obj.map(function(val){
        var temp = {
            "carNumber" : val.carNumber,
            "model" : val.model,
            "seatCapacity" : val.seatCapacity,
            "rentPerDay" : val.rentPerDay
        };
        return temp;
    })
    console.log(data);        
    res.json(data);
}

exports.cars_book = async function(req,res){
                              console.log("ARPANA MEHTA is here")  ;      
        let bookedCar = await carModel.find({carNumber: req.body.carNumber});
        console.log(bookedCar);
        userModel.where({username: req.body.username}).updateOne({$push:{data: bookedCar}},function(){
            console.log("car booked!");
        }).exec(()=>{
            carModel.updateOne({carNumber : req.body.carNumber},{currentAvailable : "false",
                dateOfIssue : req.body.dateOfIssue,
                dateOfReturn : req.body.dateOfReturn
               }).exec(()=>console.log("Updated a car!"));
               
                res.json({
                        "status" : "OK",
                        "result" : "Customer booked a car which has been added to his record and system has been updated!"
                })     
        })
                       
}

exports.cars_show_details = async function(req,res){
    var obj = await new Promise(function(resolve,reject){
           var temp = carModel.find({});
           resolve(temp);
       })
       if(req.body.carNumber){
           obj = obj.filter(function(val){
               if(req.body.carNumber == val.carNumber){
                   return val;
               } 
           })
       }
       
       data = obj.map(function(val){
        var temp = {
            "carNumber" : val.carNumber,
            "model" : val.model,
            "seatCapacity" : val.seatCapacity,
            "rentPerDay" : val.rentPerDay,
            "dateOfIssue" :  val.dateOfIssue,
            "dateOfReturn" : val.dateOfReturn,
            "currentAvailable" : val.currentAvailable
         }
        return temp;
    })
    console.log(data);        
    res.json(data);
}

exports.cars_show_booking = (req,res)=>{
    userModel.findOne({ username : req.body.username },function(err,doc){
        console.log("doc found!");
        if(err) throw err;
        res.json(doc.data);
    })
}



