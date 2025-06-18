const User = require('../Models/user');

/**
 * Updates the user's bio based on the provided UserID and newBio.
 * @param {number} UserID - The ID of the user whose bio is being updated.
 * @param {string} newBio - The new bio text for the user.
 * @returns {Object} - An object containing the UserID of the updated user.
 * @throws {Error} - If the user is not found or the bio is not updated.
 */
const updateUserBio = async (UserID, newBio) => {
    try {

        // updates the user's bio
        const [updated] = await User.update(
            { Bio: newBio || null },
            { where: { UserID: UserID } }
        );

        // throws error if failure to update bio
        if (!updated) {
            throw new Error('User not found or bio not updated.');
        }

        return { UserID: UserID };
    } catch (error) {
        console.error('Error updating user bio:', { error, username });
        throw new Error('Failed to update user bio.');
    }
};

/**
 * Finds and returns a user based on their username.
 * @param {string} username - The username of the user to be found.
 * @returns {Object} - The user object associated with the username.
 * @throws {Error} - If the username is invalid or the user cannot be found.
 */
const findUserByUsername = async (username) => {

    // validates username 
    if (typeof username !== 'string' || !username.trim()) {
        throw new Error('A valid username is required.');
    }

    try {

        // finds user with the specified username
        const user = await User.findOne({ where: { Username: username.trim() } });
        return user; 
    } catch (error) {

        // throws error
        console.error('Error fetching user by username:', { error, username });
        throw new Error('Failed to fetch user by username.');
    }
};

/**
 * Finds and returns a user based on their email address.
 * @param {string} email - The email address of the user to be found.
 * @returns {Object} - The user object associated with the email.
 * @throws {Error} - If the email is invalid or the user cannot be found.
 */
const findUserByEmail = async (email) => {

    // validates email
    if (typeof email !== 'string' || !email.trim()) {
        throw new Error('A valid email is required.');
    }

    try {
        // finds user with the specified email
        const user = await User.findOne({ where: { Email: email.trim() } });
        return user; 
    } catch (error) {

        // throws error
        console.error('Error fetching user by email:', { error, email });
        throw new Error('Failed to fetch user by email.');
    }
};

/**
 * Finds and returns the UserID associated with a given username.
 * @param {string} username - The username of the user whose ID is to be found.
 * @returns {number} - The UserID of the user.
 * @throws {Error} - If the username is invalid or the user cannot be found.
 */
const findUserIdByUsername = async (username) => {

    // validates the username
    if (typeof username !== 'string' || !username.trim()) {
        throw new Error('A valid username is required.');
    }

    try {

        // finds user id of specified usrname (finds user first then gets the user id)
        const user = await User.findOne({
            where: { Username: username.trim() },
            attributes: ['UserID']
        });

        if (!user) {
            throw new Error('User not found.');
        }
        // returns user id
        return user.UserID;
    } catch (error) {

        // throws error
        console.error('Error fetching user ID by username:', { error, username });
        throw new Error('Failed to fetch user ID by username.');
    }
};


/**
 * Finds and returns the username associated with a given UserID.
 * @param {number} userId - The UserID of the user whose username is to be found.
 * @returns {string} - The username associated with the UserID.
 * @throws {Error} - If the user ID is invalid or the user cannot be found.
 */
const findUsernameByUserId = async (userId) => {

    // validates user id
    if (typeof userId !== 'number' || userId <= 0) {
        throw new Error('A valid user ID is required.');
    }

    try {

        // finds user with specified user id and then gets the username of that fetched user
        const user = await User.findOne({
            where: { UserID: userId },
            attributes: ['Username']
        });

        if (!user) {
            throw new Error('User not found.');
        }

        // returns the username
        return user.Username;
    } catch (error) {

        // throws error
        console.error('Error fetching username by user ID:', { error, userId });
        throw new Error('Failed to fetch username by user ID.');
    }
};


/**
 * Finds and returns the user object associated with a given UserID.
 * @param {number} userId - The UserID of the user to be found.
 * @returns {Object} - The user object associated with the UserID.
 * @throws {Error} - If the user ID is invalid or the user cannot be found.
 */
const findUser = async (userId) => {

    // validates user id
    if (typeof userId !== 'number' || userId <= 0) {
        throw new Error('A valid user ID is required.');
    }

    try {

        // finds user according to user id received
        const user = await User.findOne({
            where: { UserID: userId }
        });

        if (!user) {
            throw new Error('User not found.');
        }
       
        // returns the user
        return user;
    } catch (error) {

        // throws error
        console.error('Error fetching username by user ID:', { error, userId });
        throw new Error('Failed to fetch username by user ID.');
    }
};

/**
 * Retrieves the join date of the user based on their username.
 * @param {string} username - The username of the user whose join date is to be fetched.
 * @returns {string} - The join date of the user.
 * @throws {Error} - If the username is invalid or the user cannot be found.
 */
const getUserJoinDate = async (username) => {

    // validates username
    if (typeof username !== 'string' || !username.trim()) {
        throw new Error('A valid username is required.');
    }

    try {

        // finds user from username and gets their join date
        const user = await User.findOne({
            where: { Username: username.trim() },
            attributes: ['JoinDate']
        });

        if (!user) {
            throw new Error('User not found.');
        }
        // returns join date
        return user.JoinDate;
    } catch (error) {

        // throws error
        console.error('Error fetching user join date:', { error, username });
        throw new Error('Failed to fetch user join date.');
    }
};

/**
 * Retrieves the bio of the user based on their username.
 * @param {string} username - The username of the user whose bio is to be fetched.
 * @returns {string} - The bio of the user.
 * @throws {Error} - If the username is invalid or the user cannot be found.
 */
const getUserBio = async (username) => {

    // validates username
    if (typeof username !== 'string' || !username.trim()) {
        throw new Error('A valid username is required.');
    }

    try {
        // finds user from username and gets that user's bio
        const user = await User.findOne({
            where: { Username: username.trim() },
            attributes: ['Bio']
        });

        if (!user) {
            throw new Error('User not found.');
        }

        // returns the bio
        return user.Bio;
    } catch (error) {

        // throws error
        console.error('Error fetching user bio:', { error, username });
        throw new Error('Failed to fetch user bio.');
    }
};

// exports the modules
module.exports = {
    updateUserBio,
    findUserByUsername,
    getUserJoinDate,
    getUserBio,
    findUserIdByUsername,
    findUsernameByUserId,
    findUserByEmail,
    findUser
};
