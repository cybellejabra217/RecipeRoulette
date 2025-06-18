const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

// defines the review model, to manage information regarding reviews
const Review = sequelize.define('Review', {

    // unique identifier for each review
    ReviewID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },

    // its data fields
    Content: {
        type: DataTypes.TEXT,
        allowNull: true, 
    },
    ReviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, 
    },
    RecipeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'recipe', 
            key: 'RecipeID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user', 
            key: 'UserID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    Value: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        validate: {
            min: {
                args: [1],
                msg: 'Value must be at least 1.'
            },
            max: {
                args: [5],
                msg: 'Value cannot exceed 5.'
            },
            isInt: {
                msg: 'Value must be an integer.'
            }
        },
    },
}, {
    tableName: 'review', 
    timestamps: false, 
});

// defining the foreign keys UserID and RecipeID in review table
Review.associate = (models) => {
    console.log("models: " + models)
    Review.belongsTo(models.User, {
        foreignKey: 'UserID',
        as: 'user', 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    Review.belongsTo(models.Recipe, {
        foreignKey: 'RecipeID',
        as: 'recipe',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = Review;
