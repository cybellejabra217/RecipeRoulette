const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

// defines the cuisine model, to manage information regarding cuisines
const Cuisine = sequelize.define('Cuisine', {

    // unique identifier for each cuisine
    CuisineID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },

    // the cuisine name
    CuisineName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, 
        validate: {
            notEmpty: {
                msg: 'CuisineName cannot be empty.'
            },
            notNull: {
                msg: 'CuisineName is required.'
            },
            isValidName(value) {
                if (typeof value !== 'string' || !value.trim()) {
                    throw new Error('CuisineName must contain non-whitespace characters.');
                }
            }
        }
    },
}, {
    tableName: 'cuisine',
    timestamps: false
});

module.exports = Cuisine;
