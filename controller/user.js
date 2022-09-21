const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = (req, res, next) => {

    const { name, email, phone, password } = req.body;

    if (name === '' || email === '' || phone === '' || password === '') {
        return res.status(403).json({ sucess: false, message: "Some field are empty. Please fill all." })
    } else {
        User.findOne({
            where: {
                email: email
            }
        }).then((user) => {
            if (user) {
                return res.status(403).json({ sucess: false, message: "Email already exist" })
            }
        })
    }
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            //Store hash in your password DB
            if (err) {
                console.log('Unable to create new user');
                return res.json({ message: 'Unable to create new user' });
            }
            User.create({ name, email, phone, password: hash })
                .then(() => {
                    return res.status(201).json({ message: "Successful create new user" })
                })
                .catch(err => {
                    console.log("Error in Registration :" + err.message);
                    return res.status(403).json({ sucess: false, error: err })
                })
        })
    })
}
