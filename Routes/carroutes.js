var express = require('express');
var router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const saltrounds = 10;
router.use(bodyParser.json());

var carModel = require('../Models/carmodel.js');
var userModel = require('../Models/usermodel.js');

//check_auth
const check_auth = require('../Middleware/check_auth');



var urlencodedParser = bodyParser.urlencoded({ extended: false })

const url = require('url');

//contoller 
const CarsController = require('../controllers/cars');

//apis


router.post('/admin/addCar', check_auth, CarsController.cars_add);
router.post('/admin/deleteCar', check_auth, CarsController.cars_delete);
router.post('/admin/update', check_auth, CarsController.cars_update);
router.post('/viewCars', CarsController.cars_view);


//book car
router.post('/bookCar', check_auth, 
	 CarsController.cars_book	
);
router.post('/showCarDetails',CarsController.cars_show_details);
router.post('/showMyCarBookings', check_auth,CarsController.cars_show_booking);



module.exports = router;
