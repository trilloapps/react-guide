import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 5000, // Adjust the timeout as needed
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YourAccessTokenHere',
      // Add any other headers you want to set globally
    },
  });
  
  export default instance;