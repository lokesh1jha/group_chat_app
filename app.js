const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const sequelize = require('./util/database');

//Models
const User = require('./models/user');
const Message = require('./models/message')
const Conversations = require('./models/conversation')
const Groups = require('./models/groups')

//Routes
const userRoutes = require('./routes/user');
const admin =  require('./routes/admin');
const group =  require('./routes/group');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/user', userRoutes);
app.use('/admin', admin);
app.use('/group', group);
app.use('/admin', admin)

//Association
User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Conversations);
Conversations.belongsTo(User);

Message.belongsTo(Groups);
Groups.hasMany(Message);

Conversations.belongsTo(Groups);
Groups.hasMany(Conversations);


sequelize
    //   .sync({ force: true })
    .sync() 
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
