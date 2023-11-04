// Import express
const express = require('express');

// Initialize the express application
const app = express();

// Define a route for GET requests to '/'
app.get('/', (req, res) => {
  // Send 'Hello World' response
  res.send('Hello World');
});

// Set the server to listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
