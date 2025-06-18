const { check } = require('express-validator');

// review validation rules
const reviewValidation = [
    check('content') // validate content
        .notEmpty().withMessage('Review content is required'),
    check('recipeID') // validate recipeID
        .notEmpty().withMessage('Recipe ID is required')
        .isInt({ min: 1 }).withMessage('Invalid recipe ID'),
    check('value') //validat value
        .isIn([1, 2, 3, 4, 5]).withMessage('Rating value must be either 1, 2, 3, 4, or 5')
        .isInt().withMessage('Rating value must be an integer'),
];
module.exports = {
    reviewValidation,
};