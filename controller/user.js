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


function generateAccessToken(id) {
    return jwt.sign(id, process.env.TOCKEN_SECRET);
}

exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    console.log(password);
    User.findAll({ where: { email } }).then(user => {
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, function (err, response) {
                if (err) {
                    console.log(err)
                    return res.json({ success: false, message: 'Something went wrong' })
                }
                if (response) {
                    console.log(JSON.stringify(user))
                    const jwttoken = generateAccessToken(user[0].id);
                    return res.status(200).json({ token: jwttoken, ispremiumuser: user[0].ispremiumuser, success: true, message: 'Successfully Logged In' })
                    // Send JWT  
                } else {
                    // response is OutgoingMessage object that server response http request
                    return res.status(401).json({ success: false, message: 'passwords do not match' });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: 'passwords do not match' })
        }
    })
}


exports.sendmessage = (req, res, next) => {
    console.log("Sending Message")
}

exports.getmessage = (req, res, next) => {
    console.log("Sending Message");
}