const { check } = require('express-validator');

// login validation rules
const loginValidation = [
    check('username') // ensure the username is not empty
        .notEmpty()
        .withMessage('Username is required'),

    check('password') // ensure password is at least 6 characters long
        .isLength({ min: 6 })
        .withMessage("Passwords must be at least 6 characters long")
];

module.exports = {
    loginValidation
};
