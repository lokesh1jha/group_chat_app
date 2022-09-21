const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const userRoutes = require('./routes/user');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRoutes);


sequelize
    //   .sync({ force: true })
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
