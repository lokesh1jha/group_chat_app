const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const Message = require('./models/message')
const Conversations = require('./models/conversation')
const GroupMember = require('./models/groupmember')

const userRoutes = require('./routes/user');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRoutes);

//Association
User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Conversations);
Conversations.belongsTo(User);

Message.belongsTo(GroupMember);
GroupMember.hasMany(Message);

Conversations.belongsTo(GroupMember);
GroupMember.hasMany(Conversations);


sequelize
    //   .sync({ force: true })
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
