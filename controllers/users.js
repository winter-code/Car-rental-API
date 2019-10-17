var userModel = require('../Models/usermodel.js');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltrounds = 10;

router.use(bodyParser.json());


exports.sign_up = async function(req,res){
    let name = req.body.username;
    let temp = await new Promise(function(resolve,reject){
        userModel.find({username:name}, function(err,val){
            if(err){ throw err}
            resolve(val);
        })
    })

    if(temp.length != 0){
        res.json({
            "status":"Username already exists"
        })
        return;
    }
    
    let password = req.body.password;
    console.log(name,password);
    bcrypt.hash(password, saltrounds, function(err, hash){
        if(err) throw err;
        var user = new userModel({
            username: req.body.username,
            password: hash
        });
        user.save(function(err){
            if(err){
                console.log('Error');
                throw err;
            }
                
            console.log('User Saved!');
        });
        res.json(user);
    })  
}

exports.login = function(req,res,next){
    userModel.find({username: req.body.username},function(err,doc){
        console.log(doc);
    if(err)
        throw err; 	
    if(!doc){ 
        console.log('User not found!');
        res.send('User not found!');
    }
    else{
        console.log("user exists  ");
        passw = doc[0].password;
        console.log(doc);
        console.log(passw);
        bcrypt.compare(req.body.password, passw, function(err, result) {
            if(err)  
                throw err;
            if (result) {
              const token = jwt.sign(
                {
                  username: req.body.username,
                  password: req.body.password
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1000h"
                }
              );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        });   
        }
    })
}

