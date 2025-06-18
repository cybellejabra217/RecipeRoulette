const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');
const Cuisine = require('./cuisine');
const User = require('./user');

// defines the recipe model, to manage information regarding recipes
const Recipe = sequelize.define('Recipe', {

    // unique identifier for recipes
    RecipeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },

    // all data fields of recipe
    Title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Title cannot be empty.'
            },
            notNull: {
                msg: 'Title is required.'
            }
        }
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Ingredients: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    // enum of values easy moderate hard
    DifficultyLevel: {
        type: DataTypes.ENUM('easy', 'moderate', 'hard'),
        allowNull: true,
        validate: {
            isIn: {
                args: [['easy', 'moderate', 'hard']],
                msg: 'DifficultyLevel must be one of: easy, moderate, hard.'
            }
        }
    },
    AverageRating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: 'AverageRating must be greater than or equal to 0.'
            },
            max: {
                args: [5],
                msg: 'AverageRating must be less than or equal to 5.'
            }
        }
    },
    CuisineID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Cuisine,
            key: 'CuisineID'
        }
    },
    Calories: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: 'Calories must be an integer.'
            },
            min: {
                args: [0],
                msg: 'Calories cannot be negative.'
            }
        }
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'UserID'
        }
    },

    // enum of vegan vegetarion pescetarian gluten free lactose free and none
    DietaryPreferences: {
        type: DataTypes.ENUM('Vegan', 'Vegetarian', 'Pescetarian', 'Gluten-Free', 'Lactose-Free', 'None'),
        allowNull: true,
        validate: {
            isIn: {
                args: [['Vegan', 'Vegetarian', 'Pescetarian', 'Gluten-Free', 'Lactose-Free', 'None']],
                msg: 'DietaryPreferences must be one of: Vegan, Vegetarian, Pescetarian, Gluten-Free, Lactose-Free, or None.'
            }
        }
    },
}, {
    tableName: 'recipe',
    timestamps: false,
});

// defining foreign keys of UserID and cuisineID in recipe table
Recipe.belongsTo(User, {
    foreignKey: 'UserID',
    as: 'user',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

Recipe.belongsTo(Cuisine, {
    foreignKey: 'CuisineID',
    as: 'cuisine',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

module.exports = Recipe;
