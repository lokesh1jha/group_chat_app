const { type } = require('os');
const Sequelize = require('sequelize');
const sequelize = require('../util/database')



const GroupMember = sequelize.define("groupmember", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    name: {type: Sequelize.INTEGER}
    });

module.exports = GroupMember;
