const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

// defines the user model, to manage information regarding users
const User = sequelize.define('User', {

    // unique identifier for each user
    UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },

    // data fields
    Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Username cannot be empty.'
            },
            notNull: {
                msg: 'Username is required.'
            }
        }
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password cannot be empty.'
            },
            notNull: {
                msg: 'Password is required.'
            },
            len: {
                args: [6, 255],
                msg: 'Password should be at least 6 characters long.'
            }
        }
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Email cannot be empty.'
            },
            notNull: {
                msg: 'Email is required.'
            },
            isEmail: {
                msg: 'Must be a valid email address.'
            }
        }
    },
    JoinDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: {
                msg: 'JoinDate must be a valid date.'
            },
            notNull: {
                msg: 'JoinDate is required.'
            }
        }
    },
    Bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
        }
    },
}, {
    tableName: 'user',
    timestamps: false,
});

module.exports = User;
