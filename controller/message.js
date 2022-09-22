const User = require('../models/user')
const Message = require('../models/message')

exports.sendMessage  = (req, res, next) => {
    const {message, senderId, receiverId} = req.body;
    Message.create({ message, senderId, receiverId })
    .then(() => {
        res.status(200).json({ message: "Message sent Successful" })
    })
    .catch(err => {
        res.status(403).json({ sucess: false, error: err })
        console.log("error " + err.message);
    })
}