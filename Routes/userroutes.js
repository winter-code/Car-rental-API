var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcryptjs');

router.use(bodyParser.json());

var carModel = require('../Models/carmodel.js');
var userModel = require('../Models/usermodel.js');

//contollers
const UsersController = require('../controllers/users');

router.post('/signup', 
	UsersController.sign_up
)

//login

router.post('/login',UsersController.login)

module.exports = router;
