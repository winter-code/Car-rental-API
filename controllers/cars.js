
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();


router.use(bodyParser.json());

var carModel = require('../Models/carmodel.js');
var userModel = require('../Models/usermodel.js');

function check(car) {
    

    if (car.length==0){
        
        return 1;
    }
    if (car[0].currentAvailable=="false")
    {
        
        return 2;
    }
    return 0;
}

exports.cars_add = (req,res)=>{
    console.log(req.body);
    console.log('HI! Thank you for adding a car!');
    var car = new carModel({
        carNumber: req.body.carNumber,
        carModel: req.body.carModel,
        noOfSeats:req.body.noOfSeats,
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

exports.cars_delete = async (req,res)=>{
    var car_to_delete = await new Promise(function(resolve, reject) {
        carModel.find({carNumber : req.body.carNumber}, function(err, dat){
            if(err){ throw err;}
            resolve(dat)
        })
    })
    console.log(car_to_delete)
    var x = check(car_to_delete)
    console.log(x)
    if (x==1){
        
        res.json({
            "status" : "Car not found."
        })
        return
    }
    else if(x==2){
        res.json({
            "status" : "Booked car cannot be deleted/updated",
            "result" : "car not deleted"
        })
    return
    }
    
    
    carModel.deleteOne({carNumber : req.body.carNumber},function(){
        console.log("Deleted a car with number", req.body.carNumber);
    }).exec();
    res.json({
        "status":"ok",
        "result":"car deleted"
    });
}

exports.cars_update = async (req,res)=>{
    var car_to_update = await new Promise(function(resolve, reject) {
        carModel.find({carNumber : req.body.carNumber}, function(err, dat){
            if(err){ throw err;}
            resolve(dat)
        })
    })
    console.log(car_to_update)
    var x = check(car_to_update)
    console.log(x)
    if (x==1){
        
        res.json({
            "status" : "Car not found."
        })
        return
    }
    else if(x==2){
        res.json({
            "status" : "Booked car cannot be deleted/updated",
            "result" : "car not updated"
        })
    return
    }
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

    if(req.body.noOfSeats){
        obj = obj.filter(function(val){
            if(req.body.noOfSeats == val.noOfSeats){
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

    //filter to find cars of specific carModel

    if(req.body.carModel){
        obj = obj.filter(function(val){
            if(req.body.carModel == val.carModel){
                return val;
            }
        })
    }


    //filter to find cars of a particular rent

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
            
        })
    }    
    //console.log(obj);

    data = obj.map(function(val){
        var temp = {
            "carNumber" : val.carNumber,
            "carModel" : val.carModel,
            "noOfSeats" : val.noOfSeats,
            "rentPerDay" : val.rentPerDay
        };
        return temp;
    })
    console.log(data);        
    res.json(data);
}

exports.cars_book = async function(req,res){
        console.log("Started process")  ;      
        let bookedCar = await carModel.find({carNumber: req.body.carNumber});
        if(bookedCar.length==0) { 
            res.json(
                {
                    "status" : "Car not found"

                }
            )
            return
        }
        console.log(bookedCar);
        if (bookedCar[0].currentAvailable == "false"){
            res.json({
                "status" : " Not Available for booking",
                "result" : "Try with something else!"
            })
            return
        }
        var update = await userModel.where({username: req.body.username}).updateOne({$push:{data: bookedCar}}).exec(()=>{
            carModel.updateOne({carNumber : req.body.carNumber},{
                currentAvailable : "false",
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
            "carModel" : val.carModel,
            "noOfSeats" : val.noOfSeats,
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
    userModel.findOne({ username : req.body.username },function(err,dat){
        console.log(dat);
        if(err) throw err;
        res.json(dat.data); 
    })
}



