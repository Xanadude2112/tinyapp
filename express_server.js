// Import the express library/module
const express = require("express");

// Create a new instance of an Express application
const app = express();

// Define the port number the server will listen on
const PORT = 8080; // Default port 8080

app.set("view engine", "ejs");// tells the Express app to use EJS as its templating engine

// Define a database object that maps short URLs to their corresponding long URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Define a route handler for GET requests to the root URL ("/")
// "req" is like a messenger from the client's browser to the server, containing details about the client's request.
// It holds information like parameters, headers, cookies, and more.
  
// "res" is like a messenger from the server back to the client's browser, containing methods and data to send a response.
// It provides ways to send data back to the client, such as HTML, JSON, files, or just a simple string like "Hello!".
app.get("/", (req, res) => {
  // Send the response "Hello!" to the client
  res.send("Hello!");
});

// Handle GET requests to "/urls.json"
app.get("/urls.json", (req, res) => {
  // When a client/browser requests "/urls.json", the server responds by sending the `urlDatabase` object as JSON data.
  // The server uses the `res` object's `json()` method to send the JSON response back to the client.
  // This method automatically sets the appropriate Content-Type header to indicate that the response is in JSON format.
  res.json(urlDatabase); //converts the urlDatabase object into a JSON string
})

// Handle GET requests to "/hello"
app.get("/hello", (req, res) => {
  // When a client/browser requests "/hello", the server responds by sending an HTML page containing the text "Hello <b>World</b>"
  // The server uses the `res` object's `send()` method to send the HTML response back to the client.
  // This method sets the Content-Type header to indicate that the response is HTML.
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // Create an object `templateVars` containing the `urlDatabase` data
  // This object will be used to pass data to the template (view) for rendering
  const templateVars = { urls: urlDatabase }; 
  // Render the "urls_index" template using the provided template variables
  // The `urls_index` template will use the data in `templateVars` to dynamically generate HTML
  res.render("urls_index", templateVars)
})

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});
// Start the Express server and make it listen for incoming connections on the specified port
app.listen(PORT, () => {
  // Log a message to the console indicating that the server is listening on the specified port
  console.log(`Example app listening on port ${PORT}!`);
});