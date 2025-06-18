import axios from "axios";

// initializes common route from backend for frontend use
export default axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json" 
  }
});