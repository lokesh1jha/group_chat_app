const { type } = require('os');
const Sequelize = require('sequelize');
const sequelize = require('../util/database')



const Groups = sequelize.define("groups", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    name: {type: Sequelize.STRING}
    });

module.exports = Groups;
