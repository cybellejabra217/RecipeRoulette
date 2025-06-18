import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RecipeService from "../../services/RecipeService";
import UserService from "../../services/UserService";
import './homepage.css';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CuisineService from "../../services/CuisineService";

const Homepage = ({ handleLogout }) => {

  // sets all the state variables (search query, loading, loadingGPT, cuisines, selected cuisines, selected diatary preference, question and answer)
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGPT, setLoadingGPT] = useState(false);
  const [cuisines, setCuisines] = useState([]); 
  const [selectedCuisine, setSelectedCuisine] = useState("0");
  const [selectedDietaryPreference, setSelectedDietaryPreference] = useState("All");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate(); // to be able to navigate

  // fetch cuisines from API on component load
  useEffect(() => {
    const fetchCuisines = async () => {
      try {

        // uses service getCuisines to fetch all cuisines for portrayal on drop box
        const response = await CuisineService.getCuisines(); 
        console.log(response);
        setCuisines(response.data || []);
      } catch (error) {
        toast.error(`Failed to fetch cuisines: ${error.message}`);
      }
    };

    fetchCuisines();
  }, []);

  /**
   * Function to handle asking a question to the AI.
   * It triggers an API request to get a response from the AI.
   */
  const handleAskQuestion = async () => {

      setLoadingGPT(true);
      setAnswer(""); // reset answer for new question
      try {

        // generataes the text according to user's question
        const answer = await UserService.generateText(question)
        setAnswer(answer);
        setLoadingGPT(false);
      } catch (error) {

        // catches error
          console.error("Error fetching ChatGPT response:", error);
          setAnswer("Sorry, there was an error processing your request.");
      } finally {
          setLoading(false);
      }
  };

  /**
   * Function to search for recipes based on the selected filters.
   * It triggers a search API request using the RecipeService.
   */
  const searchRecipes = async () => {
    try {
      setLoading(true);

      // sets all the filters according to search query, cuisine and dietary preference
      const filters = {
        searchQuery,
        cuisine: selectedCuisine,
        dietaryPreference: selectedDietaryPreference,
      };

      // search for recipes according to filters
      const recipes = await RecipeService.search(filters);

      // navigate to search recipes page showing all received recipes
      navigate("/searchRecipes", { state: { recipes, filters } });
    } catch (error) {
      toast.error(`Failed to search recipes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="homepage-container" >
      {/* main content */}
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          px: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dare to Explore the Flavors!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Choose whatever your heart desires
          <br />
          through simple filtering
        </Typography>

        {/* search box */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          {/* search feld */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search Recipe"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />

          {/* cuisine dropdown */}
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="cuisine-label">Cuisine</InputLabel>
            <Select
              labelId="cuisine-label"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              disabled={loading}
            >
              <MenuItem key="0" value="0">All</MenuItem>
              {cuisines.map((cuisine) => (
                <MenuItem key={cuisine.CuisineID} value={cuisine.CuisineID}>
                  {cuisine.CuisineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* deitary preferences dropdown */}
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="dietary-label">Dietary Preference</InputLabel>
            <Select
              labelId="dietary-label"
              value={selectedDietaryPreference}
              onChange={(e) => setSelectedDietaryPreference(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Vegan">Vegan</MenuItem>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Pescetarian">Pescetarian</MenuItem>
              <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
              <MenuItem value="Lactose-Free">Lactose-Free</MenuItem>
            </Select>
          </FormControl>

          {/* search button */}
          <Button
            variant="contained"
            color="primary"
            onClick={searchRecipes}
            disabled={loading}
            sx={{ width: "150px" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Search"
            )}
          </Button>
        </Box>
      </Box>

      <div style={{ padding: "20px" }}>
            <h1>Q&A</h1>
            <textarea
                placeholder="Ask your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                style={{ width: "100%", marginBottom: "10px" }}
            />
            <button onClick={handleAskQuestion} disabled={loadingGPT || !question.trim()}>
                {loadingGPT ? "Asking..." : "Ask Your Question!"}
            </button>
            {answer && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#f1f1f1" }}>
                    <strong>Answer:</strong>
                    <p>{answer}</p>
                </div>
            )}
        </div>

    </Box>
  );
};

export default Homepage;
