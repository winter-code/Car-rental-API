const express = require('express');
const mongoose = require('mongoose');
const app = express();


const url = 'mongodb+srv://arpana11:arpana123@arpana11-ganza.mongodb.net/test?retryWrites=true&w=majority';

mongoose.Promise = global.Promise;

mongoose.connect(url, { useNewUrlParser: true});

var db = mongoose.connection; 
db.on('error', function (err) {
    throw err
});
db.once("open", ()=> {
	console.log("--- Connected to DB --- ");
})

app.get('/',function(req,res){
	res.set('Content-Type', 'text/html');
	res.send(new Buffer('<h1 style="font-family: Helvetica; color: #808380;" > <center> Server is ready. To test the API, open Postman. </h3> <center> < a href="https://www.getpostman.com/collections/7daf09dc9a4d8c77d40b" > POST COLLECTION LINK. </a> <H2 > Welcome!! </h2> '));
	
}) 

var route = require('./Routes/carroutes.js');
app.use('/car',route)

var route1 = require('./Routes/userroutes.js');
app.use('/user',route1);




app.use(function (req, res, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

 // MIDDLEWARE to handle error
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});
const PORT = process.env.PORT || 4000;
app.listen(PORT,function(){
    console.log(PORT);
})

