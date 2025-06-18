// Import required libraries and modules
const Sequelize = require('sequelize'); 
const dotenv = require('dotenv'); 

dotenv.config();

// Initialize a Sequelize instance for database connection
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST, 
        port: process.env.DB_PORT, 
        dialect: process.env.DB_DIALECT, 
        logging: false
    }
);

// test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.'); 
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err.message || err); 
    });

module.exports = sequelize;
