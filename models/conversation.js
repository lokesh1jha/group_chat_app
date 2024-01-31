const Sequelize = require('sequelize');
const sequelize = require('../util/database')



const Conversations = sequelize.define("conversations", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    isadmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Conversations;
