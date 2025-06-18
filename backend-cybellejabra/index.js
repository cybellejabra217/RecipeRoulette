// import all needed libraries and modules
const dotenv = require("dotenv"); 
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// enable CORS and Body parsing
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import routes 
const cuisineRoutes = require('./Routes/CuisineRoute');
const loginRoutes = require('./Routes/LoginRoute');
const recipeRoutes = require('./Routes/RecipeRoute');
const userRoutes = require('./Routes/UserRoute');
const reviewRoutes = require('./Routes/ReviewRoute');

// swagger documentation configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API Documentation',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./Routes/*.js'], // path to route files for Swagger docs
};

// generating Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI at /recipeRouletteDoc
app.use("/recipeRouletteDoc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// use imported routes 
app.use(loginRoutes);
app.use(cuisineRoutes);
app.use(recipeRoutes);
app.use(userRoutes);
app.use(reviewRoutes);

// set the port and start the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/recipeRouletteDoc`);
});
