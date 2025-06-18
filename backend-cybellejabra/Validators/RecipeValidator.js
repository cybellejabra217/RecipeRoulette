const { check } = require('express-validator');

// recipe validation rules
const recipeValidation = [
    check('title') // validate title field
        .notEmpty()
        .withMessage('Title is required'),

    check('description') // validate description field
        .notEmpty()
        .withMessage('Description is required'),

    check('ingredients') // validate ingredients field
        .notEmpty()
        .withMessage('Ingredients are required'),

    check('instructions') // validate instructions field
        .notEmpty()
        .withMessage('Instructions are required'),

    check('difficultyLevel') // validate difficultyLevel field
        .isIn(['easy', 'moderate', 'hard'])
        .withMessage('Invalid difficulty level'),

    check('cuisineID') // validate cuisineID field
        .notEmpty()
        .withMessage('Cuisine ID is required')
        .isInt({ min: 1 })
        .withMessage('Invalid cuisine ID'),

    check('calories') // validate calories field
        .isInt({ min: 0 })
        .withMessage('Calories must be a non-negative integer'),

    check('userID') // validate userID field
        .notEmpty()
        .withMessage('User ID is required')
        .isInt({ min: 1 })
        .withMessage('Invalid user ID'),
];

module.exports = {
    recipeValidation,
};
