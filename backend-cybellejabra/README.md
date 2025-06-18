1. Project Setup Instruction:

- Prerequisites:
    - Node.js
    - MySQL (setup the database)
    - npm

- Setup Steps:
    - Clone the repository using: git clone https://github.com/cybelle217/recipeRouletteBackend.git then cd recipeRouletteBackend
    - install npm (to install all dependencies)
    - Set up environmental variables (create .env file with the following keys: PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET)
    - npm start/ nodemon app (to run the server)

2. API Endpoints and Usage:

NOTE: ALL ROUTES NEED JWT AUTHENTICATION EXCEPT LOGIN AND REGISTER WHICH ARE RESPONSIBLE FOR GENERATING IT

Authentication:
/register: POST request to register a user
/login: POST request to login a user

User Management:
/myProfile: POST request to get all details for profile
/userProfile/:username : GET request to get details for another user's profile
/updateUserBio : POST request to update a user's bio
/getUserByUsername/:username : GET request to fetch the user according to specific username
/getUserJoinDate/:username : GET request to fetch user's join date
/getUserBio/:username : GET request to get a user's bio
/generateText : POST request to generate text according to Hugging Face api (high level feature)

Recipes:
/createRecipe: POST request to create a recipe
/recipesByCriteria: GET request to retrieve recipes according to criteria
/recipesByUser/:username : GET request uses the username to get all recipes submitted by that user
/recipedetails: GET request to retrieve a recipe's details
/searchRecipes: GET request to search for recipes based on query

Reviews:
/createReview: POST request to create a review
/getReviewsByRecipe/:recipeId : GET request to get all reviews for a specific recipe using its id
/getReviewsByUser/:username : GET request to get all reviews by user using his username
/deleteReview/:reviewId/:recipeId: POST request to delete review according to review id and recipe id

Cuisines:
/getCuisineIdByName/:cuisineName : GET request to get cuisine id from name
/getCuisineNameById/:cuisineId : GET request to get cuisine name from id
/getAllCuisines : GET request to retrieve all cuisines from database

3. Database Schema Description:

User Table:
UserID (INT): Unique identifier for each user
Username (VARCHAR): user's username
Password (VARCHAR): user's password (hashed)
Email (VARCHAR) : user's email
JoinDate (DATE): date of registration

Recipe Table:
RecipeID (INT): Unique identifier for each recipe
UserID (INT FK) : id of the user who created it
Title (VARCHAR): recipe title
Description/Ingredients/Instructions (TEXT): details about the recipe
CuisineID (INT FK): associated cuisine id
calories (INT): calories in the recipe
DietaryPreferences(ENUM): vegan/vegetarian/pescetarian etc

Review Table:
ReviewID(INT) : unique identifier for each review
RecipeID(INT FK): recipe being reviewed
UserID(INT FK): user who submitted review
Content (TEXT): review content
Value(INT) : value of rating (1/5)
ReviewDate(DATE): date of review submission

Cuisine Table:
CuisineID (INT): unique identifier for each cuisine
CuisineName(VARCHAR): names of cuisines

4. Third-party Libraries Used:
- bcrypt: password hashing
- jsonwebtoken: JWT-based authentication
- express-validator: input validation
- mysql2: database connection
- dotenv: environment variable management
- sequelize: database modeling and query management
- axios: making HTTP requests
- swagger: interactive documentation
- cors: enabling cross-origin resource sharing (backend and frontend)

5. Testing Application:
Use swagger (interactive API documentation) to test any route you want:

http://localhost:3001/recipeRouletteDoc 

NOTE!!! Make sure to first login and use the token retrieved to authorize rest of the routes !!!

6. Technical Documentation:

Inline comments are added for each function (its purpose, params and what it returns (in case of error and in case of success))