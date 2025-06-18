
const sequelize = require('../Config/DBConfig');

const User = require('./user');
const Review = require('./review');
const Recipe = require('./recipe');

// establishing a one-to-mant relationship between User and Review models

// a User can have many Reviews, with a foreign key 'UserID' in the Review model
User.hasMany(Review, { foreignKey: 'UserID', as: 'review' });

// a Review belongs to a User, with 'UserID' as the forign key
Review.belongsTo(User, { foreignKey: 'UserID', as: 'user' });

// establishing a one-to-many relationship between Recipe and Review models

// a Recipe can have many Reviews, with a foreign key 'RecipeID' in the Review model
Recipe.hasMany(Review, { foreignKey: 'RecipeID', as: 'review' });

// a Review belongs to a Recipe, with 'RecipeID' as the foreign key
Review.belongsTo(Recipe, { foreignKey: 'RecipeID', as: 'recipe' });

// synchronizing the database schema with the models, without forcing the database to reset (force: false)
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

module.exports = { User, Review, Recipe, sequelize };
