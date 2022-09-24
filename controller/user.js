const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Conversation = require('../models/conversation')

exports.registerUser = (req, res, next) => {

    const { name, email, phone, password } = req.body;

    if (name === '' || email === '' || phone === '' || password === '') {
        return res.status(403).json({ sucess: false, message: "Some field are empty. Please fill all." })
    } else {
        User.findOne({
            where: { email: email }
        }).then((user) => {
            if (user) {
                return res.status(403).json({ user, sucess: false, message: "Email already exist" })
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
                    return res.status(200).json({ message: "Successful create new user" })
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

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (email == undefined || email.length === 0
            || password == undefined || password.length === 0) {
            return res.status(400).json({ err: 'Email Id or Password Missing', success: false })
        }
        const user = await User.findAll({ where: { email } })
        const conversations = await Conversation.findAll({ where: { userId: user[0].id } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(400).json({ message: 'Something went wrong' })
                }
                if (result === true) {
                    res.status(200).json({
                        message: 'Successfully logged in', success: true,
                        token: generateAccessToken(user[0].id), user: user, conversations: conversations
                    })
                } else {
                    res.status(400).json({ message: 'Password did not match', success: false })
                }
            })
        } else {
            res.status(404).json({ message: 'User does not exist' })
        }
    } catch (err) {
        console.log(err);
    }
}

